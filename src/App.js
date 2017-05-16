import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import addCrud from 'sails-react-crud-hooks';
import autoBind from 'react-autobind';

import Lists from './components/Lists';

class App extends Component {
  constructor() {
    super();

    const io = sailsIOClient(socketIOClient);
    io.sails.url = 'http://localhost:1337/';

    this.state = {
      io,
    };

    addCrud('list', this);
    addCrud('todo', this);
    autoBind(this);
  }

  render() {
    return (
      <div className="App">
        <Lists
          io={this.state.io}

          lists={this.state.lists}
          createList={this.createList}
          updateList={this.updateList}
          destroyList={this.destroyList}

          todos={this.state.todos}
          createTodo={this.createTodo}
          updateTodo={this.updateTodo}
          destroyTodo={this.destroyTodo}
        />
      </div>
    );
  }
}

export default App;
