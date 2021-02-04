import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public users: any[] = [];
  public noUserData: string;
  public isLoading: boolean = false;

  
  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllUser();
  }

  public getAllUser(): void {
    this.isLoading = true;
    this.subscription.add(
      this.userService.getAllUser().subscribe(res => {
        console.log('Response from get users :', res.users[0]);
        this.users.push(res.users[0]);
        console.log('users :', this.users);
        this.isLoading = false;
      },
      error => {
        console.log('Error from get users data: ', error);
        this.noUserData = error;
        this.isLoading = false;
      })
    )
    
  }

  public onClick(): void {
    this.userService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
