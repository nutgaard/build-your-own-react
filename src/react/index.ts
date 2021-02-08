import Component from './Component';

const $$typeof = Symbol.for('react.element');
type Constructor<T> = (new (props: any) => T) & { prototype: T };

export type FunctionComponent = Function & ((props: any) => null | ReactElement);
export type ClassComponent = Constructor<Component>;
export type ComponentType = string | FunctionComponent | ClassComponent;

export type ReactChildren = Array<number | string | ReactElement>
export type ReactElement = {
    type: ComponentType;
    $$typeof: symbol;
    props?: {
        [key: string]: any;
        children: ReactChildren;
    };
}

function createElement<PROPS = {}>(type: ComponentType, props: PROPS = null, ...children: Array<number | string | string[] | ReactElement>): ReactElement {
    return {
        $$typeof,
        type,
        props: {
            ...props,
            children: children.flat(1)
        }
    }
}

export default {
    createElement: createElement,
    Component: Component
};
