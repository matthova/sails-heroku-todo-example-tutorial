import React, { Component } from 'react';

import List from './List';

export default class Lists extends Component {
  constructor() {
    super();
    this.addList = this.addList.bind(this);
  }

  addList(e) {
    e.preventDefault();
    e.persist(); // Required to keep the "e" variable around to reset the input form

    const list = e.target.list.value;
    if (list && list.length > 0) {
      const url = `/list/create?name=${list}`;
      this.props.io.socket.get(url, (listResult, JWR) => {
        if (listResult && JWR.statusCode < 400) {
          this.props.createList(listResult);
          e.target.list.value = '';
        }
      });
    }
  }

  render() {
    const lists = this.props.lists.map((list) => {

      return (
        <List
          io={this.props.io}
          destroyList={this.props.destroyList}
          key={list.id}
          list={list}

          todos={this.props.todos}
          createTodo={this.props.createTodo}
          updateTodo={this.props.updateTodo}
          destroyTodo={this.props.destroyTodo}
        />
      );
    });

    return (
      <div>
        <form onSubmit={this.addList}>
          <input type="text" name="list" />
          <input type="submit" value="Create List" />
        </form>
        {lists}
      </div>
    );
  }
}
