import {Component} from "react";
import CleaningRoborockComponent from "./CleaningRoborockComponent";
import {Stack} from "@mui/material";
import CleanApiClient from "../../api-client/clients/CleanApiClient";

interface IDevicesProps {}
interface IDevicesState {
    roborockDevices: any[]
}

class CleaningContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        roborockDevices: []
    }

    async componentDidMount() {
        try {
            const { data } = await CleanApiClient.getInstance().allRoborocks();
            this.setState({
                roborockDevices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row">
                {this.state.roborockDevices.map((device: any) => <CleaningRoborockComponent key={device._id} id={device._id} name={device.name} ip={device.ip} />)}
            </Stack>
        )
    }
}

export default CleaningContainer;
