import QRCode from "@/components/QRCode"
import { useGameHandler } from "./_/game"

import styles from "./page.module.css"

export default function Page() {
    console.log("🐞 [page@6] window.location =", window.location) // @FIXME: Remove this line written on 2025-12-29 at 10:45

    return (
        <div className={styles.main}>
            <h1>Mini Tanks</h1>
            <main>
                <QRCode playerId={1} />
                <QRCode playerId={2} />
            </main>
        </div>
    )
}
