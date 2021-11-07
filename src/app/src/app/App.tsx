import './App.css';
import Typography from '@material-ui/core/Typography';
import {Box, Container} from "@material-ui/core";
import Menu from "../menu/Menu";
import Map from "../map/Map";
import React, {Component} from "react";

class App extends Component {
    render() {
      return (
          <div className="App">
              <Menu />
              <Container maxWidth="sm">
                <Box my={4}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Create React App v4-beta example
                  </Typography>
                </Box>
              </Container>
          </div>
      );
    }
}

export default App;
