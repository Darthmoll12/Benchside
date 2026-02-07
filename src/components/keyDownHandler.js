'use client'

export default function keyDownHandler(e) {
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
    if (/[a-zA-Z!@#$%^&*()_+=[\]{};':"\\|,<>/?]/.test(e.key)) {
         e.preventDefault()
    }
}