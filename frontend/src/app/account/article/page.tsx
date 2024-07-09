'use client'

export default async function Articles () {
    await fetch('https://localhost:8080/api/article')
}