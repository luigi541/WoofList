import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../modules/user.module';
import { AllDogs } from '../modules/allDogs.model';
import { DogsService } from '../services/Dogs.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  user: User | null = null;
  dogs: AllDogs[] = [];

  constructor(
    private dogsService: DogsService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.userLogged;
  }

  ngOnInit() {
    this.getFavoriteDogs();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }


  getFavoriteDogs() {
    const dogIds = this.user?.likes ?? [];

    this.dogsService.getAllDogsByIds(dogIds).subscribe(
      (dogs) => {
        console.log('dogs: ', dogs);
        this.dogs = dogs;
      },
      (error) => {
        console.error('Error fetching dogs:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
