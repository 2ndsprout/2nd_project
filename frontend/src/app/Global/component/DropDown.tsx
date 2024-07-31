import React, { ReactNode, useEffect, useState } from 'react';

interface DropProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    width: number;
    height: number;
    defaultDirection: Direction;
    background: string;
    button: string;
    x?: number;
    y?: number;
}

export enum Direction {
    UP = 'UP',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    LEFT = 'LEFT'
}

const DropDown: React.FC<DropProps> = ({
    open,
    onClose,
    children,
    className = '',
    width,
    height,
    defaultDirection,
    background,
    button,
    x = 0,
    y = 0
}) => {
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const updateButtonRect = () => {
            const buttonElement = document.getElementById(button);
            if (buttonElement) {
                setButtonRect(buttonElement.getBoundingClientRect());
            }
        };

        updateButtonRect(); // Initial update
        window.addEventListener('resize', updateButtonRect); // Update on resize

        return () => {
            window.removeEventListener('resize', updateButtonRect);
        };
    }, [button]);

    if (!open || !buttonRect) return null;

    const { top, left } = buttonRect;
    const adjustedX = x ?? 0;
    const adjustedY = y ?? 0;

    const styles: React.CSSProperties = {
        position: 'fixed',
        top: defaultDirection === Direction.UP
            ? `${top - height - adjustedY}px`
            : defaultDirection === Direction.DOWN
                ? `${top + buttonRect.height + adjustedY}px`
                : defaultDirection === Direction.LEFT
                    ? `${top + adjustedY}px`
                    : `${top + adjustedY}px`,
        left: defaultDirection === Direction.LEFT
            ? `${left - width - adjustedX}px`
            : defaultDirection === Direction.RIGHT
                ? `${left + buttonRect.width + adjustedX}px`
                : `${left + adjustedX}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 950,
        backgroundColor: background,
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`p-2 shadow menu dropdown-content ${className}`}
            style={styles}
        >
            {children}
        </div>
    );
};

export default DropDown;
