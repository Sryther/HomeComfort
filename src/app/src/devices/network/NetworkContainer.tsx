import NetworkEndpointComponent from "./NetworkEndpointComponent";
import NetworkApiClient from "../../api-client/clients/NetworkApiClient";
import AbstractContainer from "../abstract-container/AbstractContainer";

class NetworkContainer extends AbstractContainer<any, any> {
    async getData() {
        return await NetworkApiClient.getInstance().allEndpoints();
    }

    renderDevice(device: any) {
        return <NetworkEndpointComponent key={device._id} id={device._id} name={device.name} ip={device.ip6 || device.ip4} />;
    }
}

export default NetworkContainer;
