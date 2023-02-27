// const path = require('path');
const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./Routes/user.js');
const authRoute = require('./Routes/auth.js');
const productRoute = require('./Routes/product.js');
const cartRoute = require('./Routes/cart.js');
const orderRoute = require('./Routes/Order.js');
const stripeRoute = require('./Routes/stripe.js');
const morgan = require('morgan');

dotenv.config();

const app = express();

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('DB connected Successfully');
  })
  .catch((err) => {
    console.log(err);
  });

// app.use(morgan('start'));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', stripeRoute);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/ecommerceui/build')));
// app.get('*', (req, res) =>
// res.sendFile(path.join(__dirname, '/ecommerceui/build/index.html'))
// );

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on PORT 5000');
});
