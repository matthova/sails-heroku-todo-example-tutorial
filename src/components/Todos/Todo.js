import React, { Component } from 'react';

export default class Todo extends Component {
  constructor() {
    super();

    this.delete = this.delete.bind(this);
  }

  delete() {
    const url = `/todo/destroy/${this.props.todo.id}`;
    this.props.io.socket.get(url, (todo, JWR) => {
      if (todo && JWR.statusCode < 400) {
        this.props.destroyTodo(todo);
      }
    });
  }

  render() {
    return (
      <div style={{ backgroundColor: '#d4d4d4' }}>
        <p>{this.props.todo.description}</p><button onClick={this.delete}>X</button>
      </div>
    );
  }
}
