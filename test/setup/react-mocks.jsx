import {redefined} from "../../src";
import * as React from "react";

@redefined('componentOverride')
export class ComponentOriginal extends React.Component {
    state = {
        counter: 0
    }
    setCounter = () => {
        this.setState({counter: this.state.counter + 1})
    }

    render() {
        return <div>
            <strong onClick={this.setCounter}>
                {this.props.text + ' ' + this.state.counter}
            </strong>
        </div>
    }
}

export class ComponentOverride extends React.Component {
    state = {
        counter: 0
    }

    setCounter = () => {
        this.setState({counter: this.state.counter + 100})
    }

    render() {
        return <div>
            <strong className={'.text-override'} onClick={this.setCounter}>
                {this.state.counter + ' ' + this.props.text}
            </strong>
        </div>
    }
}

export class ComponentChildrenOverride extends React.Component {
    state = {
        counter: 0
    }

    setCounter = () => {
        this.setState({counter: this.state.counter + 100})
    }

    render() {
        return <div>
            <strong className={'.text-override'} onClick={this.setCounter}>
                {this.props.children}
            </strong>
        </div>
    }
}
