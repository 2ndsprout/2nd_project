'use client'

import { useParams } from "next/navigation"

export default function ArticleDetail () {
    
    const params = useParams()
    console.log(params.id)
    return (
        <div>
            <h1>Article Detail {params.id}</h1>
        </div>
    )
}