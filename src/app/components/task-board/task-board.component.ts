import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

type TaskColumns = 'todo' | 'inProgress' | 'done';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatInputModule, MatButtonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatCardModule],
  animations: [
    trigger('taskMove', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.9)' }),
        animate(
          '500ms cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        )
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px) scale(0.9)' })
        )
      ])
    ])
  ],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent {
  columns: TaskColumns[] = ['todo', 'inProgress', 'done'];

  tasks: { [key in TaskColumns]: string[] } = {
    todo: ['Task 1', 'Task 2', 'Task 3'],
    inProgress: ['Task 4'],
    done: ['Task 5', 'Task 6']
  };

  constructor(private dialog: MatDialog) {}

  onDrop(event: CdkDragDrop<string[]>, column: TaskColumns) {
    // إذا كانت العملية داخل نفس العمود
    if (event.previousContainer === event.container) {
      const list = this.tasks[column];
      const [movedItem] = list.splice(event.previousIndex, 1); // إزالة العنصر من الموقع القديم
      list.splice(event.currentIndex, 0, movedItem); // إضافة العنصر في الموقع الجديد
    } else {
      // إذا كانت العملية بين عمودين مختلفين
      const previousList = event.previousContainer.data;
      const currentList = event.container.data;
  
      const [movedItem] = previousList.splice(event.previousIndex, 1); // إزالة العنصر من العمود القديم
      currentList.splice(event.currentIndex, 0, movedItem); // إضافة العنصر في العمود الجديد
    }
  }
  

  addTask(column: TaskColumns) {
    const dialogRef = this.dialog.open(AddTaskDialog);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // إذا كان العمود غير موجود، قم بإنشائه
        if (!this.tasks[column]) {
          this.tasks[column] = [];
        }
        this.tasks[column].push(result); // إضافة المهمة للعمود
      }
    });
  }

  deleteTask(column: TaskColumns, index: number) {
    this.tasks[column].splice(index, 1);
  }
  

  getConnectedColumns(currentColumn: TaskColumns): string[] {
    return this.columns.filter(c => c !== currentColumn);
  }

}

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <h1 mat-dialog-title>Add New Task</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Task Name</mat-label>
        <input matInput [(ngModel)]="taskName">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button class="delete-btn" (click)="onNoClick()">Delete</button>
      <button mat-button class="add-btn" [mat-dialog-close]="taskName">Add</button>
    </div>

  `,
  styles: [`
    .mat-dialog-container {
      border-radius: 12px;
      padding: 24px;
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  
    h1[mat-dialog-title] {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      text-align: center;
      color: #3f51b5;
    }
  
    mat-dialog-content {
      margin-top: 20px;
      
    }
  
    mat-form-field {
      width: 100%;
      
    }
  
    mat-dialog-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      
    }
  
    button[mat-button] {
      font-weight: bold;
    }

    /* Styling for dialog buttons */
    mat-dialog-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    button[mat-button] {
      font-weight: bold;
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      text-transform: uppercase;
    }

    /* Delete Button */
    button.delete-btn {
      background-color: #e53935;
      color: white;
    }

    button.delete-btn:hover {
      background-color: #c62828;
    }

    /* Add Button */
    button.add-btn {
      background-color: #43a047;
      color: white;
    }

    button.add-btn:hover {
      background-color: #2e7d32;
    }

  `]
  
})
export class AddTaskDialog {
  taskName: string = '';

  constructor() {}

  onNoClick(): void {
    this.taskName = '';
  }
}
