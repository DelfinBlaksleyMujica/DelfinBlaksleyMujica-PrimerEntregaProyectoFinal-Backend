const express = require("express");

const { Router } = express;
const productosRouter = new Router();
//Importo la clase Container y la inicio 
const ContenedorProductos = require("../contenedores/ContainerProducts");
const ProductService = new ContenedorProductos("../db/dbProductos.json");
const dbProducts = require("../../db/dbProductos.json");
const app = require("../server");
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
    try {
        console.log("Se muestran todos los productos correctamente");
        res.status(200).send({ productos: products });
    } catch (error) {
        console.log("Error en el get de productos");
        res.status(500).send({ message: error.message });
    }  
})

productosRouter.get("/administrador/productos" , async ( req , res ) => {
    res.sendFile("C:/Users/delfb/OneDrive/Escritorio/Programacion Backend/Entregas/DelfinBlaksleyMujica-PrimerPreEntregaDeProyectoFinal/public/index.html");
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
    console.log("Error en el get de producto por id");
    res.status(500).send({ message : error.message })
}
})

productosRouter.post("/" , soloAdmins, ( req , res ) => {
    try {
        if (req.body.title && req.body.descripcion && req.body.codigoDeProducto && req.body.price && req.body.thumbnail && req.body.stock ) {
            const obj = req.body;
            ProductService.save(obj);
            console.log("Se agrego un nuevo producto");
            res.status(200).send({ nuevoProducto: obj })
        }
        console.log("No se completo toda la informacion del producto");
        res.status(200).send({ message:"Debe completar toda la informacion del producto para poder cargarlo" })
    }catch ( error ) {
            res.status(500).send({ message : error.message })
        }
    }    
)

productosRouter.put("/:id" , soloAdmins , async ( req , res ) => {
    try {
        if (req.params) {
            const { id } = req.params;
            const producto = products.find( obj => obj.id == id );
            if (!producto) {
                console.log("No se encuentra producto con tal id en la base para poder actualizar");
                return res.status(404).send({ message: "No existe producto con tal id en la base, no se peude actualizar"})
            }
            if (req.body.title && req.body.descripcion && req.body.codigoDeProducto && req.body.price && req.body.thumbnail && req.body.stock ) {
                ProductService.deleteById(id)
                const { title , descripcion , codigoDeProducto , price , thumbnail , stock } = req.body;
                ProductService.updateProduct( id , title , descripcion , codigoDeProducto , price , thumbnail , stock );
                console.log("Se actualizo un producto");
                return res.status(200).send({ message: "Producto actualizado" })
            }
            console.log("No se completo toda la informacion del producto");
            res.status(200).send({ message:"Debe completar toda la informacion del producto para poder cargarlo" })
        }
    } catch (error) {
        res.status(500).send({ message : error.message })
    }
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