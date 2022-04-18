import './App.css';
import {Container, Snackbar} from "@mui/material";
import Menu from "../menu/Menu";
import React, {Component} from "react";

import Devices from "../devices/Devices";

interface IAppProps {}

interface IAppState {
    snackOpen: boolean,
    snackMessage: string
}

class App extends Component<IAppProps, IAppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            snackOpen: false,
            snackMessage: ""
        }
    }

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

    setSnackOpen(opened: boolean) {
        this.setState({
            snackOpen: opened
        });
    }

    setSnackMessage(message: string) {
        this.setState({
            snackMessage: message
        });
    }

    handleSnackClose(event: React.SyntheticEvent | Event, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }

        this.setSnackOpen(false);
    };

    render() {
      return (
          <div className="App">
              <Menu />
              <Container maxWidth="md">
                  <Devices />
              </Container>
              <Snackbar
                  open={this.state.snackOpen}
                  autoHideDuration={6000}
                  onClose={this.handleSnackClose.bind(this)}
                  message={this.state.snackMessage}
              />
          </div>
      );
    }
}

export default App;
