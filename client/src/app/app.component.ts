import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Todo, GetTodos, AddTodo } from './schema';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showAddForm = false;
  displayedColumns: string[] = [ 'id', 'name', 'description', 'completed' ];
  dataSource = new MatTableDataSource<Todo>();
  addTodoForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    completed: [false]
  });

  constructor(private apollo: Apollo, private fb: FormBuilder) {}

  ngOnInit() {
    this.apollo.watchQuery({ query: GetTodos }).valueChanges
    .subscribe((result: any) => {
      this.dataSource.data = result.data.getTodos;
    });
  }

  onSave(): void {
    this.apollo.mutate({
      mutation: AddTodo,
      variables: {
        name: this.addTodoForm.get('name').value,
        description: this.addTodoForm.get('description').value || '',
        completed: this.addTodoForm.get('completed').value
      }
    }).subscribe(({ data }) => {
      this.dataSource.data = [...this.dataSource.data, data.addTodo];

    }, (error) => {
      console.log('Got error: ', error);
    });
  }
}
