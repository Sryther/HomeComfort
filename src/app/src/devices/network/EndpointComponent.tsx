import React from "react";
import _ from "lodash";
import getClient from "../../api-client";
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
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {FaNetworkWired} from "react-icons/all";

interface IEndpointComponentProps {
    id: string,
    name: string,
    ip: string
}

interface IEndpointComponentState extends IAbstractDeviceState {
    alive: boolean
}

class EndpointComponent extends AbstractDevice<IEndpointComponentProps, IEndpointComponentState> {
    async getDeviceInformation(): Promise<any> {
        try {
            return await getClient().get(`/network/endpoints/${this.props.id}`);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await getClient().put(`/network/endpoints/${this.props.id}`, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        try {
            if (this.isRefreshDataRunning) return Promise.resolve();
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`/network/endpoints/${this.props.id}/alive`);
            this.isRefreshDataRunning = false;
            this.setState({
                alive: data
            });
        } catch (e: any) {
            console.error(e)
        }
    }

    async powerOn() {
        try {
            this.setState({
                isLoading: true
            });
            // Try 3 times.
            await getClient().post(`network/endpoints/${this.props.id}/wake`);
            await getClient().post(`network/endpoints/${this.props.id}/wake`);
            await getClient().post(`network/endpoints/${this.props.id}/wake`);

            await this.refreshData();

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
            <Card sx={{ display: 'flex', m: 0.5, 'minWidth': '30%', backgroundColor: bgColor }}>
                {this.renderMenu()}
                {this.renderInformationModal()}
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

export default EndpointComponent;
