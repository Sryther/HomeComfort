import './App.css';
import {Container} from "@material-ui/core";
import Menu from "../menu/Menu";
import React, {Component} from "react";

import Devices from "../devices/Devices";

class App extends Component {
    render() {
      return (
          <div className="App">
              <Menu />
              <Container maxWidth="sm">
                  <Devices/>
              </Container>
          </div>
      );
    }
}

export default App;
