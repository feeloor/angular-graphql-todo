import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AddTodo, GetTodos } from '@app/schema';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.scss']
})
export class TodoAddComponent implements OnInit, OnDestroy {
  showAddForm = false;
  addTodoForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    completed: [false]
  });
  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo, private fb: FormBuilder) { }

  ngOnInit() {
  }

  onSave(): void {
    const saveSub = this.apollo.mutate({
      mutation: AddTodo,
      variables: {
        name: this.addTodoForm.get('name').value,
        description: this.addTodoForm.get('description').value || '',
        completed: this.addTodoForm.get('completed').value
      },
      update: (store: any, { data: { addTodo }}) => {
        const storeData = store.readQuery({ query: GetTodos });
        storeData.getTodos.push(addTodo);

        store.writeQuery({ query: GetTodos, data: storeData });
      }
    }).subscribe();
    this.subscriptions = [ ...this.subscriptions, saveSub ];
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
