import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_CONSTANTS } from './app.constant';
import { PagesNotFoundComponent } from './pages/pages-not-found/pages-not-found.component';
import { authGuard } from './core/security/auth.guard';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth/auth-page/auth-page.component';
import { ListAssignmentsPageComponent } from './pages/assignments/list-assignments-page/list-assignments-page.component';
import { AddAssignmentsPageComponent } from './pages/assignments/add-assignments-page/add-assignments-page.component';
import { ListUsersPageComponent } from './pages/user/list-users-page/list-users-page.component';
import { GenerateAssignmentsPageComponent } from './pages/assignments/generate-assignments-page/generate-assignments-page.component';
import { CalendarComponent } from './pages/calendar/calendar-page/calendar/calendar.component';
import { GradeAssignmentPageComponent } from './pages/assignments/grade-assignment-page/grade-assignment-page.component';

const routes: Routes = [
  // AUTH PAGE
  {
    path: APP_CONSTANTS.routerLinks.auth,
    component: AuthPageComponent,
    pathMatch: 'full',
  },
  // HOME PAGE
  {
    path: APP_CONSTANTS.routerLinks.home,
    component: HomePageComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor', 'student'] },
  },
  // CALENDAR PAGE
  {
    path: APP_CONSTANTS.routerLinks.calendar,
    component: CalendarComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor', 'student'] },
  },
  // ASSIGNMENTS LIST PAGE
  {
    path: APP_CONSTANTS.routerLinks.listAssignments,
    component: ListAssignmentsPageComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor', 'student'] },
  },
  // ASSIGNMENT ADD PAGE
  {
    path: APP_CONSTANTS.routerLinks.addAssignment,
    component: AddAssignmentsPageComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor'] },
  },
  // GRADE ASSIGNMENT PAGE
  {
    path: APP_CONSTANTS.routerLinks.gradeAssignment,
    component: GradeAssignmentPageComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor'] },
  },
  // ASSIGNMENT GENERATE PAGE
  {
    path: APP_CONSTANTS.routerLinks.generateAssignments,
    component: GenerateAssignmentsPageComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor'] },
  },
  // USERS PAGE
  {
    path: APP_CONSTANTS.routerLinks.users,
    component: ListUsersPageComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
    data: { expectedRoles: ['professor'] },
  },
  // ERROR PAGE
  { path: '**', component: PagesNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
