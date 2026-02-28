import CleaningRoborockComponent from "./CleaningRoborockComponent";
import CleanApiClient from "../../api-client/clients/CleanApiClient";
import AbstractContainer from "../../ui/abstract-container/AbstractContainer";

class CleaningsContainer extends AbstractContainer<any, any> {
    getName(): string {
        return "CleaningsContainer";
    }

    async getData() {
        return await CleanApiClient.getInstance().allRoborocks();
    }

    renderDevice(device: any) {
        return <CleaningRoborockComponent key={device._id} id={device._id} name={device.name} ip={device.ip} />;
    }
}

export default CleaningsContainer;
