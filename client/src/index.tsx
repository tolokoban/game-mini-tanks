import { createRoot } from "react-dom/client"
import { Theme } from "@tolokoban/ui"

import { State } from "./state"
import { socket } from "./network"
import App from "./app"
import FontDosis from "./fonts/dosis"

import "./index.css"

async function start() {
    Theme.apply()
    FontDosis.load300()
    FontDosis.load700()
    const ws = await socket.connect()
    const container = document.getElementById("app")
    if (!container) throw Error("Missing element with id #app!")
    createRoot(container).render(<MainPage />)

    const splash = document.getElementById("tgd-logo")
    if (splash) {
        splash.classList.add("vanish")
        window.setTimeout(() => splash.parentNode?.removeChild(splash), 1000)
    }
}

function MainPage() {
    const lang = State.language.useValue()
    return <App lang={lang} />
}

start()
