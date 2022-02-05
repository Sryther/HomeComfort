import {Component} from "react";
import getClient from "../../api-client";
import {
    Card,
    Box,
    IconButton, Tooltip, Typography, CardContent,
} from "@mui/material";
import {ArrowCircleDown, ArrowCircleUp} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {GoScreenFull} from "react-icons/all";

interface IProjectionScreenComponentProps {
    id: string,
    name: string
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
            await getClient().post(`/projection-screen/lumene/${this.props.id}/up`);
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
            <Card sx={{ display: 'flex', m: 0.5, 'min-width': '30%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                <GoScreenFull /> {this.props.name}
                            </Typography>
                        </Box>
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
