import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Assignment } from '../../../../core/models/assignment.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AssignmentService } from '../../../../core/services/assignment/assignment.service';
import { UserService } from '../../../../core/services/user/user.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    aspectRatio: 1,
    height: '75vh',
    dayMaxEvents: 2,
    datesSet: (dateInfo) => {
      const { startStr, endStr } = dateInfo;
      const start = new Date(startStr);
      const end = new Date(endStr);
      this.loadAllAssignments(start, end);
    },
  };

  private allAssignments: Assignment[] = [];
  private totalAssignments!: number;

  constructor(
    private authService: AuthService,
    private assignmentService: AssignmentService,
    private userService: UserService,
  ) {}

  public loadAllAssignments(start: Date, end: Date): void {
    this.userService.getUser(this.authService.getUserId()).subscribe(
      (user) => {
        if (user.onModel === 'Professor') {
          const professorId = user.profile;

          const params = new HttpParams()
            .set('professor', professorId)
            .set('start', start.toISOString())
            .set('end', end.toISOString())
            .set('paginate', 'false');

          this.assignmentService.getAssignments(params).subscribe({
            next: ({ assignments, totalResults }) => {
              this.allAssignments = assignments;
              this.totalAssignments = totalResults;

              this.calendarOptions.events = this.allAssignments.map(
                (assignment) => {
                  let dueDateObj = new Date(assignment.dueDate);
                  let dueDateISO = dueDateObj.toISOString();

                  return {
                    title: assignment.title,
                    start: dueDateISO,
                  };
                },
              );
            },
            error: (error) =>
              console.error('Error fetching all assignments:', error),
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
}
