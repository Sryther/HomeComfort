import React, {Component} from "react";
import AirContainer from "../devices/air/AirContainer";
import CleaningContainer from "../devices/cleaning/CleaningContainer";
import NetworkContainer from "../devices/network/NetworkContainer";
import ProjectionScreenContainer from "../devices/projection-screen/ProjectionScreenContainer";
import VideoProjectorContainer from "../devices/video-projector/VideoProjectorContainer";
import RoutinesContainer from "../routines/RoutinesContainer";
import {Box, Divider, Stack, Typography} from "@mui/material";
import HueContainer from "../devices/light/hue/HueContainer";

interface IDevicesProps {}
interface IDevicesState {}

class Devices extends Component<IDevicesProps, IDevicesState> {
    render () {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Equipements
                </Typography>
                <Stack spacing={2} sx={{ display: 'flex' }}>
                    <AirContainer key={"airContainer"} />
                    <HueContainer key={"hueContainer"} />
                    <Stack direction="row" key={"videoContainers"} sx={{ width: '100%', display: 'flex' }}>
                        <NetworkContainer key={"endpointContainer"} />
                        <ProjectionScreenContainer key={"projectionScreenContainer"} />
                        <VideoProjectorContainer key={"videoProjectorContainer"} />
                    </Stack>
                    <CleaningContainer key={"cleanContainer"} />
                    <Divider />
                    <RoutinesContainer />
                </Stack>
            </Box>
        );
    }
}

export default Devices;
