import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.watchQuery({
      query: gql`
        {
          getTodos {
            id
            name
            description
            completed
          }
        }
      `
    })
    .valueChanges
    .subscribe((result) => {
      console.log(result);
    });
  }
}
