import { State } from "@/state"
import { assertType } from "@tolokoban/type-guards"
import { socket } from "./socket"

class Server {
    constructor() {
        socket.register("join", this.handleJoin)
        socket.register("list-joiners", this.handleListJoiners)
    }

    usePlayers() {
        return State.players.useValue()
    }

    /**
     * A client just joined.
     */
    private readonly handleJoin = (args: any) => {
        try {
            assertType(args, { id: "number", name: "string" })
            State.players.value = [
                ...State.players.value.filter((item) => item.id !== args.id),
                args,
            ]
            this.broadcastJoiners()
        } catch (ex) {
            console.error("Error in handleJoin:", args)
            console.error(args)
        }
    }

    /**
     * Get the list of players that have already joined.
     */
    private readonly handleListJoiners = () => {
        this.broadcastJoiners()
    }

    private broadcastJoiners() {
        socket.send("joiners", State.players)
    }
}

export const server = new Server()
