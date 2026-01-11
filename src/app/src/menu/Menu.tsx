import React, { Component } from "react";
import BurgerMenu from "react-burger-menu";
import { Link } from "react-router-dom";
import "./Menu.css";
import logo from "../small-logo.png";

interface State {
    isOpen: boolean;
}

class Menu extends Component<{}, State> {
    state: State = {
        isOpen: false
    };

    handleStateChange = (state: any) => {
        this.setState({ isOpen: state.isOpen });
    };

    closeMenu = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const Bubble = (BurgerMenu as any).bubble;
        return (
            <Bubble isOpen={this.state.isOpen}
                    onStateChange={this.handleStateChange}
                    customBurgerIcon={<img className={"logo"} src={logo} alt={"logo"} />}
            >
                <Link className="menu-item" to="/devices" onClick={this.closeMenu}>Équipements</Link>
                <Link className="menu-item" to="/scenes" onClick={this.closeMenu}>Routines</Link>
                <Link className="menu-item" to="/schedules" onClick={this.closeMenu}>Programmes</Link>
                <Link className="menu-item" to="/history" onClick={this.closeMenu}>Historique</Link>
            </Bubble>
        );
    }
}

export default Menu;
