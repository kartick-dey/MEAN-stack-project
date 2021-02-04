import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ViewUserComponent } from './view-user.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ViewUserRoutingModule } from './view-user-routing.module';


@NgModule({
  declarations: [
    ViewUserComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ViewUserRoutingModule
  ],
  exports: [
    ViewUserComponent
  ],
  providers: [],
})
export class ViewUserModule { }

