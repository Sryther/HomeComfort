import React, {Component} from "react";
import HueApiClient from "../../../api-client/clients/HueApiClient";
import {Stack} from "@mui/material";
import LightComponent from "./LightComponent";

interface IDevicesProps {
    id: string,
    name: string
}
interface IDevicesState {
    hueLights: any[]
}

class BridgeComponent extends Component<IDevicesProps, IDevicesState> {
    state = {
        hueLights: []
    }

    async componentDidMount() {
        try {
            const { data } = await HueApiClient.getInstance().allLights(this.props.id);
            this.setState({
                hueLights: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.hueLights.map((device: any) => <LightComponent key={device._id} id={device._id} idBridge={device.bridge} name={device.name} productname={device.productname} />)}
            </Stack>
        )
    }
}

export default BridgeComponent;
