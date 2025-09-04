import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './modules/user.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'trabalho';
  username: string;

  // this.authService.userLogged?.username ?? '' == this.authService.userLogged ? this.authService.userLogged.username : ''
  constructor(private authService: AuthService) {
    this.username = this.authService.userLogged?.username ?? '';
  }
  ngOnInit(): void {
    this.username = this.authService.userLogged?.username ?? '';
  }
}
