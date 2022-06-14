import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})

export class AccountPage implements OnInit {
@ViewChild('content',{static:false}) private content: any;

data:any;
action:any;
text:any;
order:any;

  constructor(private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public loadingController: LoadingController){

    this.text = JSON.parse(localStorage.getItem('app_text'));
  
  }

  ngOnInit()
  {
  }

  ionViewWillEnter()
  {
    if(!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null')
    {
      this.nav.navigateRoot('/login');
    }
    else
    {
      this.loadData();
    }
  }

  async takeAction(type)
  {    
    this.action = type;
  }

  async loadData()
  {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
    });
    await loading.present();

    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response:any) => {
  
    this.data  = response.data;
    this.order = response.order;

    loading.dismiss();

    });
  }

  async update(data)
  {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
    });
    await loading.present();

    this.server.updateInfo(data).subscribe((response:any) => {

    if(response.data == "error")
    {
      this.presentToast(this.text.s_email_error);
    }
    else
    {
      this.data = response.res;

      this.presentToast(this.text.s_setting_update);
    }

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

  logout()
  {
    localStorage.setItem('user_id',null);

    this.nav.navigateForward('/login');
  }

  storeOpen(type)
  {
    this.server.storeOpen(type+"?user_id="+localStorage.getItem('user_id')).subscribe((response:any) => {

      
    });
  }
}
