const express = require("express")
const app = express()
const uuid = require("uuid")
app.use(express.json())

const port = 3001

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(newOrder => newOrder.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

const requests = (request, response, next) => {
    const method = request.route.methods
    const url = request.route.path

    console.log(method, url)

    next()
}

app.post("/order", requests, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"

    const newOrder = { id: uuid.v4(), order, clientName, price, status }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.get("/order", requests, (request, response) => {
    return response.json(orders)
})

app.put("/order/:id", checkOrderId, requests, (request, response) => {
    const index = request.userIndex
    const id = request.userId

    const { order, clientName, price } = request.body
    const status = "Em preparação"

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete("/order/:id", checkOrderId, requests, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get("/order/:id", checkOrderId, requests, (request, response) => {
    const index = request.userIndex

    const order = orders[index]

    return response.json(order)
})

app.patch("/order/:id", checkOrderId, requests, (request, response) => {
    const index = request.userIndex

    const { id, order, clientName, price } = orders[index]

    const endOfOrder = { id, order, clientName, price, status: "Pronto"}

    orders[index] = endOfOrder

    return response.status(200).json(endOfOrder)
})

app.listen(port, () => {
    console.log(`Hello server started on port ${port}`)
})

