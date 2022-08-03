import React from "react";
import _ from "lodash";
import {
    Card,
    IconButton,
    Tooltip,
    CardHeader,
    CardActions,
    Skeleton, CardContent
} from "@mui/material";
import {MoreVert, PowerSettingsNew} from "@mui/icons-material";
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
        let powerButton = <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />;
        let bgColor = "white";

        if (!_.isNil(this.state)) {
            if (this.state.alive) {
                bgColor = "#49fdba";
                powerButton = (
                    <Tooltip title="Allumé">
                        <PowerSettingsNew sx={{ color: 'green' }}/>
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
                    avatar={<FaNetworkWired />}
                    title={this.props.name}
                    subheader={this.props.ip}
                    action={
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
                    }
                />
                <CardContent>
                    {this.renderError()}
                </CardContent>
                <CardActions sx={{ width: '100%', display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    {powerButton}
                </CardActions>
            </Card>
        )
    }
}

export default NetworkEndpointComponent;
