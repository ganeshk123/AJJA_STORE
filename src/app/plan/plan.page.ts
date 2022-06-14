import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';
import { Stripe } from '@ionic-native/stripe/ngx';
declare var RazorpayCheckout: any;

@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})

export class PlanPage implements OnInit {
@ViewChild('content',{static : false}) private content: any;

  text:any;
  data:any;
  plan_id:any;
  /*Stripe Config & Payment*/
  stripe_id:any;
  stripeView = false;
  card_no:any;
  exp_month:any;
  exp_year:any;
  cvv:any;
  payment:any;
  payment_id:any;
  amount:any;
  changePlan = false;

  constructor(private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController,public stripe : Stripe){

  this.text = JSON.parse(localStorage.getItem('app_text'));
  
  }

  ngOnInit()
  {
    this.loadData();
  }

  showPlan()
  {
  	this.changePlan = this.changePlan == true ? false : true;
  }

  selectPlan(plan)
  {
    this.plan_id = plan.id;
    this.amount  = plan.price;
  }

  setPayment(id)
  {
     this.payment = id;

    setTimeout(() => {
      this.content.scrollToBottom(300);
      }, 100);

    if(id == 2)
    {
      this.stripeView = true;
    }
    else
    {
      this.stripeView = false;
    }
  }

  async loadData()
  {
    const loading = await this.loadingController.create({
      message: '',
      spinner : 'bubbles'
    });
    await loading.present();

    this.server.myPlan().subscribe((response:any) => {
  
    this.data = response.data;

    loading.dismiss();

    });
  }

  async signup(data)
  {
    const loading = await this.loadingController.create({
      message: '',
      spinner : 'bubbles',
      duration : 3000
    });
    await loading.present();

    var allData = {

      payment_id      : this.payment_id,
      payment_method  : this.payment,
      plan_id         : this.plan_id,
      user_id 		  : localStorage.getItem('user_id')

    }

    console.log(allData);

    this.server.renew(allData).subscribe((response:any) => {
  
    this.presentToast("Success! Your plan has been changed successfully.");
    this.nav.navigateRoot('/home');

    loading.dismiss();

    });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:'dark'
    });
    toast.present();
  }

  makeOrder(formData)
  {
    if(this.payment == 2)
    {
      this.payWithStripe(formData);
    }
    else if(this.payment == 4)
    {
      this.payWithRazor(formData);
    }
  }

  payWithStripe(formData)
  {    
    var cNo = this.card_no;

    if(cNo && cNo.length == 16 && this.exp_month.length == 2 && this.exp_year.length == 4 && this.cvv.length == 3)
    {
        this.stripe.setPublishableKey(this.data.setting.stripe_key);

        let card = {
         number: cNo,
         expMonth: this.exp_month,
         expYear: this.exp_year,
         cvc: this.cvv
        }

        var cardNo        = false;
        var cvvCorrect    = false;

        //validate card no
        this.stripe.validateCardNumber(cNo)
          .then(res => {
            
          
          this.stripe.createCardToken(card)
            .then(token => {
              
              if(token.id)
              {
                this.makePayment(token.id,cNo,formData);
              }
              else
              {
                this.presentToast(this.text.card_no_validation);
              }

            })
            .catch(error => {

            this.presentToast(this.text.stripe_config);

            });


          })
          .catch(error => {

          this.presentToast(this.text.card_no_validation);

          });
    }
    else
    {
      this.presentToast(this.text.stripe_validation);
    }
  }

  async makePayment(token,cNo,formData)
  {
    const loading = await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loading.present();

    this.server.makeStripePayment("?token="+token+"&amount="+this.amount).subscribe((response:any) => {

    if(response.data == "done")
    {
        this.payment_id = response.id;

        if(this.payment_id)
        {
          this.signup(formData);
        }
    }
    else
    {
      this.presentToast(response.error);
    }

    loading.dismiss();

    });
  }


  payWithRazor(formData) {
    var options = {
      description: 'Pay Now',
      image: 'https://cdn.iconscout.com/icon/free/png-512/bhim-3-69845.png',
      currency: this.data.setting.currency_code,
      key: this.data.setting.razor_key,
      amount: this.amount * 100,
      name: 'Signup Your Store',
      prefill: {
        email: "signup@google.com",
        contact: formData.phone,
        name: formData.name
      },
      theme: {
        color: '#2196f3'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = (success)=> {
      
      this.payment_id = success;

      if(this.payment_id)
      {
        this.signup(formData);
      }

    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }
}
