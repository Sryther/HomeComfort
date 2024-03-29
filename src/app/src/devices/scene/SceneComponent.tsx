import React from "react";
import _ from "lodash";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    ListItem,
    ListItemText,
    List,
    CardHeader,
    CardActions,
    Skeleton
} from "@mui/material";
import "./Scene.css";
import {PlaylistPlay, MoreVert, PlayArrow} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceState, IAbstractDeviceProps} from "../abstract-device/AbstractDevice";
import SceneApiClient from "../../api-client/clients/SceneApiClient";
import ApiClient from "../../api-client";

interface ISceneComponentProps extends IAbstractDeviceProps {
    id: string,
    name: string
}

interface ISceneComponentState extends IAbstractDeviceState {
    actions: any[],
}

class SceneComponent extends AbstractDevice<ISceneComponentProps, ISceneComponentState> {

    async refreshData() {
        const result = await this.getDeviceInformation();
        if (!_.isNil(result)) {
            const actions = await Promise.all(result.data.actions
                .sort((a: any, b: any) => {
                    return a.order - b.order;
                })
                .map(async (action: any) => {
                    let route = "";
                    let deviceType = "";
                    switch (action.deviceType) {
                        case "VideoProjectorViewsonic":
                            route = "/video-projector/viewsonic";
                            deviceType = "Projecteur";
                            break;
                        case "NetworkEndpoint":
                            route = "/network/endpoints";
                            deviceType = "Ordinateur";
                            break;
                        case "ProjectionScreenLumene":
                            route = "/projection-screen/lumene";
                            deviceType = "Ecran";
                            break;
                        default:
                            return {
                                name: action.deviceId,
                                deviceType: action.deviceType,
                                deviceId: action.deviceId,
                                description: action.description
                            };
                    }

                    const queryDevice = await ApiClient.getInstance().get(`${route}/${action.deviceId}`);
                    return {
                        name: queryDevice.data.name ? queryDevice.data.name : action.deviceId,
                        deviceType: deviceType,
                        description: action.description,
                        deviceId: action.deviceId
                    };
                }));
            this.setState({
                actions: actions
            });
        }
    }

    async getDeviceInformation() {
        try {
            return await SceneApiClient.getInstance().get(this.props.id);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any) {
        try {
            return await SceneApiClient.getInstance().update(this.props.id, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async run() {
        try {
            this.setState({
                isLoading: true
            });

            await SceneApiClient.getInstance().run(`/${this.props.id}`);

            this.setState({
                isLoading: false
            });
        } catch(error) {
            console.error(error);
            this.setState({
                isLoading: false
            });
        }
    }

    render() {
        let listActions = <Box />;
        if (!_.isNil(this.state) && !_.isNil(this.state.actions)) {
            let i = 0;
            listActions = this.state.actions.map((action: any) => {
                i++;
                return (
                    <ListItem key={`${this.props.id}-${action.deviceId}-${i}`}>
                        <ListItemText
                            primary={action.description}
                            secondary={action.deviceType + " - " + action.name}
                        />
                    </ListItem>
                );
            });
        }

        return (
            <Card sx={{ m: 0.5, 'minWidth': '30%' }}>
                {this.renderMenu()}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                <CardHeader
                    avatar={<PlaylistPlay />}
                    title={this.props.name}
                    action={
                        <IconButton
                            size="small"
                            id={"scene-component-" + this.props.id}
                            onClick={(event) => { this.openMenu.bind(this)(event) }}
                            aria-controls={!_.isNil(this.state) && this.state.isMenuOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={!_.isNil(this.state) && this.state.isMenuOpen ? 'true' : undefined}
                        >
                            <MoreVert />
                        </IconButton>
                    }
                />
                <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                    {this.renderError()}
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        <List dense={true}>
                            {listActions}
                        </List>
                    </Typography>
                </CardContent>
                <CardActions sx={{ width: '100%' }}>
                    {!_.isNil(this.state) && !this.state.isLoading ?
                        <Tooltip title="Lancer">
                            <IconButton size="small" color="primary" onClick={async () => {
                                await this.run.bind(this)()
                            }}>
                                <PlayArrow />
                            </IconButton>
                        </Tooltip>
                    :
                        <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />
                    }
                </CardActions>
            </Card>
        )
    }
}

export default SceneComponent;
