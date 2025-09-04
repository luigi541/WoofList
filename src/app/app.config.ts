import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { DogsService } from './services/Dogs.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    AuthService,
    DogsService,
    importProvidersFrom(HttpClientModule),
  ],
};
