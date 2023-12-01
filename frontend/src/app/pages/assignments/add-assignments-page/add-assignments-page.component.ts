import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from '../../../core/models/subject.model';
import { Professor } from '../../../core/models/professor.model';
import { Promotion } from '../../../core/models/promotion.model';
import { Group } from '../../../core/models/group.model';
import { AssignmentAttachment } from '../../../core/models/attachment.model';
import { ProfessorService } from '../../../core/services/professor/professor.service';
import { SubjectService } from '../../../core/services/subject/subject.service';
import { GroupService } from '../../../core/services/group/group.service';
import { AssignmentService } from '../../../core/services/assignment/assignment.service';
import { Assignment } from '../../../core/models/assignment.model';

@Component({
  selector: 'app-add-assignments-page',
  templateUrl: './add-assignments-page.component.html',
  styleUrls: ['./add-assignments-page.component.css'],
})
export class AddAssignmentsPageComponent implements OnInit {
  // form groups
  public firstFormGroup!: FormGroup;
  public secondFormGroup!: FormGroup;
  public thirdFormGroup!: FormGroup;

  public isLoading: boolean = false;
  public subjects: Subject[] = [];
  public professors: Professor[] = [];
  public groups: string[] = [];
  public promotions: Promotion[] = [];
  public allGroups: Group[] = [];
  public attachments: AssignmentAttachment[] = [];
  public selectedDate: Date | null = new Date();

  constructor(
    private _formBuilder: FormBuilder,
    private professorService: ProfessorService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private assignmentService: AssignmentService,
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      dueDate: ['', Validators.required],
      subject: ['', Validators.required],
      professor: ['', Validators.required],
      group: { value: '', disabled: true, validators: Validators.required },
    });

    this.thirdFormGroup = this._formBuilder.group({
      attachmentType: ['link'],
      attachmentValue: [''],
    });

    this.isLoading = true;

    this.subjectService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });

    this.professorService.getProfessors().subscribe((professors) => {
      this.professors = professors;
    });

    this.groupService.getGroups().subscribe((groups) => {
      this.allGroups = groups;
    });

    this.isLoading = false;
  }

  public getGroupName(groupId: string): string {
    const group = this.allGroups.find((g) => g._id === groupId);
    return group ? group.name : 'Groupe inconnu';
  }

  submit() {
    if (
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.thirdFormGroup.valid
    ) {
      this.isLoading = true;
      const newAssignment: Assignment = {
        title: this.firstFormGroup.value.title,
        description: this.firstFormGroup.value.description,
        dueDate: this.secondFormGroup.value.dueDate,
        subject: this.secondFormGroup.value.subject,
        professor: this.secondFormGroup.value.professor,
        group: this.secondFormGroup.value.group,
        attachment: this.thirdFormGroup.value.attachmentValue,
      };

      this.assignmentService.addAssignment(newAssignment).subscribe({
        next: () => {
          this.isLoading = false;
          // Traitez la réponse ici, par exemple redirigez l'utilisateur ou affichez un message de succès
        },
        error: (error) => {
          this.isLoading = false;
          // Gérez l'erreur ici, par exemple affichez un message d'erreur
        },
      });
    }
  }

  onDateChange(newDate: Date | null) {
    this.selectedDate = newDate;
    this.secondFormGroup.get('dueDate')!.setValue(newDate);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.thirdFormGroup.get('attachmentValue')!.setValue(file.name);
    }
  }

  addAttachment() {
    if (this.thirdFormGroup.valid) {
      const attachment: AssignmentAttachment = {
        type: this.thirdFormGroup.value.attachmentType,
        value: this.thirdFormGroup.value.attachmentValue,
      };
      this.attachments.push(attachment);
      this.thirdFormGroup.reset({ attachmentType: 'link' });
    }
  }
}
