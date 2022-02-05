import './App.css';
import {Container} from "@mui/material";
import Menu from "../menu/Menu";
import React, {Component} from "react";

import Devices from "../devices/Devices";

class App extends Component {
    componentDidMount() {
        const $linkRoboto = document.createElement("link");
        const $linkIcon = document.createElement("link");
        const $metaResponsive = document.createElement("meta");
        document.head.appendChild($linkRoboto);
        document.head.appendChild($linkIcon);
        document.head.appendChild($metaResponsive);
        $linkRoboto.rel = "stylesheet";
        $linkRoboto.href = "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";
        $linkIcon.rel = "stylesheet";
        $linkIcon.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
        $metaResponsive.name = "viewport";
        $metaResponsive.content = "initial-scale=1, width=device-width";
    }

    render() {
      return (
          <div className="App">
              <Menu />
              <Container maxWidth="lg">
                  <Devices />
              </Container>
          </div>
      );
    }
}

export default App;
