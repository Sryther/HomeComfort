import React, {Component} from "react";
import AirContainer from "./air/AirContainer";
import CleaningContainer from "./cleaning/CleaningContainer";
import NetworkContainer from "./network/NetworkContainer";
import ProjectionScreenContainer from "./projection-screen/ProjectionScreenContainer";
import VideoProjectorContainer from "./video-projector/VideoProjectorContainer";
import SceneContainer from "./scene/SceneContainer";
import {Stack} from "@mui/material";
import HueContainer from "./light/hue/HueContainer";

interface IDevicesProps {}
interface IDevicesState {}

class Devices extends Component<IDevicesProps, IDevicesState> {
    render () {
        return (
            <Stack spacing={2} sx={{ display: 'flex' }}>
                <AirContainer key={"airContainer"} />
                <HueContainer key={"hueContainer"} />
                <Stack direction="row" key={"videoContainers"} sx={{ width: '100%', display: 'flex' }}>
                    <NetworkContainer key={"endpointContainer"} />
                    <ProjectionScreenContainer key={"projectionScreenContainer"} />
                    <VideoProjectorContainer key={"videoProjectorContainer"} />
                </Stack>
                <SceneContainer key={"scenesContainer"} />
                <CleaningContainer key={"cleanContainer"} />
            </Stack>
        );
    }
}

export default Devices;
