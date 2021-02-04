import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { NumberInputDirective } from './Custom_Directive/numberInput.directive';


@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    NumberInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    NumberInputDirective,
    CommonModule
  ]
})
export class SharedModule { }
