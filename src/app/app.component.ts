import { Component } from '@angular/core';
import { WorkflowsService } from "../app/workflows/workflows.service";
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Workflow {
  id: number;
  name: string;
  isActive: boolean;
  isRunning: boolean;
  multiExecBehavior: string;
}
export interface WorkflowExecution {
  id: number;
  startDateTime: Date;
  executionStatus: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'ice-sync-fe';
  workflows: Workflow[] = [];

  displayedColumns: string[] = [ 'workflow-id', 'name', 'is-active', 'is-running', 'multi-exec-behavior', 'run-manually' ];

  constructor(
    private wrkflowsService: WorkflowsService,
    public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.wrkflowsService.getAll().subscribe((data: Workflow[]) => {
      this.workflows = data;
    });  
  }

  runManually(workflowId: number){
    let currDate = new Date().toISOString();
    this.wrkflowsService.runWorkflow(workflowId).subscribe(data => {
      this.getLastExecutionStatus(workflowId, currDate);
    });
  }

  getLastExecutionStatus(workflowId: number, currDate: string){
    this.wrkflowsService.getWorkflowExecutions(workflowId, currDate).subscribe((data: WorkflowExecution[]) => {
      let msg = "";
      if(data && data.length > 0){
        data.sort((a: WorkflowExecution, b: WorkflowExecution) => (a.startDateTime > b.startDateTime) ? -1 : 1);
        let mostRecent = data[0];
        msg = `Last workflow execution state: ${mostRecent.executionStatus}.`;
      }
      else{
        msg = `No record for workflow execution found!`;
      }
      
      this.snackBar.open(msg, "OK", {
        duration: 50000,
        panelClass: ['blue-snackbar', 'mat-toolbar', 'mat-primary'],
        horizontalPosition: 'center'
      });
    });
  }
}
