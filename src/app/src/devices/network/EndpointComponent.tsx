import React, {Component} from "react";
import _ from "lodash";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";
import {MoreVert, PowerSettingsNew} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {FaNetworkWired} from "react-icons/all";

interface IEndpointComponentProps {
    id: string,
    name: string
}

interface IEndpointComponentState extends IAbstractDeviceState {
    alive: boolean
}

class EndpointComponent extends AbstractDevice<IEndpointComponentProps, IEndpointComponentState> {
    constructor(props: any) {
        super(props);
    }

    async refreshData() {
        try {
            if (this.isRefreshDataRunning) return Promise.resolve();
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`/network/endpoints/${this.props.id}/alive`);
            this.isRefreshDataRunning = false;
            this.setState({
                alive: data.alive
            });
        } catch (e: any) {
            // TODO
        }
    }

    async powerOn() {
        try {
            await getClient().post(`network/endpoint/${this.props.id}/wake`);
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        let powerButton = <Box>
            <Tooltip title="Allumer">
                <IconButton size="small" color="primary" onClick={() => { this.powerOn.bind(this)() }}>
                    <PowerSettingsNew />
                </IconButton>
            </Tooltip>
        </Box>;

        if (!_.isNil(this.state)) {
            if (this.state.alive) {
                powerButton = <Tooltip title="Allumé">
                    <PowerSettingsNew sx={{ color: 'green' }}/>
                </Tooltip>;
            }
        }

        return (
            <Card sx={{ display: 'flex', m: 0.5, 'min-width': '30%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Typography component="div" variant="h5">
                            <FaNetworkWired /> {this.props.name}

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
