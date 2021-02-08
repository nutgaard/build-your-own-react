import ReactDOM from '../react-dom';
import {ReactElement} from "./index";

type StateUpdater<STATE> = Partial<STATE> | ((previousState: STATE) => Partial<STATE>);
class Component<PROPS = {}, STATE = {}> {
    public props: PROPS;
    public state: STATE;
    isReactComponent: true;

    constructor(props?: PROPS) {
        this.props = props;
    }

    setState(state: StateUpdater<STATE>, callback?: () => void) {
        // Do not rerender if setState is called with null or undefined
        if (state == null) {
            return;
        }

        if (typeof state === 'function') {
            this.state = { ...this.state, ...state(this.state) };
        } else {
            this.state = { ...this.state, ...state };
        }

        ReactDOM._reRender();
        if (callback) {
            callback.call(this);
        }
    }

    render(): ReactElement {
        throw new Error('React.Component may not be used directly. Create your own class which extends this class.');
    }
}

Component.prototype.isReactComponent = true;
export default Component;
