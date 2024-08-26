import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { DashboardComponent } from './dashboard/dashboard.component';
import { BodyComponent } from './dashboard/body/body.component';
import { SidenavComponent } from './dashboard/sidenav/sidenav.component';
import { UsersComponent } from './dashboard/user/user.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import { CoupensComponent } from './dashboard/coupens/coupens.component';
import { PagesComponent } from './dashboard/pages/pages.component';
import { MediaComponent } from './dashboard/media/media.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    UsersComponent,
    StatisticsComponent,
    CoupensComponent,
    PagesComponent,
    MediaComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    ToastrModule.forRoot({ // ToastrModule added
      positionClass: 'toast-bottom-right', // Position of the toast
      timeOut: 3000, // Duration the toast will stay on screen
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
  providers: [BrowserModule, ReactiveFormsModule,HttpClientModule, BrowserAnimationsModule, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
