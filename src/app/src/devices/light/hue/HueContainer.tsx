import HueApiClient from "../../../api-client/clients/HueApiClient";
import AbstractContainer from "../../abstract-container/AbstractContainer";
import BridgeComponent from "./BridgeComponent";

class HueContainer extends AbstractContainer<any, any> {
    async getData() {
        return await HueApiClient.getInstance().allBridges();
    }

    renderDevice(device: any) {
        return <BridgeComponent key={device._id} id={device._id} name={device.name} />;
    }
}

export default HueContainer;
