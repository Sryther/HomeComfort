import React, { Component } from "react";
import MapSVG from './map.svg';

class Map extends Component {
    render() {
        return (
            <div>
                <img src={MapSVG} alt={'map'} style={{ width: "inherit", height: "inherit" }} />
            </div>
        );
    }
}

export default Map;
