import React, {Component} from "react";
import {Stack} from "@mui/material";
import HueApiClient from "../../../api-client/clients/HueApiClient";
import BridgeComponent from "./BridgeComponent";

interface IDevicesProps {}
interface IDevicesState {
    hueBridges: any[]
}

class HueContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        hueBridges: []
    }

    async componentDidMount() {
        try {
            const { data } = await HueApiClient.getInstance().allBridges();
            this.setState({
                hueBridges: data
            });
        } catch(error) {
            console.error(`Couldn't get bridges`, error);
        }
    }

    render() {
        return (
            <Stack direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.hueBridges.map((device: any) => <BridgeComponent key={device._id} id={device._id} name={device.name} />)}
            </Stack>
        )
    }
}

export default HueContainer;
