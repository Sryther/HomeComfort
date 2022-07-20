import {Component} from "react";
import SceneComponent from "./SceneComponent";
import {Stack} from "@mui/material";
import SceneApiClient from "../../api-client/clients/SceneApiClient";

interface IDevicesProps {}
interface IDevicesState {
    scenes: any[]
}

class CleanContainer extends Component<IDevicesProps, IDevicesState> {
    state = {
        scenes: []
    }

    async componentDidMount() {
        try {
            const { data } = await SceneApiClient.getInstance().all();
            this.setState({
                scenes: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack direction="row">
                {this.state.scenes.map((scene: any) => <SceneComponent key={scene._id} id={scene._id} name={scene.name} itemDefinitionName={"Editer la scène"} />)}
            </Stack>
        )
    }
}

export default CleanContainer;
