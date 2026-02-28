import ProjectionScreenLumeneComponent from "./ProjectionScreenLumeneComponent";
import ProjectionScreenApiClient from "../../api-client/clients/ProjectionScreenApiClient";
import AbstractContainer from "../../ui/abstract-container/AbstractContainer";

class ProjectionScreensContainer extends AbstractContainer<any, any> {
    getName(): string {
        return "ProjectionScreensContainer";
    }

    async getData() {
        return await ProjectionScreenApiClient.getInstance().allLumenes();
    }

    renderDevice(device: any) {
        return <ProjectionScreenLumeneComponent id={device._id} name={device.name} path={device.serialPortPath} key={device._id} />;
    }
}

export default ProjectionScreensContainer;
