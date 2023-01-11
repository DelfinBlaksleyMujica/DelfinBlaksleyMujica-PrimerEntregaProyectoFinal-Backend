const fs = require("fs").promises;

class ContenedorProductos {
    constructor( path ){
        this.path = path
    }

    async save(objeto){
        try {
            const leer = await fs.readFile( this.path , "utf-8" );
            const data = JSON.parse( leer );
            let id;
            data.length === 0
            ?
            (id = 1)
            :
            (id = data.length + 1);
            const newProduct = {...objeto , id };
            data.push(newProduct);
            await fs.writeFile( this.path , JSON.stringify( data , null , 2 ) , "utf-8");
            console.log("Se agrego el producto " + JSON.stringify(objeto.title) + " correctamente");
            return newProduct.id;
        }catch (e){
            console.log(e);
        }
    }
    
    async updateProduct ( id , titleAct , priceAct , thumbnailAct  ){
        try{
            const leer = await fs.readFile( this.path , "utf-8" );
            const data = JSON.parse( leer );
            let productoAModificar = data.find( obj => obj.id == id);
            if (!productoAModificar) {
                console.log("No existe un producto con dicho id");
                return null;
            }else { 
                const nuevoArray = data.filter( obj => obj.id != id );
                await fs.writeFile( this.path , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                console.log("Se elimino el elemento con id: " + id);
                productoAModificar={
                title : titleAct,
                price: priceAct,
                thumbnail: thumbnailAct,
                id : parseInt(id),
                estado: "Producto modificado"
                }
                nuevoArray.push( productoAModificar );
                await fs.writeFile( this.path , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                console.log("Se agrego el producto " + JSON.stringify(objeto.title) + " correctamente");
                return newProduct.id;
            }
        }catch ( e ) {
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

    async deleteById(id){
        try{
            const leer = await fs.readFile( this.path , "utf-8");
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id);
            if( !obj ){
                console.log("No existe un producto con dicho id");
            } else{
                const nuevoArray = data.filter( obj => obj.id != id );
                await fs.writeFile( this.path , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                return  console.log("Se elimino el elemento con id: " + id);
            }
            
        } catch(e){
            console.log(e);
        }
        


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


module.exports = ContenedorProductos;