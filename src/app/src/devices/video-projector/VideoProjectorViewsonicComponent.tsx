import React from "react";
import _ from "lodash";
import {
    Card,
    IconButton,
    Tooltip,
    CardActions,
    CardHeader,
    Skeleton, CardContent
} from "@mui/material";
import {MoreVert, PowerSettingsNew} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {FcVideoProjector} from "react-icons/fc";
import VideoProjectorApiClient from "../../api-client/clients/VideoProjectorApiClient";

interface IVideoProjectorViewsonicComponentProps extends IAbstractDeviceProps {
    id: string,
    name: string,
    path: string
}

interface IVideoProjectorViewsonicComponentState extends IAbstractDeviceState {
    power: boolean
}

class VideoProjectorViewsonicComponent extends AbstractDevice<IVideoProjectorViewsonicComponentProps, IVideoProjectorViewsonicComponentState> {
    async getDeviceInformation(): Promise<any> {
        try {
            return await VideoProjectorApiClient.getInstance().getViewsonic(this.props.id);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await VideoProjectorApiClient.getInstance().updateViewsonic(this.props.id, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        try {
            if (this.state.hasRaisenANetworkError || this.state.isRefreshDataRunning) return Promise.resolve();

            const { data } = await VideoProjectorApiClient.getInstance().getViewsonicState(this.props.id);
            this.setState({
                power: data === "ON"
            });
        } catch (e: any) {
            this.setState({
                power: false
            });
            return Promise.reject(e);
        }
    }

    async powerOn() {
        try {
            this.setState({
                isLoading: true
            });
            await VideoProjectorApiClient.getInstance().powerOnViewsonic(this.props.id);
        } catch(error) {
            console.error(error);
        }

        this.setState({
            isLoading: false
        });
    }

    async powerOff() {
        try {
            this.setState({
                isLoading: true
            });
            await VideoProjectorApiClient.getInstance().powerOffViewsonic(this.props.id);
        } catch(error) {
            console.error(error);
        }

        this.setState({
            isLoading: false
        });
    }

    render() {
        let powerButton = <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />;
        let bgColor = "white";

        if (!_.isNil(this.state)) {
            if (this.state.power) {
                bgColor = "#49fdba";
                powerButton = (
                    <Tooltip title="Eteindre">
                        <IconButton size="small" color="primary" onClick={() => { this.powerOff.bind(this)() }}>
                            <PowerSettingsNew sx={{ color: 'red' }} />
                        </IconButton>
                    </Tooltip>
                );
            } else {
                bgColor = "white";
                powerButton = (
                    <Tooltip title="Allumer">
                        <IconButton size="small" color="primary" onClick={() => { this.powerOn.bind(this)() }}>
                            <PowerSettingsNew />
                        </IconButton>
                    </Tooltip>
                );
            }

            if (this.state.isLoading) {
                powerButton = <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />;
            }
        }

        return (
            <Card sx={{ m: 0.5, 'minWidth': '30%', backgroundColor: bgColor }}>
                {this.renderMenu()}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                <CardHeader
                    avatar={<FcVideoProjector />}
                    title={this.props.name}
                    subheader={this.props.path}
                    action={
                        <IconButton
                            size="small"
                            id={"video-projector-component-" + this.props.id}
                            onClick={(event) => { this.openMenu.bind(this)(event) }}
                            aria-controls={!_.isNil(this.state) && this.state.isMenuOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={!_.isNil(this.state) && this.state.isMenuOpen ? 'true' : undefined}
                        >
                            <MoreVert />
                        </IconButton>
                    }
                />
                <CardContent>
                    {this.renderError()}
                </CardContent>
                <CardActions sx={{width: '100%'}}>
                    {powerButton}
                </CardActions>
            </Card>
        )
    }
}

export default VideoProjectorViewsonicComponent;
