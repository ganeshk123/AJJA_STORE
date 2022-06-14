import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  data:any;
  text:any;
  store:any;
  complete:any;
  pet:number = 1;
  overview:any;
  cancel:any;
 intrr:any;


  constructor(public toastController: ToastController,public alertController: AlertController,public server : ServerService,private nav: NavController,public loadingController : LoadingController)
  {
    
  }

  ionViewWillEnter()
  {
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }

    this.loadData();
  }

  ngOnInit()
  {
    
  }

  async loadData()
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.homepage(localStorage.getItem('user_id'),0).subscribe((response:any) => {
    this.data      = response.data;
    this.store     = response.store;
    this.text      = response.text;
    this.overview  = response.overview;
    this.complete  = response.complete;
    this.cancel    = response.cancel;

    console.log(this.data);

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
    clearInterval(this.intrr);

    localStorage.setItem('odata', JSON.stringify(odata));
    localStorage.setItem('store_data', JSON.stringify(this.store));

    this.nav.navigateForward('/detail');
  }

  doRefresh(event) {

    this.loadData();

    setTimeout(() => {
      
      event.target.complete();
    }, 2000);
  }
}
