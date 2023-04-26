import AirDaikinComponent from "./AirDaikinComponent";
import AirApiClient from "../../api-client/clients/AirApiClient";
import AbstractContainer from "../abstract-container/AbstractContainer";

class AirContainer extends AbstractContainer<any, any> {
    async getData() {
        return await AirApiClient.getInstance().allDaikins();
    }

    renderDevice(device: any) {
        return <AirDaikinComponent key={device._id} id={device._id} name={device.name} ip4={device.ip4} ip6={device.ip6} />;
    }
}

export default AirContainer;
