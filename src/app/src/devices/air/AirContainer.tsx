import React, {Component} from "react";
import AirDaikinComponent from "./AirDaikinComponent";
import {Stack} from "@mui/material";
import AirApiClient from "../../api-client/clients/AirApiClient";

interface IDevicesProps {}
interface IDevicesState {
    daikinDevices: any[]
}

class AirContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        daikinDevices: []
    }

    async componentDidMount() {
        try {
            const { data } = await AirApiClient.getInstance().allDaikins();
            this.setState({
                daikinDevices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.daikinDevices.map((device: any) => <AirDaikinComponent key={device._id} id={device._id} name={device.name} ip4={device.ip4} ip6={device.ip6} />)}
            </Stack>
        )
    }
}

export default AirContainer;
