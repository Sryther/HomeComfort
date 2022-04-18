import React, {Component} from "react";
import AirContainer from "./air/AirContainer";
import CleanContainer from "./cleaning/CleanContainer";
import EndpointContainer from "./network/EndpointContainer";
import ProjectionScreenContainer from "./projection-screen/ProjectionScreenContainer";
import VideoProjectorContainer from "./video-projector/VideoProjectorContainer";
import SceneContainer from "./scene/SceneContainer";
import {Stack} from "@mui/material";

interface IDevicesProps {}
interface IDevicesState {}

class Devices extends Component<IDevicesProps, IDevicesState> {
    render () {
        return (
            <Stack spacing={2}>
                <AirContainer key={"airContainer"} />
                <CleanContainer key={"cleanContainer"} />
                <Stack direction="row" key={"videoContainers"}>
                    <EndpointContainer key={"endpointContainer"} />
                    <ProjectionScreenContainer key={"projectionScreenContainer"} />
                    <VideoProjectorContainer key={"videoProjectorContainer"} />
                </Stack>
                <SceneContainer key={"scenesContainer"} />
            </Stack>
        );
    }
}

export default Devices;
