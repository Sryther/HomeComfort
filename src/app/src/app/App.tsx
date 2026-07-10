import './App.css';
import {Container} from "@mui/material";
import Menu from "../menu/Menu";
import React, {Component} from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import DevicesPage from "../pages/DevicesPage";
import Toasts from "../toasts/Toasts";
import SchedulesPage from "../pages/SchedulesPage";
import HistoryPage from "../pages/HistoryPage";
import RoutinesPage from "../pages/RoutinesPage";

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
        // Fonts only. The viewport meta (incl. viewport-fit=cover) is defined in
        // index.html; don't re-inject it here or it overwrites that configuration.
        const $linkInter = document.createElement("link");
        const $linkIcon = document.createElement("link");
        document.head.appendChild($linkInter);
        document.head.appendChild($linkIcon);
        $linkInter.rel = "stylesheet";
        $linkInter.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
        $linkIcon.rel = "stylesheet";
        $linkIcon.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    }

    render() {
        return (
            <div className="App">
                <Toasts />
                <HashRouter>
                    <Menu />
                    <Container
                        maxWidth="md"
                        sx={{
                            // Top padding clears the fixed burger button; horizontal
                            // padding tightens on phones.
                            pt: { xs: 9, sm: 10 },
                            px: { xs: 2, sm: 3 },
                            pb: 6,
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Navigate to="/devices" replace />} />
                            <Route path="/devices" element={<DevicesPage />} />
                            <Route path="/schedules" element={<SchedulesPage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="/scenes" element={<RoutinesPage />} />
                        </Routes>
                    </Container>
                </HashRouter>
            </div>
        );
    }
}

export default App;
