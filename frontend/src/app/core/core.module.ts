import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors/auth-interceptors';
import { AssignmentService } from './services/assignment/assignment.service';
import { AuthService } from './services/auth/auth.service';
import { GroupService } from './services/group/group.service';
import { ProfessorService } from './services/professor/professor.service';
import { SidenavService } from './services/sidenav/sidenav.service';
import { UserService } from './services/user/user.service';
import { I18nService } from './services/i18n/i18n.service';
import { SubmissionService } from './services/submission/submission.service';

@NgModule({
  imports: [],
  providers: [
    AssignmentService,
    AuthService,
    GroupService,
    ProfessorService,
    SidenavService,
    SubmissionService,
    UserService,
    I18nService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {}
