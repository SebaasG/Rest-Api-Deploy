const express = require('express')
const crypto = require('crypto')
const app = express();
const ricks = require('./rick.json');
const cors = require('cors')
const { validar, actualizar } = require('./Schemas/ricks')

app.disable('x-powered-by')

app.use(express.json())

const PORT = process.env.PORT || 1234;

app.use(cors())

app.get('/ricks', (req, res) => {
    const { status } = req.query
    if (status) {
        const rickStatus = ricks.filter(rick => rick.status === status)
        return res.json(rickStatus)
    }
    res.json(ricks)
})

app.get('/ricks/:id', (req, res) => {
    const { id } = req.params
    const rickId = ricks.find(rick => rick.id === id)
    if (rickId) {

        return res.json(rickId)
    } else {
        res.status(404).json({ message: 'No se econtro un rick con la id' + id })
    }
})

app.post('/ricks', (req, res) => {
    const result = validar(req.body)
    if (result.error) {
        res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const nuevoRick = {
        "id": crypto.randomUUID(),
        ...result.data
    }

    ricks.push(nuevoRick)
    res.json(nuevoRick)
})

app.patch('/ricks/:id', (req, res) => {
    const RickUpdate = actualizar(req.body)

    if (RickUpdate.error) {
        return res.status(400).json({ error: JSON.parse(RickUpdate.error.message) })
    }

    const { id } = req.params

    const rickIndex = ricks.findIndex(rick => rick.id === id)

    if (rickIndex !== 1) {
        const rickup = {
            ...ricks[rickIndex],
            ...RickUpdate.data
        }

        ricks[rickIndex] = rickup;
        res.json(ricks[rickIndex])
    } else {
        res.status(400).json({ message: 'error al cambiar los datos de su rick' })
    }

})

app.delete('/ricks/:id', (req, res) => {
    const { id } = req.params
    const ricksIndex = ricks.findIndex(rick => rick.id === id)
    if (ricksIndex !== 1) {
        ricks.splice(ricksIndex, 1)
        res.status(200).json({ message: 'Rick eliminado con éxito' })
    } else {
        res.status(400).json({ message: 'rick no encontrado' })
    }

})

app.listen(PORT, () => {
    console.log("El puerto esta escuchando en: http://localHost:" + PORT)
})