import React, {Component} from "react";
import AirsContainer from "../devices/air/AirsContainer";
import CleaningsContainer from "../devices/cleaning/CleaningsContainer";
import NetworksContainer from "../devices/network/NetworksContainer";
import ProjectionScreensContainer from "../devices/projection-screen/ProjectionScreensContainer";
import VideoProjectorContainer from "../devices/video-projector/VideoProjectorsContainer";
import {Divider, Stack} from "@mui/material";
import HuesContainer from "../devices/light/hue/HuesContainer";
import Page from "../ui/page/Page";
import ScenesContainer from "../routines/scene/ScenesContainer";

interface IDevicesProps {}
interface IDevicesState {}

class DevicesPage extends Component<IDevicesProps, IDevicesState> {
    render () {
        return (
            <Page
                title="Équipements"
                subtitle="Accès rapide à vos appareils et routines."
            >
                <Stack spacing={2} sx={{ display: 'flex' }}>
                    <AirsContainer key={"airContainer"} />
                    <HuesContainer key={"hueContainer"} />
                    <Stack direction="row" key={"videoContainers"} sx={{ width: '100%', display: 'flex' }}>
                        <NetworksContainer key={"endpointContainer"} />
                        <ProjectionScreensContainer key={"projectionScreenContainer"} />
                        <VideoProjectorContainer key={"videoProjectorContainer"} />
                    </Stack>
                    <CleaningsContainer key={"cleanContainer"} />
                    <Divider />
                    <ScenesContainer key={"scenesContainer"} />
                </Stack>
            </Page>
        );
    }
}

export default DevicesPage;
