import { ReactNode, useEffect, useState } from 'react';

interface DropProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className: string;
    width: number;
    height: number;
    defaultDriection: Direcion;
    background: string;
    button: string;
    x?: number;
    y?: number;
}

export enum Direcion {
    UP, RIGHT, DOWN, LEFT
}

const DropDown = (props: DropProps) => {
    if (!props.open) return null;

    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const buttonElement = document.getElementById(props.button);
        if (buttonElement) {
            setButtonRect(buttonElement.getBoundingClientRect());
        }
    }, [props.button]);

    if (!buttonRect) return null;

    const direction = props.defaultDriection;
    const x = props.x || 0;
    const y = props.y || 0;

    let top = 0;
    let left = 0;

    switch (direction) {
        case Direcion.UP:
            top = buttonRect.top - props.height - y;
            left = buttonRect.left + x;
            break;
        case Direcion.DOWN:
            top = buttonRect.bottom + y;
            left = buttonRect.left + x;
            break;
        case Direcion.LEFT:
            top = buttonRect.top + y;
            left = buttonRect.left - props.width - x;
            break;
        case Direcion.RIGHT:
            top = buttonRect.top + y;
            left = buttonRect.right + x;
            break;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            onClick={handleClick}
            className={`p-2 shadow menu dropdown-content ${props.className}`}
            style={{
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${props.width}px`,
                height: `${props.height}px`,
                zIndex: 1000,
                backgroundColor: props.background,
            }}
        >
            {props.children}
        </div>
    );
};

export default DropDown;
