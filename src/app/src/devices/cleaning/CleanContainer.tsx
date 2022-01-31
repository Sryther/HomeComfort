import {Component} from "react";
import getClient from "../../api-client";
import RoborockComponent from "./RoborockComponent";
import {Box} from "@mui/material";

interface IDevicesProps {}
interface IDevicesState {
    devices: any[]
}

class CleanContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        devices: []
    }

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        try {
            const { data } = await getClient().get("cleaning/roborocks/devices");
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
                {this.state.devices.map((device: any) => <RoborockComponent id={device._id} name={device.name} ip={device.ip}  key={device._id} />)}
            </Box>
        )
    }
}

export default CleanContainer;
