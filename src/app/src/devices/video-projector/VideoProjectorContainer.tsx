import {Component} from "react";
import getClient from "../../api-client";
import VideoProjectorComponent from "./VideoProjectorComponent";
import {Box} from "@mui/material";

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
            const { data } = await getClient().get("/video-projector/viewsonic");
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
                {this.state.devices.map((device: any) => <VideoProjectorComponent id={device._id} name={device.name} path={device.serialPortPath} key={device._id} />)}
            </Box>
        )
    }
}

export default CleanContainer;
