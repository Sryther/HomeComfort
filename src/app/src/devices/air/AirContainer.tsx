import axios from "axios";
import React, {Component} from "react";
import AirComponent from "./AirComponent";

interface IDevicesProps {}
interface IDevicesState {
    airDevices: any[]
}

class AirContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        airDevices: []
    }

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        axios.get("http://localhost:3000/api/air/daikin").then(result => {
            this.setState({
                airDevices: result.data
            });
        }).catch(error => {
            console.error(error);
        });
    }

    render() {
        console.log(this.state.airDevices);
        return (
            <div>
                {this.state.airDevices.map((device: any) => <AirComponent id={device._id} name={device.name} ip4={device.ip4} ip6={device.ip6} />)}
            </div>
        )
    }
}

export default AirContainer;
