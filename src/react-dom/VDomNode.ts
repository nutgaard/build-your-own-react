import {ClassCache, instantiateVNode} from './index';
import {ReactChildren, ReactElement} from "../react";

export default class VDomNode {
    static buildDomNode(reactElement: string | ReactElement): HTMLElement | Text {
        if (typeof reactElement === 'string') {
            return document.createTextNode(reactElement);
        }
        if (typeof reactElement.type === 'string') {
            const { type, props } = reactElement;
            const domNode = document.createElement(type);
            VDomNode.setAttributes(domNode, props);
            return domNode;
        }
    }

    static setAttributes(element: HTMLElement, props: { [key: string ]: any; }) {
        const { className, style = {}, ...rest } = props;
        element.className = className;
        Object.entries(style).forEach(([key, value]) => {
            element.style[key] = value;
        });
        Object.entries(rest).forEach(([key, value]) => {
            if (/^on.*$/.test(key)) {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
    }

    private reactElement: string | ReactElement;
    constructor(reactElement: string | ReactElement) {
        this.reactElement = reactElement;
    }
    private getChildrenAsArray(): ReactChildren {
        if (typeof this.reactElement === 'string') {
            return [];
        }
        return this.reactElement?.props?.children ?? [];
    }

    getPublicInstance() {}

    update() {}

    mount(classCache: ClassCache): HTMLElement | Text {
        const domNode = VDomNode.buildDomNode(this.reactElement);
        const children = this.getChildrenAsArray();
        for (const child of children) {
            const childVNode = instantiateVNode(child);
            domNode.appendChild(childVNode.mount(classCache))
        }
        return domNode;
    }
}
