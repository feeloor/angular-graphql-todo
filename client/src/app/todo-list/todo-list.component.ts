import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatTableDataSource } from '@angular/material';
import { Todo, GetTodos, RemoveTodo } from '@app/schema';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [ 'id', 'name', 'description', 'completed', 'remove' ];
  dataSource = new MatTableDataSource<Todo>();
  subscriptions: Subscription[] = [];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    const querySub = this.apollo.watchQuery({ query: GetTodos }).valueChanges
    .subscribe((result: any) => {
      this.dataSource.data = result.data.getTodos;
    });
    this.subscriptions = [ ...this.subscriptions, querySub ];
  }

  onRemove(id: string): void {
    const removeSub = this.apollo.mutate({
      mutation: RemoveTodo,
      variables: { id },
      update: (store: any, { data }) => {
        if (data && data.removeTodo) {
          const storeData = store.readQuery({ query: GetTodos });
          const index = storeData.getTodos.findIndex(s => s.id === id);

          if (index > -1) {
            storeData.getTodos.splice(index, 1);
            store.writeQuery({ query: GetTodos, data: storeData });
          }
        }
      }
    }).subscribe();
    this.subscriptions = [ ...this.subscriptions, removeSub ];
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    }
  }
}
