import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,AlertController,ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.page.html',
  styleUrls: ['edit.page.scss'],
})
export class EditPage {
	
  data:any;
  text:any;
  constructor(public toastController: ToastController,public alertController: AlertController,public server : ServerService,private nav: NavController,public loadingController : LoadingController)
  {
      this.data 	= JSON.parse(localStorage.getItem('idata'));
  }

  ionViewWillEnter()
  {
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }
  }

  ngOnInit()
  {
    
  }


  async edit(formData)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.editItem({ data:formData,id : this.data.id }).subscribe((response:any) => {
  
    this.presentToast("Price Updated Successfully");

    this.nav.navigateBack('item');

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
