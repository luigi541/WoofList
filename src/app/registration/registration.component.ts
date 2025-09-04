import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  @ViewChild('regForm') form!: NgForm;

  newUsername: string = '';
  newPassword: string = '';
  confirmedPass: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  reset(): void {
    this.newUsername = '';
    this.newPassword = '';
    this.confirmedPass = '';
  }
  goback():void{
    this.router.navigate(['']);
  }
  disable(): boolean {
    if (
      this.newUsername.length <= 0 ||
      this.newPassword.length < 8 ||
      this.confirmedPass.length <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  create(): void {
    if (this.newPassword.trim() === this.confirmedPass.trim()) {
      this.authService
        .checkUserExists(this.newUsername)
        .pipe(
          switchMap((userExists: boolean) => {
            if (!userExists) {
              return this.authService.register(
                this.newUsername,
                this.newPassword
              );
            } else {
              alert('User already exists!');
              return of(null); // or handle the case where the user exists
            }
          })
        )
        .subscribe({
          next: (user) => {
            if (user) {
              alert('User registered successfully!');
              this.reset();
              this.router.navigate(['']);
            }
          },
          error: (err) => {
            console.error('Error registering user:', err);
            alert('Error registering user!');
          },
        });
    } else {
      alert('Passwords do not match!');
    }
  }
}
