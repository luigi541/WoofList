import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { authGuard } from './guards/auth.guard';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, title: 'login' },
  {
    path: 'home',
    component: HomeComponent,
    title: 'home',
    canActivate: [authGuard],
  },
  { path: 'details/:id', component: DetailsComponent, title: 'details' },
  {
    path: 'registration',
    component: RegistrationComponent,
    title: 'registration',
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    title: 'favorites',
  },
];
