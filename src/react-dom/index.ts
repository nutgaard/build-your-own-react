import VDomNode from './VDomNode';
import {ReactElement} from "../react";
import VCompositeNode from "./VCompositeNode";
import Component from "../react/Component";

type VNode = VDomNode | VCompositeNode;
export interface ClassCache {
    index: number;
    cache: Array<Component>;
}
export function instantiateVNode(reactElement: null | string | number | ReactElement): VNode {
    if (reactElement === null) {
        return new VDomNode('');
    } else if (typeof reactElement === 'string' || typeof reactElement === 'number') {
        return new VDomNode(reactElement.toString());
    } else if (typeof reactElement.type === 'function') {
        return new VCompositeNode(reactElement);
    }
    return new VDomNode(reactElement);
}

let element: ReactElement | null = null;
let container: HTMLElement | null = null;
let classCache: ClassCache = {
    index: 0,
    cache: []
}

function render(reactElement: ReactElement, domContainerNode: HTMLElement) {
    element = reactElement;
    container = domContainerNode;
    const domNode = instantiateVNode(reactElement).mount(classCache);
    domContainerNode.appendChild(domNode);
}
function rerender() {
    container.innerHTML = '';
    classCache.index = 0;
    render(element, container);
}

export default {
    _reRender: () => setTimeout(rerender, 0),
    render
};
