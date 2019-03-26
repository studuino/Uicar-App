import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MainPage } from './main.page';
import { ModalPagePage } from '../modal-page/modal-page.page';
import { ModalTablonPage } from '../modal-tablon/modal-tablon.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
   declarations: [MainPage  , ModalTablonPage],
  entryComponents: [ ModalTablonPage ]
})
export class MainPageModule {}
