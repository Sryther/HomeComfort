import {Component} from "react";
import {Stack} from "@mui/material";
import ProjectionScreenLumeneComponent from "./ProjectionScreenLumeneComponent";
import ProjectionScreenApiClient from "../../api-client/clients/ProjectionScreenApiClient";

interface IDevicesProps {}
interface IDevicesState {
    lumeneDevices: any[]
}

class ProjectionScreenContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        lumeneDevices: []
    }

    async componentDidMount() {
        try {
            const { data } = await ProjectionScreenApiClient.getInstance().allLumenes();
            this.setState({
                lumeneDevices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.lumeneDevices.map((device: any) => <ProjectionScreenLumeneComponent id={device._id} name={device.name} path={device.serialPortPath} key={device._id} />)}
            </Stack>
        )
    }
}

export default ProjectionScreenContainer;
