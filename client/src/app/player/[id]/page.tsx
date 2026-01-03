import { useLocalStorageState, ViewButton, ViewInputText } from "@tolokoban/ui"
import React from "react"

import { useRouteParamAsInt } from "@/app/routes"
import { socket } from "@/network/socket"

export default function Page() {
    const id = useRouteParamAsInt("id")
    const [name, setName] = useLocalStorageState("", "player/name")
    const handleJoinTheGame = React.useCallback(() => {
        socket.send("join", { id, name })
    }, [id, name])
    React.useEffect(() => {
        socket.send("join", { id, name: "" })
    }, [])

    return (
        <div>
            <h1>Player {id}</h1>
            <ViewInputText
                value={name}
                onChange={setName}
                label="Enter your Nickname"
            />
            <ViewButton onClick={handleJoinTheGame}>Join the Game!</ViewButton>
        </div>
    )
}
