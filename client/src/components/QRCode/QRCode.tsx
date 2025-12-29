import React from "react"
import { Theme } from "@tolokoban/ui"
import QRCodeGenerator from "qrcode"

import Styles from "./QRCode.module.css"
import { server } from "@/network"

const $ = Theme.classNames

export interface QRCodeProps {
    className?: string
    playerId: number
}

export default function QRCode({ className, playerId }: QRCodeProps) {
    const players = server.usePlayers()
    const player = players.find((item) => item.id === playerId)
    const handleCanvasMount = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return

        QRCodeGenerator.toCanvas(
            canvas,
            `${window.location.href}#/player/${playerId}`,
            (error) => {
                if (error) console.error(error)
                canvas.style.width = "50vmin"
                canvas.style.height = "50vmin"
            }
        )
    }

    return (
        <div className={$.join(className, Styles.qRCode)}>
            <h2>Player {playerId}</h2>
            {player ? (
                <p>
                    <strong>{player.name}</strong> is ready!
                </p>
            ) : (
                <>
                    <canvas ref={handleCanvasMount}></canvas>
                    <p>Scan this code to join the game</p>
                </>
            )}
        </div>
    )
}
