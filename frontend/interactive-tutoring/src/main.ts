import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import {
  withInterceptorsFromDi,
  provideHttpClient
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { SocketService } from './app/core/services/web-socket.service';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule),
    SocketService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
]
}).catch((err) => console.error(err));
