
const z = require('zod')

const rickSchema = z.object({
    name: z.string().min(4).max(50),
    status: z.string(),
    species: z.string(),
    type: z.string(),
    gender:z.string(),
    image: z.string()

})
function validar(object){
    return rickSchema.safeParse(object);
}

function actualizar(object){
    return rickSchema.partial().safeParse(object)
}

module.exports = {
    validar,
    actualizar
}