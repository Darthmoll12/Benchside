'use client'

import { Input } from "antd"

export default function lotInputHandler(e) {
    if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "Enter" ||
        e.key === "Escape" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
        return
    }
    const regex = /^[a-zA-Z0-9]+$/
    if (!regex.test(e.key)) {
        e.preventDefault()
    }
    
    const input = e.target
    const start = input.selectionStart
    const cleanedValue = input.value.toString().toUpperCase().trim()

    if (input.value !== cleanedValue) {
        input.value = cleanedValue
        input.setSelectionRange(start, start)
    }
}

