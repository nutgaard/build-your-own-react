import {ClassComponent, Component, ReactElement, FunctionComponent, ComponentType} from '../../react';
import { instantiateVNode } from './index';
import VDomNode from './VDomNode';

export default class VCompositeNode {
    static isReactClassComponent(type: ComponentType): type is ClassComponent {
        if (typeof type === 'string') {
            return false;
        }
        return type.prototype && type.prototype.isReactComponent;
    }
    static isReactFunctionComponent(type: ComponentType): type is FunctionComponent {
        return !this.isReactClassComponent(type) && typeof type === 'function';
    }

    static isVCompositeNode(type): boolean {
        return typeof type === 'function';
    }

    private currentReactElement: ReactElement;
    private classInstance: Component;
    private renderedInstance: VDomNode | VCompositeNode;

    constructor(reactElement) {
        this.currentReactElement = reactElement;
        this.classInstance = null;
        this.renderedInstance = null;
    }

    getPublicInstance(): Component {
        return this.classInstance;
    }

    getCurrentReactElement(): ReactElement {
        return this.currentReactElement;
    }

    getDomNode(): HTMLElement | Text {
        return this.renderedInstance.getDomNode();
    }

    update(nextReactElement): void {
        const {
            type,
            props: nextProps,
        } = nextReactElement;

        const nextRenderedReactElement = (() => {
            if (VCompositeNode.isReactClassComponent(type)) {
                this.classInstance.props = nextProps;
                return this.classInstance.render();
            }
            return type(nextProps);
        })();

        const prevRenderedReactElement = this.renderedInstance.getCurrentReactElement();

        const isTypeDefined = VDomNode.isTypeDefined(prevRenderedReactElement)
            && VDomNode.isTypeDefined(nextRenderedReactElement);

        if (isTypeDefined && prevRenderedReactElement.type === nextRenderedReactElement.type) {
            this.renderedInstance.update(nextRenderedReactElement);
        } else {
            const nextRenderedInstance = instantiateVNode(nextRenderedReactElement);

            const prevDomNode = this.getDomNode();
            const nextDomNode = nextRenderedInstance.mount();
            prevDomNode.parentNode.replaceChild(nextDomNode, prevDomNode);

            this.renderedInstance = nextRenderedInstance;
        }
    }

    mount(): HTMLElement | Text {
        const {
            type,
            props,
        } = this.currentReactElement;

        if (VCompositeNode.isReactClassComponent(type)) {
            this.classInstance = new type(props);
            this.renderedInstance = instantiateVNode(this.classInstance.render());
        } else if (VCompositeNode.isReactFunctionComponent(type)) {
            this.classInstance = null;
            this.renderedInstance = instantiateVNode(type(props));
        }

        return this.renderedInstance.mount();
    }
}
