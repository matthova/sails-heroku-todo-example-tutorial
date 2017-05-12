<ol>
  <li>
    <p>Install NodeJS (NVM recommended)</p>
    <p>Copy and paste the script below to install NVM (Node Version Manager).</p>
    <p>I need better documentation for installing on Windows. Pull requests are welcome :)</p>

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
```

  </li>
  <li>
    <p>Now we're going to run a few steps to get NVM up and running.<p>
    <p>Copy and paste the code below into your terminal. It will set nvm to be available whenever you open a terminal</p>

```
sudo echo ". ~/.nvm/nvm.sh" >> ~/.bashrc
```

  </li>
  <li>
    <p>Run nvm for this terminal window instance</p>
    
```
. ~/.nvm/nvm.sh
```

  </li>
  <li>
    <p>Download Node</p>

```
nvm install v7
```

  </li>
  </li>
  <li>
    <p>Install Postgres</p>
    <p>Download the postgres app for <a href="http://postgresapp.com/">Mac</a>, <a href="https://www.postgresql.org/download/windows/">Windows</a>, or your <a href="https://www.postgresql.org/download/">OS of choice</a>.</p>
  </li>
  <li>
    <p>Once Postgres is installed and running, sign into your postgres instance. You can log in from terminal by entering the following:</p>

```
psql
```
  </li>
  <li>
    <p>Create your database</p>
    <p>Now you should be signed in to the postgres terminal. From the terminal enter the following:</p>

```
create database sails_todo;
```

  </li>
  <li>
    <p>Exit Postgres</p>
    
```
\q
```    
  </li>
  <li>
    <p>Install Sails globally</p>
    
```
npm install -g sails
``` 
 
  </li>
  <li>
    <p>Move to the directory where you would like to make your app.</p>
    
```
cd someplace_nice
```

  </li>
  <li>
    <p>Create Sails App</p>

```
sails new sails-todo-app
```

  </li>
  <li>
    <p>Move into your sails app's directory</p>
    
```
cd sails-todo-app
```

  </li>
  <li>
    <p>Initialize the project as a git repo</p>
    
```
git init
git add .
git commit -m "initial commit"
```

  </li>
  <li>
    <p>gitignore .env file</p>
    <p>We're going to be adding a .env file to store environment variables. Since some of this information may be sensitive, we're going to make sure it doesn't get added to our git repo.</p>
    
  ```
  # .gitignore
  .env
  ```
  
  </li>
  <li>
    <p>Create .env file</p>
    <p>We're going to create a .env file and add the url of our postgres database to it</p>

```
DATABASE_URL=localhost:5432
```

  </li>
  <li>
    <p>Set up config/connections.js</p>
    <p>Add the following to config/connections.js</p>

```javascript
function generatePostgresqlObject() {
  const local = String(process.env.DATABASE_URL).indexOf('localhost') !== -1

  const adapter = 'sails-postgresql';
  const url = local ? undefined : process.env.DATABASE_URL;
  const address = local ? process.env.DATABASE_URL : undefined;
  const ssl = !local;
  const database = local ? 'sails_todo' : undefined;

  const pgObject = { adapter, url, address, ssl, database };
  return pgObject;
}

module.exports.connections = {
  somePostgresqlServer: generatePostgresqlObject(),
};
```

  </li>
  <li>
    <p>Set up config/models.js</p>
    <p>Modify config/models.js to use postgres and to migrate safe</p>
    
  ```javascript
module.exports.models = {
    // someOtherKey: someOtherValue,
    connection: 'somePostgresqlServer',
    migrate: 'safe',
};
  ```
  
  </li>
  <li>
    <p>Make sure the .env file is loaded when we run sails</p>
    <p>In order for sails to load the .env file, add the following to the first line of app.js an Gruntfile.js</p>
    
```javascript
try {
  require('dotenv').config();
} catch (ex) {
  // Add error handling here, if you want
}
```

  </li>
  <li>
    <p>Generate 'todo' api</p>
    <p>Now we are going to add a 'todo' api to our sails app. We will do so, using the Sails cli functionality. From terminal, while inside the root of the project folder, enter the following</p>

```
sails generate api todo
```

  </li>
  <li>
    <p>Set up 'todo' model</p>
    <p>We're now going to define our 'todo' model's attributes from within api/models/Todo.js</p>
    <p>For this example, our todo item has only one attribute, description, which we will define as a string</p>
    
```javascript
/**
 * Todo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    description: {
      type: 'string',
    }
  }
};
```
  
  </li>
  <li>
    <p>Install postgres and migration dependencies.</p>
    
```
npm install --save sails-postgresql db-migrate db-migrate-pg sails-db-migrate dotenv async
```

  </li>
  <li>
    <p>Set up tasks/register/dbMigrate.js</p>
    <p>We're going to add a grunt task for handling database migrations.</p>
    <p>Paste the following into a new file at tasks/register/dbMigrate.js</p>

```javascript
module.exports = require('sails-db-migrate').gruntTasks;
```

  </li>
  <li>
    <p>Add config/migrations.js</p>
    <p>We need to let our sails app know what database we want to use when we run our migrations.</p>
    <p>We will specify this inside of config/migrations.js</p>

```javascript
module.exports.migrations = {
  // connection name matches a field from config/connections.js
  connection: 'somePostgresqlServer',
};
```

  </li>
  <li>
    <p>Create a migration</p>
    <p>We're now going to create a migration from our grunt task</p>

```
node node_modules/.bin/grunt db:migrate:create --name=create-todo
```

  </li>
  <li>
    <p>Modify migration</p>
    <p>The grunt script should have created a file with the name of the migration, as well as a timestamp.<p>
    <p>For example: '20170512001519-create-todo.js'</p>
    <p>We're now going to modify that file to create a 'todo' table in our database with a column of 'description'</p>

```javascript
const async = require('async');
const dbm = global.dbm || require('db-migrate');
const type = dbm.dataType;

exports.up = (db, callback) => {
  async.series([
    (cb) => {
      db.createTable('todo', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        description: 'string',
        createdAt: 'datetime',
        updatedAt: 'timestamp'
      }, cb);
    },
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    (cb) => {
      db.dropTable('todo', cb)
    }
  ], callback);
};
```

  </li>
  <li>
    <p>Migrate the database</p>
    <p>Now we're going to run the migration!</p>

```
node node_modules/.bin/grunt db:migrate:up
```

  </li>
  <li>
    <p>Start the server</p>

```
npm start
```

  </li>
  <li>
    <p>Verify that the todo item can be queried by visiting <a href="http://localhost:1337/todo">http://localhost:1337/todo</a></p>
    <p>You should see an empty array: "[ ]"</p>
  </li>
  <li>
    <p>Add a todo item</p>
    <p>Add a todo item by visiting the url <a href="http:/localhost:1337/todo/create?description=success">http://localhost:1337/todo/create?description=success</a></p>
    <p>You should see a todo item created</p>
    <p>If you visit <a href="http://localhost:1337/todo">http://localhost:1337/todo</a> you should see an array with one 'todo' item</p>
  </li>
  <li>
    <p>Create an app.json file in order to deploy this code to Heroku</p>

```json
{
  "name": "Sails Todo Demo",
  "description": "Sails and Heroku, together forever",
  "logo": "http://node-js-sample.herokuapp.com/node.svg",
  "keywords": [
    "node",
    "express",
    "heroku"
  ],
  "image": "heroku/nodejs"
}
```
  </li>
  <li>
    <p>Create a "Procfile" for in order to deploy this code to Heroku</p>

```
web: node app.js
release: node node_modules/.bin/grunt db:migrate:up
```
  </li>
  <li>
    <p>Create a heroku app. (Note, you must have <a href="https://devcenter.heroku.com/articles/heroku-cli">Heroku CLI Tools</a> installed)</p>

```
heroku create
```
  </li>
  <li>
    <p>Add a postgres database to the heroku instance</p>

```
heroku addons:create heroku-postgresql:hobby-dev
```

  </li>
  <li>
    <p>Make sure you've committed all of your changes to git</p>
    
```
git add .
git commit -m "here we go"
```
  </li>
  <li>
    <p>Deply to Heroku</p>

```
git push heroku master
```

  </li>
  <li>
    <p>If everything goes according to plan, your heroku instance should be up and running. Good Job!</p>
    <p>Here's a link to the example Heroku app: <a href="https://sails-todo-example-tutorial.herokuapp.com/">https://sails-todo-example-tutorial.herokuapp.com/</a>
  </li>
</ol>

That's it for now. If you have any questions or see any bugs/typos, please leave me feedback by creating an issue [here](http://zombo.com).
