const express = require("express");

const { Router } = express;
const productosRouter = new Router();
//Importo la clase Container y la inicio 
const ContenedorProductos = require("../contenedores/ContainerProducts");
const ProductService = new ContenedorProductos("../db/dbProductos.json");
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

productosRouter.get( "/" , async ( req , res ) => {
    res.send({ productos: products })
})

productosRouter.get( "/:id" , async ( req , res ) => {
    try{
        if (req.params) {
            const { id } = req.params;
            const producto = products.find( obj => obj.id == id );
            if (!producto) {
                console.log("No se encuentra el producto");
                return res.status(400).send({ error: "Producto no encontrado"});
            }
            return res.status(200).send({ producto : { producto }}) 
        }
}catch ( error ) {
    res.status(500).send({ message : error.message })
}
})

productosRouter.post("/" , soloAdmins, ( req , res ) => {
    try {
        if (req.body.title && req.body.descripcion && req.body.codigoDeProducto && req.body.price && req.body.thumbnail && req.body.stock ) {
            const obj = req.body;
            ProductService.save(obj);
            console.log( products );
            res.status(200).send({ nuevoProducto: obj })
        }
        res.status(200).send({ message:"Debe completar toda la informacion del producto para poder cargarlo" })
    }catch ( error ) {
            res.status(500).send({ message : error.message })
        }
    }    
)

productosRouter.put("/:id" , soloAdmins , async ( req , res ) => {
    const { id } = req.params;
    const { title , descripcion , codigoDeProducto , price , thumbnail , stock } = req.body;
    ProductService.updateProduct( id , title , descripcion , codigoDeProducto , price , thumbnail , stock )
    res.send({ title , descripcion , codigoDeProducto , price , thumbnail , stock  })

})

productosRouter.delete("/:id" , soloAdmins , async ( req , res ) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const producto = products.find( obj => obj.id == id );
            if (!producto) {
                res.status(404).send({ message: "Ese producto no fue encontrado en la base"})
            }
            ProductService.deleteById(id)
            res.status(200).send({ productoBorrado: producto})
        }
    }catch ( error ) {
            console.log("Error en el get del producto");
        res.status(500).send({ message : error.message })
    }
})

module.exports = productosRouter;