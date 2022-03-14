import {Component} from "react";
import getClient from "../../api-client";
import EndpointComponent from "./EndpointComponent";
import {Box, Stack} from "@mui/material";

interface IDevicesProps {}
interface IDevicesState {
    devices: any[]
}

class EndpointContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        devices: []
    }

    async componentDidMount() {
        try {
            const { data } = await getClient().get("/network/endpoints");
            this.setState({
                devices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row">
                {this.state.devices.map((device: any) => <EndpointComponent key={device._id} id={device._id} name={device.name} ip={device.ip6 || device.ip4} />)}
            </Stack>
        )
    }
}

export default EndpointContainer;
