import { Component } from '@angular/core';
import {UsersService} from './services/users.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'CalzadaUsers';
  users: Observable<any[]>;

  constructor(public usersService: UsersService) {
    this.users = usersService.findAll();
  }

}
