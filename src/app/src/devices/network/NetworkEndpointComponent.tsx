import React from "react";
import _ from "lodash";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Icon, CircularProgress
} from "@mui/material";
import {Lightbulb, MoreVert, PowerSettingsNew} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {FaNetworkWired} from "react-icons/fa";
import NetworkApiClient from "../../api-client/clients/NetworkApiClient";

interface INetworkEndpointComponentProps extends IAbstractDeviceProps {
    id: string,
    name: string,
    ip: string
}

interface INetworkEndpointComponentState extends IAbstractDeviceState {
    alive: boolean
}

class NetworkEndpointComponent extends AbstractDevice<INetworkEndpointComponentProps, INetworkEndpointComponentState> {
    async getDeviceInformation(): Promise<any> {
        try {
            return await NetworkApiClient.getInstance().getEndpoint(this.props.id);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await NetworkApiClient.getInstance().updateEndpoint(this.props.id, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        try {
            if (this.state.hasRaisenANetworkError || this.state.isRefreshDataRunning) return Promise.resolve();
            const { data } = await NetworkApiClient.getInstance().isEndpointAlive(this.props.id);
            this.setState({
                alive: data
            });
        } catch (e: any) {
            return Promise.reject(e);
        }
    }

    async powerOn() {
        try {
            this.setState({
                isLoading: true
            });
            // Try 3 times.
            await NetworkApiClient.getInstance().wakeEndpoint(this.props.id);
            await NetworkApiClient.getInstance().wakeEndpoint(this.props.id);
            await NetworkApiClient.getInstance().wakeEndpoint(this.props.id);

            setTimeout(() => {
                this.setState({
                    isLoading: false
                });
            }, 2000);
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
            if (this.state.alive) {
                bgColor = "#49fdba";
                powerButton = (
                    <Tooltip title="Allumé">
                        <PowerSettingsNew sx={{ color: 'green' }}/>
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
                                <FaNetworkWired /> {this.props.name}
                            </Typography>
                            <Box sx={{ marginLeft: "auto" }}>
                                <IconButton
                                    size="small"
                                    id={"endpoint-component-" + this.props.id}
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
                                {this.props.ip}
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

export default NetworkEndpointComponent;
