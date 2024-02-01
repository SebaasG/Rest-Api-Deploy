const crypto = require('node:crypto'); // Librería para importar funciones de encriptación
const express = require('express'); // Importamos el framework Express
const app = express(); // Declaramos a Express como un método y lo almacenamos en una constante
const ricks = require('./rick.json'); // Guardamos la información de nuestro archivo JSON en una constante
const { validar, actualizar } = require('./Schemas/ricks');
// const cors = require('cors')

const PORT = process.env.PORT || 1234; // Definimos el puerto, permitiendo que sea sugerido o utilizando el puerto 1234 por defecto

app.use(express.json()); // Middleware para facilitar las solicitudes de tipo API REST
// app.use(cors())
app.disable('x-powered-by'); // Desactivamos la información innecesaria 'x-powered-by' del header

const ACCEPTED_ORGINS = [
  'http://127.0.0.1:5500/',
  'http://127.0.0.1:5500'
]

///GET PARA TRAER TODOS LOS DATOS
app.get('/ricks', (req, res) => { // Endpoint para obtener información sobre Ricks
const origin = req.header('origin')
if(ACCEPTED_ORGINS.includes(origin)|| !origin){
  res.header('Access-Control-Allow-Origin',origin)
}
 
  const { status } = req.query; // Extraemos el parámetro 'status' de la URL
  if (status) {
    const filterStatus = ricks.filter(stat => stat.status.includes(status));
    return res.json(filterStatus); // Si se proporciona 'status', se filtra y devuelve el resultado
  }
  res.json(ricks); // Si no se proporciona 'status', se devuelve toda la información
});



app.get('/ricks/:id', (req, res) => { // Endpoint para obtener información sobre un Rick específico por su ID
  const { id } = req.params; // Extraemos el parámetro 'id' de la URL
  const rick = ricks.find((rick) => rick.id === id);
  if (rick) {
    res.json(rick); // Si se encuentra el Rick, se devuelve su información
  } else {
    res.status(404).json({ message: 'No se encontró el rick' }); // Si no se encuentra, se devuelve un error 404
  }
});

app.post('/ricks', (req, res) => { // Endpoint para crear un nuevo Rick mediante una solicitud POST
  const result = validar(req.body)

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) })

  }

  const newRick = {
    id: crypto.randomUUID(), // Generamos una nueva ID para el nuevo Rick
    ...result.data
  }

  ricks.push(newRick); // Añadimos el nuevo Rick al array de Ricks
  res.status(201).json(newRick); // Indicamos que el objeto fue creado y devolvemos la información del nuevo Rick
});


///ACTUALIZAR PARCIALMENTE

app.patch('/ricks/:id', (req, res) => { //Esta es la ruta correspondiente para actualizar parcialmente

  const result = actualizar(req.body) // En la constante guardamos los datos que nos trae la solicitud

  if (!result.success) {//si el resultado  no es success arrojará no encontrado
    return res.status(400).json({error: JSON.parse(result.error.message)  })  }

  const { id } = req.params // solicitamos el id desde la url y la guardamos

  const rickIndex = ricks.findIndex((rick) => rick.id === id) //buscamos en el Json si hay o no un rick que tenga el id

  if (rickIndex !== -1) {//Si encuentra algo la rickIndex va a ser != a -1
    const updateRick = {
      ...ricks[rickIndex], // Inicializa con el rick existente en el índice específico
      ...result.data, // Sobrescribe con los datos proporcionados en la solicitud
    }
    ricks[rickIndex] = updateRick//actualizamos el rick index con la nueva información

    return res.json(updateRick)//retornamos el resultado
  }
  return res.status(404).json({ message: 'rick no encontradooooo' })
})

app.delete('/ricks/:id', (req,res)=>{

  const origin = req.header('origin')
  if(ACCEPTED_ORGINS.includes(origin)|| !origin){
    res.header('Access-Control-Allow-Origin',origin)
  }
  
  const { id } = req.params
  const ricksIndex = ricks.findIndex(rick=> rick.id === id)

  if(ricksIndex === - 1){
    return  res.status(404).json({message: 'rick no encontrado'})
  }
  ricks.splice(ricksIndex,1)

  return res.json({message: "rick eliminado"})
})

app.options('/ricks/:id', (req,res)=>{
  const origin = req.header('origin')
  if(ACCEPTED_ORGINS){
    res.header('Access-Control-Allow-Origin',origin )
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH')
  }

  res.send(201)
})

app.listen(PORT, () => {
  console.log(`Server listening on port: http://localhost:${PORT}`);
});
