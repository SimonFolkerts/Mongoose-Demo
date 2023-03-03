Simple demo of using mongoose with express to communicate with a database

run `npm install` to get node_modules folder so that the project can run

don't forget to add a .env file that contains the `PORT` and your `DB_STRING` from MongoDB
e.g.
PORT=3000
DB_STRING=asdfasdfasdf

then run `npx nodemon index.js` to start the server.

## Fetching data

This project currently contains an example of how to connect an express API to a database using Mongoose, rather than just using a JSON file. It also has two examples of how to use Mongoose to allow the express routes to retreive the data needed to fulfill a GET request for all users, and a GET request for a specific user by ID.

### GET all

If you send a GET request to the API using just the users endpoint `localhost:3000/users/` it will find a list of all users and return it to the client.

### GET one by ID

If you send a GET request to the API using the users endpoint with another segment after it `localhost:3000/users/640124943e73f087b6e5e386` the API will attempt to use whatever is in that second segment as a MongoDB ID and will attempt to find a matching user and return that user to the client.

This will be added to over the coming days.
