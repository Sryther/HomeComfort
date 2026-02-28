import SceneComponent from "./SceneComponent";
import SceneApiClient from "../../api-client/clients/SceneApiClient";
import AbstractContainer from "../../ui/abstract-container/AbstractContainer";

class ScenesContainer extends AbstractContainer<any, any> {
    getName(): string {
        return "ScenesContainer";
    }

    async getData() {
        return await SceneApiClient.getInstance().all();
    }

    renderDevice(device: any) {
        return <SceneComponent key={device._id} id={device._id} name={device.name} itemDefinitionName={"Editer la scène"} />;
    }
}

export default ScenesContainer;
