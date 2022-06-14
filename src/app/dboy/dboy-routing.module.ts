import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DboyPage } from './dboy.page';

const routes: Routes = [
  {
    path: '',
    component: DboyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DboyPageRoutingModule {}
