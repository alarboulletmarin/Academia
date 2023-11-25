import {NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./http-interceptors/token-interceptors";
import {AssignmentService} from "./services/assignment/assignment.service";
import {AuthService} from "./services/auth/auth.service";
import {GroupService} from "./services/group/group.service";
import {ProfessorService} from "./services/professor/professor.service";
import {SidenavService} from "./services/sidenav/sidenav.service";
import {UserService} from "./services/user/user.service";

@NgModule({
  imports: [],
  providers: [
    AssignmentService, AuthService, GroupService, ProfessorService, SidenavService, UserService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  ],
})
export class CoreModule {
}
