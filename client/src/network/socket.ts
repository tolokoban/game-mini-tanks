import JSON5 from "json5"

class Socket {
    private _ws: WebSocket | null = null
    private readonly callbacks: Record<string, (message: any) => void> = {}

    private get ws() {
        if (!this._ws) throw new Error("Websocket is not connected yet!")

        return this._ws
    }

    async connect() {
        return new Promise((resolve) => {
            const { host } = globalThis.location
            const url = `ws:${host}/ws/`
            console.log("Connecting:", url)
            try {
                this._ws = new WebSocket(url)
                const { ws } = this
                const handleConnect = () => {
                    console.log("Connected!")
                    ws.removeEventListener("open", handleConnect)
                    ws.removeEventListener("error", handleError)
                    resolve(this)
                }
                const handleError = (evt: Event) => {
                    console.error("Websocket error:", evt)
                    ws.removeEventListener("error", handleError)
                    resolve(null)
                }
                ws.addEventListener("open", handleConnect)
                ws.addEventListener("error", handleError)
                ws.addEventListener("message", (evt) => {
                    this.parseMessage(evt.data)
                })
            } catch (ex) {
                console.error(ex)
                resolve(null)
            }
        })
    }

    register(type: string, callback: (message: any) => void) {
        this.callbacks[type] = callback
    }

    send(type: string, message: any) {
        const { ws } = this
        ws.send(JSON5.stringify([type, message].filter((item) => !!item)))
    }

    private parseMessage(message: string) {
        console.log(">>>", message)
        try {
            const data = JSON5.parse(message)
            if (!Array.isArray(data)) return

            const [type, args] = data
            const callback = this.callbacks[type]
            callback?.(args)
        } catch (ex) {
            console.error("Unable to parse this message:", message)
            console.error(ex)
        }
    }
}

export const socket = new Socket()
