import VideoProjectorViewsonicComponent from "./VideoProjectorViewsonicComponent";
import VideoProjectorApiClient from "../../api-client/clients/VideoProjectorApiClient";
import AbstractContainer from "../../ui/abstract-container/AbstractContainer";

class VideoProjectorsContainer extends AbstractContainer<any, any> {
    getName(): string {
        return "VideoProjectorsContainer";
    }

    async getData() {
        return await VideoProjectorApiClient.getInstance().allViewsonics();
    }

    renderDevice(device: any) {
        return <VideoProjectorViewsonicComponent key={device._id} id={device._id} name={device.name} path={device.serialPortPath} />;
    }
}

export default VideoProjectorsContainer;
