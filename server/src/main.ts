import OS from "node:os"
import Path from "node:path"
import { IncomingMessage, Server, ServerResponse } from "node:http"

import { WebSocketExpress, Router } from "websocket-express"
import Open from "open"

const app = new WebSocketExpress()
const router = new Router()
const clients: WebSocket[] = []
router.ws("/ws", async (req, res) => {
    const ws: WebSocket = await res.accept()
    clients.push(ws)
    ws.addEventListener("message", (msg) => {
        const data = msg.data.toString()
        console.log(">>>", data)
        for (const client of clients) {
            // if (client === ws) continue

            client.send(data)
        }
    })
})
app.use(router)
const path = Path.resolve("..", "client", "build")
app.useHTTP(WebSocketExpress.static(path))

function getLocalExternalIP() {
    const interfaces = OS.networkInterfaces()
    for (const name of Object.keys(interfaces)) {
        const networks = interfaces[name] ?? []
        for (const iface of networks) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address
            }
        }
    }
    return "localhost"
}

async function listen(
    port: number
): Promise<Server<typeof IncomingMessage, typeof ServerResponse> | null> {
    return new Promise((resolve) => {
        console.log(`Starting web server on port ${port}...`)
        const server = app.listen(port, "0.0.0.0")
        server.on("listening", () => {
            console.log(`Listening on port ${port}.`)
            resolve(
                server as Server<typeof IncomingMessage, typeof ServerResponse>
            )
        })
        server.on("error", (err) => {
            console.error(err)
            resolve(null)
        })
    })
}

async function connect(): Promise<Server> {
    for (let port = 1111; port < 0xffff; port++) {
        const server = await listen(port)
        if (server) return server
    }
    throw new Error("Unable to create a web server!")
}

async function start() {
    const server = await connect()
    const info = server.address()
    if (!info || typeof info === "string")
        throw new Error("An error occured when trying to start ExpressJS!")

    const host = getLocalExternalIP()
    const url = `http://${host}:${info.port}`
    console.log("Opening browser:", url)
    Open(url)
}

start()
