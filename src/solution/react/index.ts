import Component from './Component';

type Constructor<T> = (new (props: any) => T) & { prototype: T };

export type FunctionComponent = (props: any) => ReactElement;
export type ClassComponent = Constructor<Component>;
export type ComponentType = keyof HTMLElementTagNameMap | FunctionComponent | ClassComponent;

export type ReactChildren = ReactElement;
export interface ReactElement {
    $$typeof: symbol;
    type: ComponentType;
    props: {
        [key: string]: any;
        children: Array<ReactChildren>;
    },
    ref: null,
    _owner: null
}

export function createElement<PROPS = {}>(
    type: ComponentType,
    props: PROPS = null,
    ...children: Array<ReactChildren> | Array<Array<ReactChildren>>
): ReactElement {
    return {
        $$typeof: Symbol.for('react.element'),
        type: type,
        props: {
            children: children.flat(1),
            ...props
        },
        ref: null,
        _owner: null
    }
}
export { default as Component } from './Component';

export default {
    createElement,
    Component
}
