import { instantiateVNode } from './index';
import {Component, ClassComponent, FunctionComponent, ReactElement, ComponentType} from "../../react";

export default class VCompositeNode {
    static isReactClassComponent(type: ComponentType): type is ClassComponent {
        if (typeof type === 'string') {
            return false;
        }
        return type && type.prototype && type.prototype.isReactComponent;
    }
    static isFunctionComponent(type: ComponentType): type is FunctionComponent {
        return !this.isReactClassComponent(type) && typeof type === 'function';
    }

    static isVCompositeNode(type: ComponentType): boolean {
        return typeof type === 'function';
    }

    private currentReactElement: ReactElement;
    private classInstance: Component;

    constructor(reactElement: ReactElement) {
        this.currentReactElement = reactElement;
        this.classInstance = null;
    }

    getPublicInstance(): Component {
        return this.classInstance;
    }

    mount(classCache): HTMLElement {
        const {
            type,
            props,
        } = this.currentReactElement;

        let renderedInstance;
        if (VCompositeNode.isReactClassComponent(type)) {
            const cacheIndex = classCache.index++;
            const cachedInstance = classCache.cache[cacheIndex];

            const instance = cachedInstance ? cachedInstance : new type(props);
            instance.props = props;

            classCache.cache[cacheIndex] = instance;

            renderedInstance = instantiateVNode(instance.render());
            this.classInstance = instance;
        } else if (VCompositeNode.isFunctionComponent(type)) {
            renderedInstance = instantiateVNode(type(props));
            this.classInstance = null;
        }

        return renderedInstance.mount(classCache);
    }
}
