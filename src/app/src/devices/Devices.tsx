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
                <AirContainer key={"airContainer"} />
                <CleanContainer key={"cleanContainer"} />
                <EndpointContainer key={"endpointContainer"} />
                <ProjectionScreenContainer key={"projectionScreenContainer"} />
                <VideoProjectorContainer key={"videoProjectorContainer"} />
            </div>
        );
    }
}

export default Devices;
