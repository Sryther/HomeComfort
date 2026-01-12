import SceneComponent from "./SceneComponent";
import SceneApiClient from "../../api-client/clients/SceneApiClient";
import AbstractContainer from "../../ui/abstract-container/AbstractContainer";

class ScenesContainer extends AbstractContainer<any, any> {
    async getData() {
        return await SceneApiClient.getInstance().all();
    }

    renderDevice(scene: any) {
        return <SceneComponent key={scene._id} id={scene._id} name={scene.name} itemDefinitionName={"Editer la scène"} />;
    }
}

export default ScenesContainer;
