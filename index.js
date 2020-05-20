require('./database');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/places', require('./routes/places'));

app.listen(port, '0.0.0.0', () => {
  console.log('Server running at port: ' + port);
});

