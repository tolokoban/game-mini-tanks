import { State } from "@/state"
import { assertType } from "@tolokoban/type-guards"
import { socket } from "./socket"

class Server {
    constructor() {
        socket.register("join", this.handleJoin)
    }

    usePlayers() {
        return State.players.useValue()
    }

    private readonly handleJoin = (args: any) => {
        try {
            assertType(args, { id: "number", name: "string" })
            State.players.value = [
                ...State.players.value.filter((item) => item.id !== args.id),
                args,
            ]
        } catch (ex) {
            console.error("Error in handleJoin:", args)
            console.error(args)
        }
    }
}

export const server = new Server()
