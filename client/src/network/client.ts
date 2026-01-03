import { State } from "@/state"
import { assertType } from "@tolokoban/type-guards"
import { socket } from "./socket"

class Client {
    constructor() {
        socket.register("joiners", this.handleJoiners)
    }

    usePlayers() {
        return State.players.useValue()
    }

    /**
     * The list of joined players have been broadcasted.
     */
    private readonly handleJoiners = (args: any) => {
        try {
            assertType(args, ["array", { id: "number", name: "string" }])
            State.players.value = args
            this.broadcastJoiners()
        } catch (ex) {
            console.error("Error in handleJoin:", args)
            console.error(args)
        }
    }

    private broadcastJoiners() {
        socket.send("joiners", State.players)
    }
}

export const client = new Client()
