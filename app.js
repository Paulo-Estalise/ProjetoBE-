const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('./config/database');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/products', (req, res) => res.render('products'));
app.get('/products/:pid', (req, res) => res.render('productDetails'));
app.get('/carts/:cid', (req, res) => res.render('cart'));

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

