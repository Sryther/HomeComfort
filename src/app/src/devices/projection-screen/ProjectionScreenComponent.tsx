import React, {Component} from "react";
import getClient from "../../api-client";
import {
    Card,
    Box,
    IconButton, Tooltip, Typography, CardContent,
} from "@mui/material";
import {ArrowCircleDown, ArrowCircleUp, MoreVert} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {GoScreenFull} from "react-icons/all";
import _ from "lodash";

interface IProjectionScreenComponentProps {
    id: string,
    name: string,
    path: string
}

interface IProjectionScreenState extends IAbstractDeviceState {}

class ProjectionScreenComponent extends AbstractDevice<IProjectionScreenComponentProps, IProjectionScreenState> {
    constructor(props: any) {
        super(props);
    }

    async refreshData() {
        return Promise.resolve();
    }

    async up() {
        try {
            this.setState({
                isLoading: true
            });
            await getClient().post(`/projection-screen/lumene/${this.props.id}/up`);
            this.setState({
                isLoading: false
            });
        } catch(error) {
            console.error(error);
        }
    }

    async down() {
        try {
            await getClient().post(`/projection-screen/lumene/${this.props.id}/down`);
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Card sx={{ display: 'flex', m: 0.5, 'minWidth': '30%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                <GoScreenFull /> {this.props.name}
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
                        </Typography>
                    </CardContent>
                    <Box>
                        <Tooltip title="Descendre">
                            <IconButton color="primary" aria-label="down" onClick={() => { this.down.bind(this)() }}>
                                <ArrowCircleDown />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Monter">
                            <IconButton color="primary" aria-label="up" onClick={() => { this.up.bind(this)() }}>
                                <ArrowCircleUp />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Card>
        )
    }
}

export default ProjectionScreenComponent;
