const express = require("express");

const { Router } = express;
const cartRouter = new Router();
//Importo la clase Container y la inicio 
const ContenedorProductos = require("../contenedores/ContainerProducts");
const dbProductos = new ContenedorProductos("./db/dbCarritos.json");
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

cartRouter.get( "/" , async ( req , res ) => {
    res.send({message: "Hola"})
})

module.exports = cartRouter;