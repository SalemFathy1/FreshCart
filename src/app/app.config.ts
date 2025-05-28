import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { register } from 'swiper/element/bundle';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MessageService } from 'primeng/api';
register();

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),provideHttpClient(withFetch()),MessageService]
};
