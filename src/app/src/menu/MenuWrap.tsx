import React, { Component } from 'react';

interface MenuWrapProps {}
interface MenuWrapState {
    hidden: boolean
}

class MenuWrap extends Component<MenuWrapProps, MenuWrapState> {
    constructor(props: any) {
        super(props);
        this.state = {
            hidden: false
        };
    }

    show() {
        this.setState({
            hidden: false
        });
    }

    render() {
        let style;

        if (this.state.hidden) {
            style = { display: 'none' };
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}

export default MenuWrap;
