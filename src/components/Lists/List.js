import React, { Component } from 'react';

import Todos from '../Todos';

export default class List extends Component {
  constructor() {
    super();

    this.delete = this.delete.bind(this);
  }

  addTodo(e) {
    e.preventDefault();
    e.persist(); // Required to keep the "e" variable around to reset the input form

    const todo = e.target.todo.value;
    if (todo && todo.length > 0) {
      const url = `/todo/create?description=${todo}`;
      this.props.io.socket.get(url, (todoResult, JWR) => {
        if (todoResult && JWR.statusCode < 400) {
          this.props.createTodo(todoResult);
          e.target.todo.value = '';
        }
      });
    }
  }

  delete() {
    const url = `/list/destroy/${this.props.list.id}`;
    this.props.io.socket.get(url, (list, JWR) => {
      if (list && JWR.statusCode < 400) {
        this.props.destroyList(list);
      }
    });
  }

  render() {
    return (
      <div style={{backgroundColor: '#f5f5f5' }}>
        <p>{this.props.list.name}</p><button onClick={this.delete}>X</button>
        <Todos
          io={this.props.io}
          list={this.props.list}
          todos={this.props.todos}
          createTodo={this.props.createTodo}
          updateTodo={this.props.updateTodo}
          destroyTodo={this.props.destroyTodo}
        />
      </div>
    );
  }
}
