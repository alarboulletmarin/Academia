import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { Assignment } from '../../../core/models/assignment.model';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';
import { SubjectService } from '../../../core/services/subject/subject.service';
import { ProfessorService } from '../../../core/services/professor/professor.service';
import { AssignmentDialogComponent } from '../../../shared/components/assignment/assignment-dialog/assignment-dialog.component';

@Component({
  selector: 'app-list-assignments-page',
  templateUrl: './list-assignments-page.component.html',
  styleUrls: ['./list-assignments-page.component.scss'],
})
export class ListAssignmentsPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'title',
    'description',
    'professor',
    'group',
    'dueDate',
  ];
  public assignments: Assignment[] = [];
  public totalAssignments = 0;
  public currentPage = 1;
  public assignmentsPerPage = 5;
  public currentSortDirection = 'asc';
  public currentSortField = 'dueDate';
  public currentSearchTerm = '';

  public subjects: string[] = [];
  public professors: any[] = [];

  public currentSubject = '';
  public currentProfessor = '';

  constructor(
    private assignmentService: AssignmentService,
    private dialog: MatDialog,
    private subjectService: SubjectService,
    private professorService: ProfessorService,
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadProfessors();
    this.loadAssignments();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((pageEvent: PageEvent) => {
        this.currentPage = pageEvent.pageIndex + 1;
        this.assignmentsPerPage = pageEvent.pageSize;
        this.loadAssignments();
      });
    } else {
      console.error('Paginator is undefined.');
    }

    if (this.sort) {
      this.sort.sortChange.subscribe((sort: Sort) => {
        this.currentSortField = sort.active;
        this.currentSortDirection = sort.direction;
        this.loadAssignments();
      });
    } else {
      console.error('Sort is undefined.');
    }
  }

  public loadAssignments(): void {
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('limit', this.assignmentsPerPage.toString())
      .set('sortBy', this.currentSortField)
      .set('order', this.currentSortDirection)
      .set('search', this.currentSearchTerm)
      .set('subject', this.currentSubject)
      .set('professor', this.currentProfessor);

    this.assignmentService.getAssignments(params).subscribe({
      next: ({ assignments, totalResults }) => {
        this.assignments = assignments;
        this.totalAssignments = totalResults;
      },
      error: (error) => console.error('Error fetching assignments:', error),
    });
  }

  public applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement) {
      this.currentSearchTerm = inputElement.value.trim().toLowerCase();
      this.currentPage = 1;
      this.paginator.pageIndex = 0;
      this.loadAssignments();
    }
  }

  resetSubjectFilter() {
    this.currentSubject = '';
    this.loadAssignments();
  }

  resetProfessorFilter() {
    this.currentProfessor = '';
    this.loadAssignments();
  }

  public openAssignmentDialog(assignment: Assignment): void {
    const dialogRef = this.dialog.open(AssignmentDialogComponent, {
      width: '500px',
      data: assignment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadAssignments();
      }
    });
  }

  private loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (data) => {
        this.subjects = data.map((subject) => subject.name);
      },
      error: (error) => {
        console.error('Error fetching subjects:', error);
      },
    });
  }

  private loadProfessors(): void {
    this.professorService.getProfessors().subscribe({
      next: (data) => {
        this.professors = data.map((professor) => ({
          firstName: professor.firstName,
          lastName: professor.lastName,
        }));
      },
      error: (error) => {
        console.error('Error fetching professors:', error);
      },
    });
  }
}
