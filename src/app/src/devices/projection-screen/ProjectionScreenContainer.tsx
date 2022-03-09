import {Component} from "react";
import getClient from "../../api-client";
import {Box} from "@mui/material";
import ProjectionScreenComponent from "./ProjectionScreenComponent";

interface IDevicesProps {}
interface IDevicesState {
    devices: any[]
}

class ProjectionScreenContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        devices: []
    }

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        try {
            const { data } = await getClient().get("projection-screen/lumene");
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
                {this.state.devices.map((device: any) => <ProjectionScreenComponent id={device._id} name={device.name} path={device.serialPortPath} key={device._id} />)}
            </Box>
        )
    }
}

export default ProjectionScreenContainer;
