import {Component} from "react";
import NetworkEndpointComponent from "./NetworkEndpointComponent";
import {Stack} from "@mui/material";
import NetworkApiClient from "../../api-client/clients/NetworkApiClient";

interface IDevicesProps {}
interface IDevicesState {
    endpointDevices: any[]
}

class NetworkContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        endpointDevices: []
    }

    async componentDidMount() {
        try {
            const { data } = await NetworkApiClient.getInstance().allEndpoints();
            this.setState({
                endpointDevices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.endpointDevices.map((device: any) => <NetworkEndpointComponent key={device._id} id={device._id} name={device.name} ip={device.ip6 || device.ip4} />)}
            </Stack>
        )
    }
}

export default NetworkContainer;
