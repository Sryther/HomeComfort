import {Component} from "react";
import getClient from "../../api-client";
import {Box, Stack} from "@mui/material";
import ProjectionScreenComponent from "./ProjectionScreenComponent";

interface IDevicesProps {}
interface IDevicesState {
    devices: any[]
}

class ProjectionScreenContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        devices: []
    }

    async componentDidMount() {
        try {
            const { data } = await getClient().get("/projection-screen/lumene");
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
                {this.state.devices.map((device: any) => <ProjectionScreenComponent id={device._id} name={device.name} path={device.serialPortPath} key={device._id} />)}
            </Stack>
        )
    }
}

export default ProjectionScreenContainer;
