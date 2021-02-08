import {ClassCache, instantiateVNode} from './index';
import {ClassComponent, ComponentType, FunctionComponent, ReactElement} from "../react";
import Component from "../react/Component";

export default class VCompositeNode {
    static isFunctionComponent(type: ComponentType): type is FunctionComponent {
        return typeof type === 'function' && !type.prototype.isReactComponent;
    }
    static isClassComponent(type: ComponentType): type is ClassComponent {
        return typeof type === 'function' && type.prototype.isReactComponent;
    }

    private reactElement: ReactElement;
    constructor(reactElement: ReactElement) {
        this.reactElement = reactElement;
    }

    getPublicInstance() {}

    update() {}

    mount(classCache: ClassCache): HTMLElement | Text {
        const type = this.reactElement.type;
        if (VCompositeNode.isFunctionComponent(type)) {
            const element = type(this.reactElement.props);
            return instantiateVNode(element).mount(classCache);
        } else if (VCompositeNode.isClassComponent(type)) {
            const cacheIndex = classCache.index++;
            const cachedInstance = classCache.cache[cacheIndex];
            const element: Component = cachedInstance ? cachedInstance : new type(this.reactElement.props);
            classCache.cache[cacheIndex] = element;
            return instantiateVNode(element.render()).mount(classCache);
        }
    }
}
