import React, {Component} from "react";
import AirContainer from "./air/AirContainer";
import CleaningContainer from "./cleaning/CleaningContainer";
import NetworkContainer from "./network/NetworkContainer";
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
                <CleaningContainer key={"cleanContainer"} />
                <Stack direction="row" key={"videoContainers"}>
                    <NetworkContainer key={"endpointContainer"} />
                    <ProjectionScreenContainer key={"projectionScreenContainer"} />
                    <VideoProjectorContainer key={"videoProjectorContainer"} />
                </Stack>
                <SceneContainer key={"scenesContainer"} />
            </Stack>
        );
    }
}

export default Devices;
