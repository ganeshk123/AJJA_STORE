import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class DetailPage {
  
  data:any;
  text:any;
  status:number;
  store_data:any;
  constructor(public toastController: ToastController,public alertController: AlertController,public server : ServerService,private nav: NavController,public loadingController : LoadingController)
  {
      this.data         = JSON.parse(localStorage.getItem('odata'));
      this.store_data   = JSON.parse(localStorage.getItem('store_data'));
      this.status       = this.data.status;
      this.text = JSON.parse(localStorage.getItem('app_text'));
  }

  ionViewWillEnter()
  {
    
  }

  ngOnInit()
  {
    console.log(this.data);
  }

  async presentAlertConfirm(id,status) {
    const alert = await this.alertController.create({
       header: this.text.d_confirm,
      message: this.text.cancel_order_confirm,
      mode:'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            
            this.startRide(id,status);

          }
        }
      ]
    });

    await alert.present();
  }

  async startRide(id,type)
  {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
    });
    await loading.present();

    this.server.orderProcess(id,type).subscribe((response:any) => {
    
    if(type == 5)
    {
      this.presentToast("Order Completed Successfully.");

      this.nav.navigateRoot('home');
    }
    else if(type == 2)
    {
      this.presentToast(this.text.s_order_cancel_msg);

      this.nav.navigateRoot('home');
    }
    else
    {
      this.presentToast(this.text.s_order_status_msg);
    }

    this.status = response.data;

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

  detail(odata)
  {
    localStorage.setItem('odata', JSON.stringify(odata));
    
    this.nav.navigateForward('/detail');
  }
}
