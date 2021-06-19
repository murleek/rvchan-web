import React, { Component } from "react";
import AnimateHeight from "react-animate-height";

export default class AnimHeight extends Component {
    state = {
        contentToggle: false,
        height: "auto"
    };

    componentDidMount() {
        this.setFixedHeight();
    }

    componentDidUpdate(prevProps, prevState, prevHeight) {
        const { children } = this.props;

        if (prevProps.children !== children) {
            this.setState({
                height: "auto"
            });
        }
    }

    setFixedHeight = () => {
        this.setState({
            height: document.querySelector(".Auto").clientHeight
        });
    };

    render() {
        const { height } = this.state;
        const { children } = this.props;
        return (
            <AnimateHeight
                height={height}
                duration={this.props.duration || 500}
                onAnimationEnd={this.setFixedHeight}
                className="Auto"
            >
                {children}
            </AnimateHeight>
        );
    }
}
