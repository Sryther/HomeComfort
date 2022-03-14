import {Component} from "react";
import getClient from "../../api-client";
import RoborockComponent from "./RoborockComponent";
import {Box, Stack} from "@mui/material";

interface IDevicesProps {}
interface IDevicesState {
    devices: any[]
}

class CleanContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        devices: []
    }

    async componentDidMount() {
        try {
            const { data } = await getClient().get("/cleaning/roborocks/devices");
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
                {this.state.devices.map((device: any) => <RoborockComponent key={device._id} id={device._id} name={device.name} ip={device.ip} />)}
            </Stack>
        )
    }
}

export default CleanContainer;
