import React, { Component } from 'react';
import BurgerMenu from 'react-burger-menu';
import MenuWrap from './MenuWrap';

import "./Menu.css";

interface IMenuProps {}
interface IMenuState {}

class Menu extends Component<IMenuProps, IMenuState> {
    constructor(props: any) {
        super(props);
    }

    showSettings(event: any) {
        event.preventDefault();
    }

    render () {
        // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
        return (
            <MenuWrap>
                <BurgerMenu.bubble noOverlay>
                    <a id="home" className="menu-item" href="/">Home</a>
                    <a id="about" className="menu-item" href="/about">About</a>
                    <a id="contact" className="menu-item" href="/contact">Contact</a>
                    <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
                </BurgerMenu.bubble>
            </MenuWrap>
        );
    }
}

export default Menu;
