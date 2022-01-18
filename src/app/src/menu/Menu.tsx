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
        return (
            <BurgerMenu.bubble>
                <a id="home" className="menu-item" href="/">Accueil</a>
                <a id="schedules" className="menu-item" href="/">Programmes</a>
                <a id="about" className="menu-item" href="/about">About</a>
                <a id="contact" className="menu-item" href="/contact">Contact</a>
                <a onClick={ this.showSettings } className="menu-item--small" href="">Settings</a>
            </BurgerMenu.bubble>
        );
    }
}

export default Menu;
