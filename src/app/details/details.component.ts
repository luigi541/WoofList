import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DogsService } from '../services/Dogs.service';
import { AllDogs } from '../modules/allDogs.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CommonModule, FontAwesomeModule],
  standalone: true,
})
export class DetailsComponent implements OnInit {
  dog: AllDogs | undefined = undefined;
  faSolidHeart = faSolidHeart;
  faOutlinedHeart = faRegularHeart;
  hasLike: boolean = false;

  userId: number = this.authService.userID;

  constructor(
    private route: ActivatedRoute,
    private dogService: DogsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const dogId = Number(this.route.snapshot.params['id']);
    this.loadDogDetails(dogId);
    this.checkLikeOnDog(this.userId, dogId);
    console.log(this.userId);
  }

  checkLikeOnDog(userId: number, dogId: number) {
    this.dogService
      .checkDogLike(userId, dogId)
      .subscribe((hasLike) => (this.hasLike = hasLike));
  }

  addFavoriteDog(userId: number, dogId: number) {
    console.log('addfavoriteDog');
    /**
     * User => likes[] => dogIds
     *
     * portanto se queremos adicionar um dog aos favorites basicamente estamos a fazer
     * um update ao array de likes do user
     *
     * 1º - adicionamos o like;
     * 2º - recebemos dentro do subscribe o user updated
     * 3º - atualizamos o user dentro do authService para ficar com os dados mais recentes
     */
    this.dogService.addLike(userId, dogId).subscribe(
      (updatedUser) => {
        this.authService.updateCurrentUser(updatedUser);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  removeFavoriteDog(userId: number, dogId: number) {
    this.dogService.removeLike(userId, dogId).subscribe(
      (updatedUser) => {
        this.authService.updateCurrentUser(updatedUser);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  onHeartClick() {
    const dogId = this.dog?.id || 0;
    if (this.hasLike) {
      this.removeFavoriteDog(this.userId, dogId);
    } else {
      this.addFavoriteDog(this.userId, dogId);
    }
    this.hasLike = !this.hasLike;
  }

  loadDogDetails(dogId: number): void {
    this.dogService.getDogById(dogId).subscribe((dog) => {
      this.dog = dog;
    });
  }

  home() {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  xpto(): void {
    this.router.navigate(['/favorites']);
  }
}
