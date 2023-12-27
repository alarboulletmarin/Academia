import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';
import { Assignment } from '../../../core/models/assignment.model';
import { HttpParams } from '@angular/common/http';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  protected assignmentsOfTheDay: Assignment[] = [];
  private allAssignments: Assignment[] = [];
  private totalAssignments!: number;

  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.redirectToLogin();
    }
    this.loadAssignmentsOfTheDay();
  }

  public loadAssignmentsOfTheDay(): void {
    const currentDate = new Date();
    console.log(currentDate);

    this.userService.getUser(this.authService.getUserId()).subscribe(
      (user) => {
        if (user.onModel === 'Professor') {
          const professorId = user.profile;

          const params = new HttpParams()
            .set('dueDate', currentDate.toISOString())
            .set('professor', professorId)
            .set('paginate', 'false');

          this.assignmentService.getAssignments(params).subscribe({
            next: ({ assignments, totalResults }) => {
              this.assignmentsOfTheDay = assignments;
              this.totalAssignments = totalResults;
              console.log('Assignments of the day:', assignments);
            },
            error: (error) =>
              console.error('Error fetching assignments:', error),
          });
        } else {
          console.error('User is not a professor.');
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      },
    );
  }

  viewAssignment(_id: string | undefined) {}
}
