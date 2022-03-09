import React, {Component} from "react";
import _ from "lodash";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress, Tooltip, Icon
} from "@mui/material";
import {Lightbulb, MoreVert, PowerSettingsNew} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {FcVideoProjector} from "react-icons/all";

interface IEndpointComponentProps {
    id: string,
    name: string,
    path: string
}

interface IEndpointComponentState extends IAbstractDeviceState {
    power: boolean
}

class VideoProjectorComponent extends AbstractDevice<IEndpointComponentProps, IEndpointComponentState> {
    constructor(props: any) {
        super(props);
    }


    async refreshData() {
        try {
            if (this.isRefreshDataRunning) return Promise.resolve();
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`/video-projector/viewsonic/${this.props.id}/state`);
            console.log(data)
            this.isRefreshDataRunning = false;
            this.setState({
                power: data === "ON"
            });
        } catch (e: any) {
            // TODO
        }
    }

    async powerOn() {
        try {
            this.setState({
                isLoading: true
            });
            await getClient().post(`/video-projector/viewsonic/${this.props.id}/power-on`);
            await this.refreshData();
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

    async powerOff() {
        try {
            this.setState({
                isLoading: true
            });
            await getClient().post(`/video-projector/viewsonic/${this.props.id}/power-off`);
            await this.refreshData();
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
        let powerButton = <CircularProgress size={16} color="inherit" />;
        let endpointState = <CircularProgress size={16} color="inherit" />;
        let bgColor = "white";

        if (!_.isNil(this.state)) {
            if (this.state.power) {
                bgColor = "#49fdba";
                powerButton = (
                    <Tooltip title="Allumer">
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
            <Card sx={{ display: 'flex', m: 0.5, 'minWidth': '30%', backgroundColor: bgColor }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                <FcVideoProjector /> {this.props.name}
                            </Typography>
                            <Box sx={{ marginLeft: "auto" }}>
                                <IconButton
                                    size="small"
                                    id={"endpoint-component-" + this.props.id}
                                    onClick={() => { this.openMenu.bind(this) }}
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

export default VideoProjectorComponent;
