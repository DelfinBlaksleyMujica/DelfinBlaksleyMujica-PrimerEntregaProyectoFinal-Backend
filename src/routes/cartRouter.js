const express = require("express");

const { Router } = express;
const cartRouter = new Router();
//Importo la clase Container y la inicio 
const ContenedorCart = require("../contenedores/ContainerCart");
const CartService = new ContenedorCart("../db/dbCarritos.json");
const dbCarritos = require("../../db/dbCarritos.json");
const carts = dbCarritos;
const dbProducts = require("../../db/dbProductos.json");
const products = dbProducts;

//Funcion Error
function crearErrorNoEsAdmin( ruta , metodo ) {
    const error = { 
        error: -1,
    }
    if ( ruta && metodo ) {
        error.descripcion = `ruta "${ruta}" metodo "${metodo} no autorizado`
    } else {
        error.descripcion = "No autorizado"
    }
    return error;
}


//Middleware para Administrador
const esAdmin = true;

function soloAdmins( req , res , next ) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin( req.url , req.method ))
    }else { 
        next();
    }
}


//Endpoints

cartRouter.post( "/" , async ( req , res ) => {
    CartService.createCart();
    res.send({message: "Carrito Creado"})
})

cartRouter.delete( "/:id" , async ( req , res ) => {
            const { id } = req.params;
            const carrito = carts.find( carrito => carrito.id == id );
            if (!carrito) {
                res.send({ message: "No existe tal carrito por lo tanto no puede eliminarse"})
            }
            CartService.deleteCartById(id);
            res.send({ carritoBorrado: carrito })
        }
)

cartRouter.get("/:id/productos" , async ( req , res ) => {
    try {
        const { id } = req.params;
        const carrito = carts.find( carrito => carrito.id == id );
        const productos = carrito.productos;
        res.send({ productos: productos });
    } catch (e) {
        res.status(500).send({ message : error.message })
    }
    
})



cartRouter.post( "/:id/productos" , async( req , res ) => {
    try {
        const { id } = req.params;
        const producto = products.find( producto => producto.id == id);
        const numero = carts.length;
        CartService.addProductToCart( numero , producto )
        res.send({ message: producto })
    } catch (error) {
        res.status(500).send({ message : error.message })
    }
    
})

cartRouter.delete( "/:id/productos/:id_prod" , async ( req , res ) => {
    const { id , id_prod } = req.params;
    CartService.deleteProductById( id , id_prod );
    res.send({message: "Producto Borrado"})
})


module.exports = cartRouter;