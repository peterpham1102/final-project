const express = require('express');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const categoriesRoutes = require('./routes/categories-routes');
const storesRoutes = require('./routes/stores-routes');
const foodsRoutes = require('./routes/foods-routes');
const ordersRoutes = require('./routes/orders-routes');
const shippingsRoutes = require('./routes/shippings-routes');

const app = express();




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use(express.json())

app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/orders', ordersRoutes);
// app.use('/api/shippings', shippingsRoutes);




mongoose
  .connect(
    `mongodb+srv://admin1:djtmelol1@cluster0.zevwo.mongodb.net/FinalProject?retryWrites=true&w=majority`
    )
  .then(() => {
    app.listen(6789);
  })
  .catch(err => {
    console.log(err);
  });