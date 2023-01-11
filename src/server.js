const express = require("express");

const ContenedorProductos = require("./contenedores/ContainerProducts.js");
const ContenedorCarritos = require("./contenedores/ContainerCart.js");

const productosRouter = require("./routes/productsRouter");
const cartRouter = require("./routes/cartRouter");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/productos" , productosRouter);
app.use("/api/carritos" , cartRouter);

app.get("*" , function ( req , res ) {
    res.send({ status:"error" , description: `ruta ${ req.url } metodo ${req.method } no implmentada`})
})

module.exports = app;