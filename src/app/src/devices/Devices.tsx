import React, {Component} from "react";
import AirContainer from "./air/AirContainer";
import CleanContainer from "./cleaning/CleanContainer";
import EndpointContainer from "./network/EndpointContainer";
import ProjectionScreenContainer from "./projection-screen/ProjectionScreenContainer";
import VideoProjectorContainer from "./video-projector/VideoProjectorContainer";

interface IDevicesProps {}
interface IDevicesState {}

class Devices extends Component<IDevicesProps, IDevicesState> {
    constructor(props: any) {
        super(props);
    }

    render () {
        return (
            <div>
                <h3>Air</h3>
                <AirContainer />
                <h3>Chauffage</h3>
                <h3>Nettoyage</h3>
                <CleanContainer />
                <h3>Lumière</h3>
                <h3>Réseau</h3>
                <EndpointContainer />
                <h3>Ecran de projection</h3>
                <ProjectionScreenContainer />
                <h3>Vidéo projecteur</h3>
                <VideoProjectorContainer />
            </div>
        );
    }
}

export default Devices;
