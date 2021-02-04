import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmAccountComponent } from './module/auth/confirm-account/confirm-account.component';
import { LoginComponent } from './module/auth/login/login.component';
import { SignupComponent } from './module/auth/signup/signup.component';
import { PageNotFountComponent } from './module/page-not-fount/page-not-fount.component';
import { AuthCanActivateGuard } from './module/auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'confirmemail', component: ConfirmAccountComponent },
  {
    path: 'view-users',
    canActivate: [AuthCanActivateGuard],
    loadChildren: () => import('./module/view-user/view-user.module').then(m => m.ViewUserModule)
  },
  { path: 'not-found', component: PageNotFountComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
