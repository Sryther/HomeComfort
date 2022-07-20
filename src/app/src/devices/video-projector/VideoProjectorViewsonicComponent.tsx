import React from "react";
import _ from "lodash";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress, Tooltip, Icon
} from "@mui/material";
import {Lightbulb, MoreVert, PowerSettingsNew} from "@mui/icons-material";
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
        let powerButton = <CircularProgress size={16} color="inherit" />;
        let endpointState = <CircularProgress size={16} color="inherit" />;
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
                endpointState = (
                    <Tooltip title="Allumé">
                        <Icon>
                            <Lightbulb sx={{color: "orange" }} />
                        </Icon>
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
                endpointState = (
                    <Tooltip title="Eteint">
                        <Icon>
                            <Lightbulb sx={{color: "grey" }} />
                        </Icon>
                    </Tooltip>
                );
            }

            if (this.state.isLoading) {
                powerButton = <CircularProgress size={16} color="inherit" />;
            }
        }

        return (
            <Card sx={{ display: 'flex', m: 0.5, 'minWidth': '30%', backgroundColor: bgColor }} className={this.renderError()}>
                {this.renderMenu()}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                <FcVideoProjector /> {this.props.name}
                            </Typography>
                            <Box sx={{ marginLeft: "auto" }}>
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
                            </Box>
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }}>
                            <Box sx={{ display: 'flex' }}>
                                {this.props.path}
                            </Box>
                            <Box sx={{ display: 'flex', m: 0.5, marginLeft: "auto" }}>
                                {endpointState}
                            </Box>
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        {powerButton}
                    </Box>
                </Box>
            </Card>
        )
    }
}

export default VideoProjectorViewsonicComponent;
