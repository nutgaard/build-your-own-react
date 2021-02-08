import VCompositeNode from './VCompositeNode';
import VDomNode from './VDomNode';
import {ReactElement} from '../../react';

declare global {
    interface ChildNode {
        _vNode: any;
    }
}

interface Root {
    reactElement?: ReactElement;
    domContainerNode?: HTMLElement;
}

const root: Root = {};
type VNode = VCompositeNode | VDomNode;
export function instantiateVNode(reactElement: ReactElement): VNode {
    const {type} = reactElement || {};

    if (VCompositeNode.isVCompositeNode(type)) {
        return new VCompositeNode(reactElement);
    }

    return new VDomNode(reactElement);
}

function render(
    reactElement: ReactElement = root.reactElement,
    domContainerNode: HTMLElement = root.domContainerNode
): void {
    if (domContainerNode.firstChild) {
        const prevVNode = domContainerNode.firstChild._vNode;
        const prevReactElement = prevVNode.getCurrentReactElement();

        if (prevReactElement.type === reactElement.type) {
            prevVNode.update(reactElement);
            return prevVNode.getPublicInstance();
        }

        domContainerNode.innerHTML = '';
    }

    const vNode = instantiateVNode(reactElement);

    const domNode = vNode.mount();
    domNode._vNode = vNode;

    domContainerNode.appendChild(domNode);

    root.reactElement = reactElement;
    root.domContainerNode = domContainerNode;
}

export default {
    _reRender: () => setTimeout(render, 0),
    render
};
