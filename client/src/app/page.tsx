import QRCode from "@/components/QRCode"
import { useGameHandler } from "./_/game"

import styles from "./page.module.css"

export default function Page() {
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
