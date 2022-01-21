import React, {Component} from "react";
import AirContainer from "./air/AirContainer";

interface IDevicesProps {}
interface IDevicesState {}

class Devices extends Component<IDevicesProps, IDevicesState> {
    constructor(props: any) {
        super(props);
    }

    render () {
        return (
            <div>
                <h3>Air</h3>
                <AirContainer/>
                <h3>Cleaning</h3>
                <h3>Light</h3>
                <h3>Network</h3>
                <h3>Projection screen</h3>
                <h3>Thermal</h3>
                <h3>Video projector</h3>
            </div>
        );
    }
}

export default Devices;
