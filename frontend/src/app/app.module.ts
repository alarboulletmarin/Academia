import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { PagesNotFoundComponent } from './pages/pages-not-found/pages-not-found.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './core/layout.module';
import { AssignmentDialogComponent } from './shared/components/assignment/assignment-dialog/assignment-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthPageComponent } from './pages/auth/auth-page/auth-page.component';
import { ListAssignmentsPageComponent } from './pages/assignments/list-assignments-page/list-assignments-page.component';
import { AddAssignmentsPageComponent } from './pages/assignments/add-assignments-page/add-assignments-page.component';
import { ListUsersPageComponent } from './pages/user/list-users-page/list-users-page.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthInterceptor } from './core/http-interceptors/auth-interceptors';
import { GenerateAssignmentsPageComponent } from './pages/assignments/generate-assignments-page/generate-assignments-page.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

const COMPONENTS = [
  AppComponent,
  AuthPageComponent,
  HomePageComponent,
  ListAssignmentsPageComponent,
  AddAssignmentsPageComponent,
  ListUsersPageComponent,
  PagesNotFoundComponent,
  AssignmentDialogComponent,
  GenerateAssignmentsPageComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    LayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
