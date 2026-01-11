import './App.css';
import {Container} from "@mui/material";
import Menu from "../menu/Menu";
import React, {Component} from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Devices from "../devices/Devices";
import Toasts from "../toasts/Toasts";
import SchedulesPage from "../pages/SchedulesPage";
import HistoryPage from "../pages/HistoryPage";
import ScenesPage from "../pages/ScenesPage";

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

    render() {
      return (
          <div className="App">
              <Toasts />
              <HashRouter>
                  <Menu />
                  <Container maxWidth="md">
                      <Routes>
                          <Route path="/" element={<Navigate to="/devices" replace />} />
                          <Route path="/devices" element={<Devices />} />
                          <Route path="/schedules" element={<SchedulesPage />} />
                          <Route path="/history" element={<HistoryPage />} />
                          <Route path="/scenes" element={<ScenesPage />} />
                      </Routes>
                  </Container>
              </HashRouter>
          </div>
      );
    }
}

export default App;
