import React, { Component } from 'react';
import BurgerMenu from 'react-burger-menu';

import "./Menu.css";
import logo from "../small-logo.png";

interface IMenuProps {}
interface IMenuState {}

class Menu extends Component<IMenuProps, IMenuState> {
    showSettings(event: any) {
        event.preventDefault();
    }

    render() {
        const Bubble = BurgerMenu.bubble;
        return (
            <Bubble customBurgerIcon={<img className={"logo"} src={logo}  alt={"logo"}/>}>
                <a id="home" className="menu-item" href="/">Accueil</a>
                <a id="devices" className="menu-item" href="/">Tous les équipements</a>
                <a id="scenes" className="menu-item" href="/">Scènes</a>
                <a id="schedules" className="menu-item" href="/">Programmes</a>
            </Bubble>
        );
    }
}

export default Menu;
