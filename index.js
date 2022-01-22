const express = require('express')
const uuid = require('uuid')

const port = 3001
const app = express()
app.use(express.json())

app.listen(port, () => {
    console.log(`🚀 Server Started on port ${port}`)
})

/*
    - GET => Buscar
    - POST => Criar
    - PUT / PATCH => Alterar
    - DELETE => Deletar

    -Middleware => interceptador => tem o poder de parar ou alterar dados da requisição 
*/

const users = []

const checkUserId = (request,response, next) => {
    const { id } = request.params

    const index = users.findIndex( user => user.id == id)

    if(index < 0) {
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

//GET
app.get('/users', (request, response) => {
    return response.json(users)
})

//POST
app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
})

//PUT
app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(users[index])
})

//DELETE
app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json()
})
