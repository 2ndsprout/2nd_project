interface MainProps {
    children: React.ReactNode;
    user?: any;
    updateUser?: ()=>void;
}
export default function Main(props: MainProps) {
    return <main>
        <header>
        </header>
        <nav>

        </nav>
        {props.children}
        <footer>

        </footer>
    </main>
}