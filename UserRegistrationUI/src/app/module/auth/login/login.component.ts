import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { IUserModel } from '../../shared/user.model';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public loginForm: FormGroup;
  public successMessage: string;
  public authMessage: string;
  public authMessageSub: Subscription;
  public failMessage: string;
  public passwordFieldTextType = false;
  public confirmPasswordFieldTextType = false;
  public otpPreferenceValue: string;
  public submitButtonStatus = false;
  public regSub = new Subscription();
  public userLoginData: any;
  // private valueChangeSub: Subscription;
  public validationMessages = { 
    email: {
      required: 'Email is required.',
      email: 'Enter a valid email id.',
    },
    password: {
      required: 'Password required.',
      minlength: 'Password will contain atleast 6 characters.',
      maxlength: 'Password should not be greater than 15 characters.'
    }
  };

  public formErrors = {
    email: '',
    password: '',
  };
  public isLoading = false;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginFormCreation();
    // This observable will triggered each an every value insertion in form field
    // and it will call the logValidation() method.
    this.subscription.add(this.loginForm.valueChanges.subscribe(value => this.logValidationErrors(this.loginForm)));
  }

  // This is form control creation method
  public loginFormCreation(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
    });
  }


  // This method is implemented for logging the error of every form elemenet
  public logValidationErrors(group: FormGroup = this.loginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && abstractControl.errors &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] = messages[errorKey];
          }
        }
      }
    });
  }

  public togglePasswordFieldTextType(): void {
    this.passwordFieldTextType = !this.passwordFieldTextType;
  }

  // This is method will help to submit the form after clicking the submit button.
  public onSubmit(event: Event): void {
    event.preventDefault();
    if (this.loginForm.valid) {
      this.submitButtonStatus = true;
      this.isLoading = true;
      this.userLoginData = this.mapFormValueToUserModel();
      console.log('UserData', this.userLoginData);
      this.successMessage = '';
      this.failMessage = '';
      if (this.userLoginData) {
        this.subscription.add(this.userService.login(this.userLoginData).subscribe(
          resData => {
            console.log('Response from login: ', resData);
            this.successMessage = 'Successfully Logged in';
            this.loginForm.reset();
            this.authMessage = '';
            this.isLoading = false;
            sessionStorage.setItem('JwtToken', resData.jwtToken);
            this.router.navigate(['/view-users']);
            // console.log(this.loginForm);
          },
          resError => {
            console.log('Error from login: ', resError);
            this.failMessage = resError;
            this.isLoading = false;
            this.submitButtonStatus = false;
            this.authMessage = '';
          }
        ))
      }
    }

  }
  // This method will map form value to class property
  public mapFormValueToUserModel(): IUserModel {
    const userLoginData = Object.assign({}, this.loginForm.value);
    return userLoginData;

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
