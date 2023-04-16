import './Map.css';
import React, { Component } from "react";
import MapSVG from './map.svg';

class Map extends Component {
    render() {
        return (
            <div className={"container"}>
                <img src={MapSVG} alt={'map'} style={{ width: "inherit", height: "inherit", transform: "rotate3d(0, 1, 0, 180deg)" }} />
            </div>
        );
    }
}

export default Map;
