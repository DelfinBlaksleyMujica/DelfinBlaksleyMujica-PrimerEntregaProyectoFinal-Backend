const fs = require("fs").promises;

class ContenedorCart {
    constructor( path ){
        this.path = path
    }

    async createCart(){
        try {
            const leer = await fs.readFile( this.path , "utf-8" );
            const data = JSON.parse( leer );
            let id;
            data.length === 0
            ?
            (id = 1)
            :
            (id = data.length + 1);
            const newCart = {  id , timestamp: Date() , productos: [] };
            data.push(newCart);
            await fs.writeFile( this.path , JSON.stringify( data , null , 2 ) , "utf-8");
            console.log("Se agrego el nuevo Carrito correctamente");
            return newCart.id;
        }catch (e){
            console.log(e);
        }
    }


    async deleteCartById(id){
        try{
            const leer = await fs.readFile( this.path , "utf-8");
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id);
            if( !obj ){
                console.log("No existe un carrito con dicho id");
            } else{
                const nuevoArray = data.filter( obj => obj.id != id );
                await fs.writeFile( this.path , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                return  console.log("Se elimino el carrito con id: " + id);
            }
            
        } catch(e){
            console.log(e);
        }
    }

    async deleteProductById( id , id_prod ) {
        try {
            const leer = await fs.readFile( this.path , "utf-8");
            const data = JSON.parse(leer)
            let carrito = data.find( carrito => carrito.id == id )
            let productosModificados = carrito.productos.filter( producto => producto.id != id_prod )
            carrito = {
                id: id,
                timestamp: Date(),
                productos: productosModificados
            }
            const nuevoArray = data.filter( carrito => carrito.id != id );
            await fs.writeFile( this.path , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
            nuevoArray.push(carrito)
            await fs.writeFile( this.path , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
            console.log("Se borro el producto con id: " + id_prod + " del carrito con id: " + id );
            return id;
        } catch (e) {
            console.log(e);
        }
    }

    async addProductToCart( id , obj ) {
        try {
            const leer = await fs.readFile( this.path , "utf-8");
            const data = JSON.parse( leer );
            const carrito = data.find(carrito => carrito.id == id );
            carrito.productos.push(obj);
            await fs.writeFile( this.path , JSON.stringify( data , null , 2 ) , "utf-8");
            console.log("Se agrego el producto " + JSON.stringify(obj.title) + " al cart con id " + id +  " correctamente.");
            return obj.id
        } catch (e) {
            console.log(e);
        }
    }

    async getById(id){
        try{
            const leer = await fs.readFile(this.path , "utf-8");
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id)
            if (!obj) {
                return null
            }
            return obj
        }
        catch(e){
            console.log(e)
        }
        
    }
    
    async getAll(){
        const leer = await fs.readFile( this.path , "utf-8" );
        return JSON.parse( leer )
    }

    async deleteAll(){
        try{
            await fs.writeFile( this.path , JSON.stringify([], null , 2) , "utf-8" )
            console.log("Se borraron todos los productos del archivo");
        }catch ( e ){
            console.log( e );
        }
    }
}


module.exports = ContenedorCart;