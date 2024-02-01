const express = require('express')

const ricks = require('./rick.json')

const encrypt = require('node:crypto')

const app = express()


const PORT = process.env.PORT || 1234
app.disable('x-powered-by');

app.use(express.json())

app.get('/ricks', (req, res) => {

    const { status } = req.query;

    if (status) {
        const filter = ricks.filter(fill => fill.status.includes(status));
        return res.json(filter);
    } else {
        res.json(ricks)
    }

})


app.get('/ricks/:id', (req, res) => {
    const { id } = req.params
    const rick = (ricks.find((rick) => rick.id === id))
    if (rick) {
        res.json(rick)
    } else {
        res.status(404).json({
            message: 'NO se encontró al rick solicitado'
        })
    }
})

app.post('/ricks', (req,res)=>{
    const {
        name,
        status,
        species,
        type,
        gender
    }=req.body;


    const newRick={
        id: crypto.randomUUID(),
        name,
        status,
        species,
        type,
        gender
    }

    ricks.push(newRick);
    res.status(201).json(newRick)
})

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`)
})