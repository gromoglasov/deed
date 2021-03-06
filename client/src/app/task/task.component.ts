import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../task-class';
import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Subscription } from "apollo-client/util/Observable";


function changeTaskStatus(id) {
  return gql`
    mutation {
      updateTask(
        _id: "${id}"
        input: {
          status: "completed"
          userCompleted: "isadora"
          prove: {
            image: "none"
            text: "none"
          }
        }
      ) {
        _id
      }
    }
  `
} ;

function addKarma(id, points) {

  return gql`
    mutation {
      updateTaskPoints(
        _id: "${id}"
        input: {
          points: ${points}
        }
      ) {
        _id
      }
    }
  `

}


@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"]
})
export class TaskComponent implements OnInit {
  @Input() task: Task;
  _id: string;
  group: string;
  points: number;
  content: string;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private apollo: Apollo
  ) {
    this.task = this.route.snapshot.params.task;
  }


  addPoints (id, points) {
    this.points = this.points + 1;
    this.apollo.mutate<any>({ mutation: addKarma(this._id, this.points) }).subscribe();
  }

  status:boolean = false;



  completeTask(){
    this.status = !this.status;
    this.apollo.mutate<any>({ mutation: changeTaskStatus(this.task._id) }).subscribe();
    window.location.reload();

    console.log("clicked")
  }


  ngOnInit() {
    this.points =  Object.assign(this.task.points);
    this._id = Object.assign(this.task._id);
    this.group = Object.assign(this.task.group);
  }

}
