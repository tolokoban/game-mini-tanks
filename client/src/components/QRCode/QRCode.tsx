import React from "react"
import { Theme, ViewSpinner } from "@tolokoban/ui"
import QRCodeGenerator from "qrcode"

import Styles from "./QRCode.module.css"
import { server } from "@/network"
import If from "../If"

const $ = Theme.classNames

export interface QRCodeProps {
    className?: string
    playerId: number
}

export default function QRCode({ className, playerId }: QRCodeProps) {
    const players = server.usePlayers()
    const player = players.find((item) => item.id === playerId)
    const url = `${window.location.href}#/player/${playerId}`
    const handleCanvasMount = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return

        QRCodeGenerator.toCanvas(canvas, url, (error) => {
            if (error) console.error(error)
            canvas.style.width = "50vmin"
            canvas.style.height = "50vmin"
        })
    }

    return (
        <div className={$.join(className, Styles.qRCode)}>
            <h2>Player {playerId}</h2>
            <If cond={player}>
                <If cond={player?.name}>
                    <p>
                        <strong>{player?.name}</strong> is ready!
                    </p>
                </If>
                <If cond={!player?.name}>
                    <ViewSpinner />
                </If>
            </If>
            <If cond={!player}>
                <a href={url} target="_blank">
                    <canvas ref={handleCanvasMount}></canvas>
                </a>
                <p>Scan this code to join the game</p>
            </If>
        </div>
    )
}
