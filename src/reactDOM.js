const root = {};
const classCache = {
  index: -1,
  cache: []
};

const render = (element, targetElement) => {
  if (element === undefined || element === null) {
    // Not valid
    return null;
  }

  if (!element.type) {
    if (typeof element === "string" || typeof element === "number") {
      // Append text node
      targetElement.appendChild(document.createTextNode(element));
    }
  }

  if (typeof element.type === "function") {
    // Recursivly render components
    if (
      element.type.prototype &&
      typeof element.type.prototype.render === "function"
    ) {
      // Class component
      classCache.index++;
      const component = classCache.cache[classCache.index] ? classCache.cache[classCache.index] : new element.type(element.props);
      classCache.cache[classCache.index] = component;
      render(component.render(), targetElement);
    } else {
      // Function component
      render(element.type(element.props), targetElement);
    }
  }

  if (typeof element.type === "string") {
    // Render html-tags
    const node = document.createElement(element.type);
    const component = targetElement.appendChild(node);

    // Set className
    if (element.props.className) {
      node.className = element.props.className;
    }

    // Set styles
    if (element.props.style) {
      Object.entries(element.props.style)
        .forEach(([style, value]) => {
          node.style[style] = value;
        });
    }

    // Add event listeners
    Object.keys(element.props)
      .filter(prop => /^on.*$/.test(prop))
      .forEach(prop => node.addEventListener(prop.substring(2).toLowerCase(), element.props[prop]));

    // Render children
    if (Array.isArray(element.props.children)) {
      element.props.children.forEach(child => {
        render(child, component);
      });
    } else if (element.props.children) {
      render(element.props.children, component);
    }
  }
};

module.exports = {
  render: (element, targetElement) => {
    root.element = element;
    root.targetElement = targetElement;
    render(element, targetElement);
  },
  __reRender: () => {
    while (root.targetElement.hasChildNodes()) {
      root.targetElement.removeChild(root.targetElement.lastChild);
    }

    classCache.index = -1;

    render(root.element, root.targetElement);
  }
};