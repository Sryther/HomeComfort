import {Component} from "react";
import VideoProjectorViewsonicComponent from "./VideoProjectorViewsonicComponent";
import {Stack} from "@mui/material";
import VideoProjectorApiClient from "../../api-client/clients/VideoProjectorApiClient";

interface IDevicesProps {}
interface IDevicesState {
    viewsonicDevices: any[]
}

class CleanContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        viewsonicDevices: []
    }

    async componentDidMount() {
        try {
            const { data } = await VideoProjectorApiClient.getInstance().allViewsonics();
            this.setState({
                viewsonicDevices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row">
                {this.state.viewsonicDevices.map((device: any) => <VideoProjectorViewsonicComponent key={device._id} id={device._id} name={device.name} path={device.serialPortPath} />)}
            </Stack>
        )
    }
}

export default CleanContainer;
