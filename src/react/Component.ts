import ReactDOM from '../react-dom';

type StateUpdater<STATE> = Partial<STATE> | ((previous: STATE) => Partial<STATE>);
abstract class Component<PROPS = {}, STATE = {}> {
    public isReactComponent: boolean;
    public props: PROPS;
    public state: STATE;
    constructor(props: PROPS = null) {
        this.props = props;
    }

    setState(state: StateUpdater<STATE>, callback?: () => void) {
        const statePatch = typeof state === 'function' ? state(this.state) : state;
        this.state = {
            ...this.state,
            ...statePatch
        };
        ReactDOM._reRender()
        if (callback) {
            callback.call(this)
        }
    }

    abstract render();
}
Component.prototype.isReactComponent = true;
export default Component;
