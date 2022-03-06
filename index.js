const fs = require('fs');

class Contenedor{ 
    constructor(ruta){ // En el constructor ponemos la ruta, todo lo demas lo creamos despues
      this.ruta = ruta;
    }
    /*Async/await para los métodos porque van a tardar en leer (no son sincronicos), tengo que esperar a que se creen*/

    async save(objeto){ // salvo el objeto pusheandolo en productos y sobreescribiendo productos.txt

      const obj = await this.getAll();

      //Creamos lógica para aumentar id de productos

      let nvoId // creamos variable auxiliar para guardar los id de productos

      if (obj.length === 0){ // Array vacío inicializa en 1
        nvoId = 1
      } else {
        nvoId = obj[obj.length - 1].id + 1; // buscamos el último id y le sumanos 1
      }

      //Creamos objeto con lo que viene por parámetro

      const nvoObj = {...objeto, id: nvoId }

      obj.push(nvoObj); //Guardamos objeto en el array

      //Escribimos el archivo pasando la ruta y detectamos error si lo hubise

      try{
        await fs.promises.writeFile(this.ruta, JSON.stringify(obj, null, 2))
        return nvoId
      } catch (error) {
        console.log('Se detectó un error', error)
      }

    }

    async getById(nro){ // en el array busco el id

      try{
        const productos = await this.getAll()
        const buscado = productos.find((prod)=>prod.id == nro)
        if (buscado === undefined){
          return (`Producto con id: ${nro} no encontrado`)
        } else {
          return buscado
        }
      } catch (error){
        console.log('Se detectó un error', error)
      }
              
    }

    async getAll(){
      /*se agrega .promises al tratarse de un método asincrono, se utiliza readFile para leer el archivo donde está el array*/

      try {
        const objs = await fs.promises.readFile(this.ruta, 'utf-8')
        return JSON.parse(objs)
      } catch (error){
        return [] //Devuelve un array vacío
      }    

    }

    async deleteById(nro){
      try{
        const productos = await this.getAll()
        const buscado = productos.find((prod)=>prod.id == nro)
        
        if (buscado === undefined){
          return (`Producto con id: ${nro} no encontrado`) // detecto que exista
        } else {
          const posicion = productos.indexOf(buscado); // detecto la posición del array
          productos.splice(posicion) // borro dicha posición
          
          //Escribo en el archivo

          try{
            await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2))
            return buscado
          } catch (error) {
            console.log('Se detectó un error', error)
          }
        }

        } catch (error){
        console.log('Se detectó un error', error)
      }     
      
    }

    async deleteAll(){
        fs.unlink('productos.txt', error =>{
            if (error){
              console.log('Hubo un error', error)
            } else {
                console.log('borrado con éxito')
            }
          })
    }
}

let contenedor1 = new Contenedor('productos.txt');
/*En la instancia se especifia la ruta nada más, el archivo se crea con save()*/


//Las pruebas son una función asincrona

async function pruebas(prod,id1,id2,id3){
  console.log('Se guardó producto con id:', await contenedor1.save(prod))
  console.log(await contenedor1.getAll()) //no olvidarse del await antes de cada llamada al metodo
  console.log('Resultado de la búsqueda:', await contenedor1.getById(id1))
  console.log(await contenedor1.getById(id2))
  //console.log('Se borró el id:', await contenedor1.deleteById(id3))
}

async function borrar(x){
  if (x) {
    console.log('Se borro productos.txt', await contenedor1.deleteAll())
  } else {
    console.log('No se borró nada')
  }
}


const prod1 = {
  titulo: 'Regla',                                                                                                                                 
  precio: 25.3,                                                                                                                                     
  web: 'url2'
}

pruebas(prod1,2,5,3);

const x = false

borrar(x)  // Si se desea borrar desde el principio se cambia a verdadero la x



const express = require('express') //Configurar servidor

const app = express()

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puesto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))

app.get('/', (req, res) => {
    res.send('<h1>Buen dias, buenas tardes o buenas noches</h1>')
 })

app.get('/productos', (req,res)=>{
  
  let arrayProd =[]
  for (let i=0; i<contenedor1.length; i++){
    arrayProd = arrayProd.push(contenedor1.titulo) // guardo los array filtrados por título
  }
  res.send(arrayProd)
})

app.get('/productosRandom', (req,res)=>{
  
  let arrayProd =[]
  for (let i=0; i<contenedor1.length; i++){
    arrayProd = arrayProd.push(contenedor1.titulo) // mismo que anterior
  }
  function random(min, max) { //la función genera un número random entre un min y un max
    return Math.floor((Math.random() * (max - min + 1)) + min);
}
  const j = random(0,arrayProd.length) // Se llama a la función random con un mínimo de cero y un max del arreglo

  res.send(arrayProd[j]) // Sólo se muestra el random
})
