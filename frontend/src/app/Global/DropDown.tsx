import { ReactNode } from 'react';
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
    if (!props.open)
        return null;
    let direction = props.defaultDriection;
    const x = props.x ? props.x : 0;
    const y = props.y ? props.y : 0;

    let position = {};
    const background = document.getElementById(props.background)?.getBoundingClientRect();
    const button = document.getElementById(props.button)?.getBoundingClientRect();

    if (background && button)
        switch (direction) {
            case Direcion.UP: {
                position = { top: button.y - background.y - props.height - button.height / 2 - y, left: x + button.x, width: props.width + 'px', height: props.height + 'px' }
            }
                break;
            case Direcion.DOWN: {
                position = { top: button.y - background.y + button.height - y, left: x + button.x, width: props.width + 'px', height: props.height + 'px' }
            }
                break;
            case Direcion.LEFT: {
                position = { left: button.x - background.x - props?.width + x, top: button.y - background.y - button.height - y, width: props.width + 'px', height: props.height + 'px' }
            }
                break;
            case Direcion.RIGHT: {
                position = { left: button.x - background.x + button.width + x, top: button.y - background.y - button.height - y, width: props.width + 'px', height: props.height + 'px' }
            }
                break;
        }

    return (<div className={'p-2 shadow menu dropdown-content absolute z-[10] ' + props.className} style={position}>
        {props.children}
    </div>);
};
export default DropDown;