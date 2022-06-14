import { Component, OnInit } from '@angular/core';

import { Platform,NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages:any;

  userData:any;
  setting:any;
  lang_data:any;
  dir = 'ltr';
  text:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private nav: NavController,
  ) {

    if(localStorage.getItem('setting') && localStorage.getItem('setting') != undefined)
    {
      this.setting = JSON.parse(localStorage.getItem('setting'));
    }

    this.initializeApp();

    if(localStorage.getItem('user_data') && localStorage.getItem('user_data') != undefined && localStorage.getItem('user_data') != 'null')
    {
      this.userData = JSON.parse(localStorage.getItem('user_data'));
    }

    this.setting = JSON.parse(localStorage.getItem('setting'));

    /*if(localStorage.getItem('lang_data') && localStorage.getItem('lang_data') != 'null')
    {
      if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != 'null')
      {
        this.nav.navigateRoot('/home');
      }
      else
      {
        this.nav.navigateRoot('/login');
      }
    }
    else
    {
      this.nav.navigateRoot('/lang');
    }*/
    
    /*
    ********************************************
    **Setup language
    ********************************************
    */
    if(localStorage.getItem('lang_data') && localStorage.getItem('lang_data') != undefined)
    {
      this.lang_data = JSON.parse(localStorage.getItem('lang_data'));

      this.dir       = this.lang_data.type == '1' ? 'rtl' : 'ltr';
    }

    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
        this.text = JSON.parse(localStorage.getItem('app_text'));

         this.appPages = [
        {
          title: this.text.menu_home,
          url: '/home',
          icon: 'home'
        },
       
        {
          title: this.text.menu_my_account,
          url: '/account',
          icon: 'person-circle'
        },

        {
          title: this.text.my_plan,
          url: '/plan',
          icon: 'card'
        },

        {
          title: this.text.s_menu_item,
          url: '/item',
          icon: 'grid'
        },

        {
          title: this.text.d_my_order,
          url: '/my',
          icon: 'cart'
        },

        {
          title: this.text.menu_lang,
          url: '/lang',
          icon: 'flag'
        },

        {
          title: this.text.menu_contact,
          url: '/contact',
          icon: 'mail'
        },

        
      ];
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#f4f5f8');
      this.statusBar.styleDefault();
      
      if(this.setting)
      {
        this.sub();
      }

    });
  }

  
  ngOnInit() {
    
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  sub()
  {
    
    this.oneSignal.startInit(this.setting.s_push_app_id, this.setting.s_push_google);
    
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
     
        window.location.href = "/home";

    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      
        window.location.href = "/home";
    });

    if(localStorage.getItem('user_data') && localStorage.getItem('user_data') != undefined)
    {
          this.oneSignal.sendTags({user_id: this.userData.id});
    }

    this.oneSignal.endInit();
  }

  logout()
  {
    localStorage.setItem('user_id',null);

    this.nav.navigateRoot('/login');
  }
}
