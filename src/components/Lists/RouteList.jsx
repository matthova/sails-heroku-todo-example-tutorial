import List from './List';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

const RouteList = (props) => {
  const ListLinks = props.lists.map((list) => {
    return <Link key={list.id} to={`/lists/${list.id}`}>{list.name}</Link>
  });

  const lists = props.lists;
  const selectedList = props.lists.find((list) => {
    return list.id === props.match.params.section;
  });

  const listComponent = selectedList ?
  <List
    io={props.io}

    lists={props.lists}
    list={selectedList}
    createList={props.createList}
    updateList={props.updateList}
    destroyList={props.destroyList}

    todos={props.todos}
    createTodo={props.createTodo}
    updateTodo={props.updateTodo}
    destroyTodo={props.destroyTodo}
    {...props}
  />
  : null;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.persist(); // Required to keep the "e" variable around to reset the input form

          const list = e.target.list.value;
          if (list && list.length > 0) {
            const url = `/list/create?name=${list}`;
            props.io.socket.get(url, (listResult, JWR) => {
              if (listResult && JWR.statusCode < 400) {
                props.createList(listResult);
                e.target.list.value = '';
              }
            });
          }
        }}
      >
        <input type="text" name="list" />
        <input type="submit" value="Create List" />
      </form>
      {ListLinks}
      {listComponent}
    </div>
  );
};

export default RouteList;
