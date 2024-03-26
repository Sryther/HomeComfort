import VideoProjectorViewsonicComponent from "./VideoProjectorViewsonicComponent";
import VideoProjectorApiClient from "../../api-client/clients/VideoProjectorApiClient";
import AbstractContainer from "../abstract-container/AbstractContainer";

class CleanContainer extends AbstractContainer<any, any> {
    async getData() {
        return await VideoProjectorApiClient.getInstance().allViewsonics();
    }

    renderDevice(device: any) {
        return <VideoProjectorViewsonicComponent key={device._id} id={device._id} name={device.name} path={device.serialPortPath} />;
    }
}

export default CleanContainer;
