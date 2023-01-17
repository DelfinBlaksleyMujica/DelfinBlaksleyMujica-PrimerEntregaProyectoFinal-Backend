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
    try {
        CartService.createCart();
        res.status(200).send({message: "Carrito Creado"})
    } catch (error) {
        console.log("Error en el get del producto");
        res.status(500).send({ message : error.message })
    }
    
})

cartRouter.delete( "/:id" , async ( req , res ) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const carrito = carts.find( carrito => carrito.id == id );
            if (!carrito) {
                return res.status(404).send({ message: "No se encontro tal carrito por lo tanto no puede eliminarse"})
            }
            CartService.deleteCartById(id);
            res.status(200).send({ carritoBorrado: carrito })
        }
        } catch (error) {
            console.log("Error en el delete del producto");
            res.status(500).send({ message : error.message })
    }
            
        }
)

cartRouter.get("/:id/productos" , async ( req , res ) => {
    try {
        const { id } = req.params;
        const carrito = carts.find( carrito => carrito.id == id );
        if (!carrito) {
            console.log("No existe tal carrito");
            return res.send(404).send({ message: "No se encontro tal carrito"})
        }else{
            const productos = carrito.productos;
            if (productos.length == 0) {
            console.log("No hay productos en el carrito");
            return res.status(200).send({ message: "El carrito se encuentra vacio"});
            }
            res.status(200).send({ productos: productos });
        }
    } catch (error) {
        res.status(500).send({ message : error.message })
    }
    
})



cartRouter.post( "/:id/productos" , async( req , res ) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const producto = products.find( producto => producto.id == id);
            const numero = carts.length;
            if (!producto) {
                console.log("No existe un producto con tal id en la base");
                return res.status(404).send({ message: "No se encuentra el producto que se quiere agregar en la base"})
            }else if (numero > 0 ) {
                CartService.addProductToCart( numero , producto )
                res.status(200).send({ message: producto })
            }else {
                console.log("No hay se creo un carrito para agregar los productos");
                res.status(404).send({ message: "No se encontro carrito para agregar el producto" })
            }
        }
    } catch (error) {
            res.status(500).send({ message : error.message })
    }
    
})

cartRouter.delete( "/:id/productos/:id_prod" , async ( req , res ) => {
    try {
        if (req.params) {
            const { id , id_prod } = req.params;
            const carrito = carts.find( carrito => carrito.id == id );
            if (!carrito) {
                console.log("No existe el carrito que se quiere borrar");
                return res.status(404).send({ message: "No se encontro carrito con tal id"})
            }
            const productoEnCarrito = carrito.productos.find( producto => producto.id == id_prod)
            if (!productoEnCarrito) {
                console.log("No existe el producto en el carrito");
                return res.status(404).send({message:"No se encontro producto con tal id"})
            }
            CartService.deleteProductById( id , id_prod );
            res.status(200).send({message: "Producto Borrado"})
        }
    } catch (error) {
        res.status(500).send({ message : error.message })
    }
})


module.exports = cartRouter;