import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Workflow, WorkflowExecution } from '../app.component';

const baseUrl: string = "https://localhost:7299/";

@Injectable({
  providedIn: 'root'
})
export class WorkflowsService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<Workflow[]>{
    return this.httpClient.get<Workflow[]>(baseUrl + "Workflows/get-all");
  }
  
  public runWorkflow(workflowId: number): Observable<any>{
    let currIdepotencyKey = crypto.randomUUID();
    const headers = new HttpHeaders({'IdempotencyKey': currIdepotencyKey});

    return this.httpClient.post<any>(baseUrl + `Workflows/${workflowId}/run`, null, {
      headers: headers
    });
  }
  
  public getWorkflowExecutions(workflowId: number, startDate: string): Observable<WorkflowExecution[]>{
    var url = baseUrl + `Workflows/executions?workflowId=${workflowId}&startDate=${startDate}&endDate=`;
    return this.httpClient.get<WorkflowExecution[]>(url);
  }
}