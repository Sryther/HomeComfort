import React from "react";
import HueApiClient from "../../../api-client/clients/HueApiClient";
import {Box, Card, CardContent, CircularProgress, Icon, IconButton, Tooltip, Typography} from "@mui/material";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../../abstract-device/AbstractDevice";
import _ from "lodash";
import {Lightbulb, MoreVert, PowerSettingsNew} from "@mui/icons-material";
import {FaRegLightbulb} from "react-icons/fa";

interface LightComponentProps extends IAbstractDeviceProps {
    idBridge: string,
    id: string,
    name: string
}

interface LightComponentState extends IAbstractDeviceState {
    lightState?: any
}

class LightComponent extends AbstractDevice<LightComponentProps, LightComponentState> {
    async getDeviceInformation(): Promise<any> {
        try {
            return await HueApiClient.getInstance().getLight(this.props.idBridge, this.props.id);
        } catch (error: any) {
            this.setState({
                hasRisenAnError: true
            });

            console.error(error);
            return null;
        }
    }

    async refreshData(): Promise<any> {
        try {
            if (this.state.hasRaisenANetworkError || this.state.isRefreshDataRunning) return Promise.resolve();
            const { data } = await HueApiClient.getInstance().getLightState(this.props.idBridge, this.props.id);
            this.setState({
                lightState: data
            });
        } catch (e: any) {
            return Promise.reject(e);
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    async powerOn() {
        try {
            this.setState({
                isLoading: true
            });
            await HueApiClient.getInstance().setStateLight(this.props.idBridge, this.props.id, { state: "on" });
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
            await HueApiClient.getInstance().setStateLight(this.props.idBridge, this.props.id, { state: "off" });
        } catch(error) {
            console.error(error);
        }

        this.setState({
            isLoading: false
        });
    }

    render() {
        let powerButton = <CircularProgress size={16} color="inherit" />;
        let lightState = <CircularProgress size={16} color="inherit" />;
        let bgColor = "white";

        if (!_.isNil(this.state) && !_.isNil(this.state.lightState)) {
            console.log(this.state)
            if (this.state.lightState.state.on) {
                bgColor = "#49fdba";
                powerButton = (
                    <Tooltip title="Eteindre">
                        <IconButton size="small" color="primary" onClick={() => { this.powerOff.bind(this)() }}>
                            <PowerSettingsNew sx={{ color: 'red' }} />
                        </IconButton>
                    </Tooltip>
                );
                lightState = (
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
                lightState = (
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
                                <FaRegLightbulb /> {this.props.name}
                            </Typography>
                            <Box sx={{ marginLeft: "auto" }}>
                                <IconButton
                                    size="small"
                                    id={"hue-light-component-" + this.props.id}
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
                                { !_.isNil(this.state) && !_.isNil(this.state.lightState) ? this.state.lightState.productname : "" }
                            </Box>
                            <Box sx={{ display: 'flex', m: 0.5, marginLeft: "auto" }}>
                                {lightState}
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

export default LightComponent;
