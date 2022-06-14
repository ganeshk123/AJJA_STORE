import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../service/server.service';
import { ToastController,NavController,Platform,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-dboy',
  templateUrl: './dboy.page.html',
  styleUrls: ['./dboy.page.scss'],
})

export class DboyPage implements OnInit {

  oid:any;
  data:any;
  text:any;

  constructor(public loadingController : LoadingController,private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public platform:Platform) {

    this.oid    = this.route.snapshot.paramMap.get('id');
    this.text   = JSON.parse(localStorage.getItem('app_text'));

  }

  ngOnInit()
  {
    this.loadData();
  }

  async loadData()
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.getDboy(this.oid).subscribe((response:any) => {
    
    this.data = response.data;

    loading.dismiss();

    });
  }

  async assign(formData)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.server.orderProcess(this.oid,'3&dboy='+formData.dboy).subscribe((response:any) => {
    
    this.presentToast("Order Assigned Successfully.");

    this.nav.navigateRoot('home');

    loading.dismiss();

    });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 2000,
      position : 'top'
    });
    toast.present();
  }

}
