import {Component} from "react";
import getClient from "../../api-client";
import SceneComponent from "./SceneComponent";
import {Box, Stack} from "@mui/material";

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
            const { data } = await getClient().get("/scene");
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
                {this.state.scenes.map((scene: any) => <SceneComponent id={scene._id} name={scene.name} key={scene._id} />)}
            </Stack>
        )
    }
}

export default CleanContainer;
