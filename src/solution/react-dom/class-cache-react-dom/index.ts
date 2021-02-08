import VCompositeNode from './VCompositeNode';
import VDomNode from './VDomNode';
import {Component, ReactElement} from "../../react";

interface Root {
    reactElement?: ReactElement;
    domContainerNode?: HTMLElement;
}
const root: Root = {};
const classCache = {
    index: -1,
    cache: []
};

export type VNode = VCompositeNode | VDomNode;
export function instantiateVNode(reactElement: ReactElement): VNode {
    const { type } = reactElement || {};

    if (VCompositeNode.isVCompositeNode(type)) {
        return new VCompositeNode(reactElement);
    }

    return new VDomNode(reactElement);
}

function render(
    reactElement = root.reactElement,
    domContainerNode = root.domContainerNode
): void {
    if (root.domContainerNode) {
        domContainerNode.innerHTML = '';
        classCache.index = -1;
    }

    const vNode: VNode = instantiateVNode(reactElement);
    const domNode: HTMLElement = vNode.mount(classCache);

    domContainerNode.appendChild(domNode);

    root.reactElement = reactElement;
    root.domContainerNode = domContainerNode;
}

export default {
    _reRender: () => setTimeout(render, 0),
    render
};
