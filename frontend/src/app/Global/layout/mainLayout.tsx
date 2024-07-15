import { getSocket, Subscribe } from "@/app/API/SocketAPI";
import { useEffect, useState } from "react";

interface pageInterface {
    children: React.ReactNode,
    className?: string
    user: any
    profile: any
    categories: any[]
    keyword?: string;
  }
  export default function Main(props: Readonly<pageInterface>) {

    return <main >
        <header>

        </header>
        <nav>

        </nav>
        {props.children}
        <footer>

        </footer>
    </main>
}