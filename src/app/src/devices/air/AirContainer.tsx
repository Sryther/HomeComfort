import React, {Component} from "react";
import AirComponent from "./AirComponent";
import getClient from "../../api-client";
import {Box} from "@mui/material";

interface IDevicesProps {}
interface IDevicesState {
    devices: any[]
}

class AirContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        devices: []
    }

    async componentDidMount() {
        try {
            const { data } = await getClient().get("/air/daikin");
            this.setState({
                devices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {this.state.devices.map((device: any) => <AirComponent key={device._id} id={device._id} name={device.name} ip4={device.ip4} ip6={device.ip6} />)}
            </Box>
        )
    }
}

export default AirContainer;
