import React, { Component } from 'react';

import Todo from './Todo';

export default class Todos extends Component {
  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
  }

  addTodo(e) {
    e.preventDefault();
    e.persist(); // Required to keep the "e" variable around to reset the input form

    const todo = e.target.todo.value;
    if (todo && todo.length > 0) {
      const url = `/todo/create?description=${todo}&list=${this.props.list.id}`;
      this.props.io.socket.get(url, (todoResult, JWR) => {
        if (todoResult && JWR.statusCode < 400) {
          todoResult.list = this.props.list.id;
          this.props.createTodo(todoResult);
          e.target.todo.value = '';
        }
      });
    }
  }

  render() {
    const todos = this.props.todos.map((todo) => {
      // The list item is different when initially received, vs when a new item is received via socket
      if (todo.list !== this.props.list.id) {
        return;
      }
      return (
        <Todo
          io={this.props.io}
          destroyTodo={this.props.destroyTodo}
          key={todo.id}
          todo={todo}
        />
      );
    });

    return (
      <div>
        <form onSubmit={this.addTodo}>
          <input type="text" name="todo" />
          <input type="submit" value="Add Todo Item" />
        </form>
        {todos}
      </div>
    );
  }
}
