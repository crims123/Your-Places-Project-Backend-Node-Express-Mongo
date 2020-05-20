const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DB_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('Successfully connected to the Database');
});
