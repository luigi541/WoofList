import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('loginForm') form!: NgForm;

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.form.valid) {
      this.authService
        .login(this.form.value.username, this.form.value.password)
        .subscribe({
          next: (resultado: boolean) => {
            if (resultado) {
              this.router.navigate(['/home']);
              this.authService.isUserLogged();
              console.log(this.authService.isUserLogged());
            } else {
              window.alert('Invalid credentials!');
            }
          },
          error: (erro) => {
            window.alert('Error logging in!');
          },
        });
    } else {
      window.alert('Please fill in all fields.');
    }
  }
}
