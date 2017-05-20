import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import addCrud from 'sails-react-crud-hooks';
import autoBind from 'react-autobind';
import RouteList from './components/Lists/RouteList';

import './styles/App.css';

const Home = () => (<h1>Home</h1>);

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
    return (
      <Router>
        <div className="App">
          <Link to="/">Home</Link>
          <Link to="/lists">Menu</Link>
          <Route exact path="/" component={Home} />
          <Route
            path="/lists/:section?"
            render={(props) => (
              <RouteList
                io={this.state.io}

                lists={this.state.lists}
                createList={this.createList}
                updateList={this.updateList}
                destroyList={this.destroyList}

                todos={this.state.todos}
                createTodo={this.createTodo}
                updateTodo={this.updateTodo}
                destroyTodo={this.destroyTodo}
                {...props}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
