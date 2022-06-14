import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DboyPageRoutingModule } from './dboy-routing.module';

import { DboyPage } from './dboy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DboyPageRoutingModule
  ],
  declarations: [DboyPage]
})
export class DboyPageModule {}
