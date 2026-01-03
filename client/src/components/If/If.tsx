import React from "react"
import { Theme } from "@tolokoban/ui"

import Styles from "./If.module.css"

const $ = Theme.classNames

export interface IfProps {
    cond: unknown
    children: React.ReactNode
}

export default function If({ cond, children }: IfProps) {
    if (!cond) return null

    return children
}
