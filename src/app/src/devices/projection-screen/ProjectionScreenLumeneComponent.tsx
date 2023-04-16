import React from "react";
import {
    Card,
    IconButton,
    Tooltip,
    CardActions,
    CardHeader, Box, CardContent
} from "@mui/material";
import {ArrowCircleDown, ArrowCircleUp, MoreVert} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {GoScreenFull} from "react-icons/go";
import _ from "lodash";
import ProjectionScreenApiClient from "../../api-client/clients/ProjectionScreenApiClient";

interface IProjectionScreenLumeneComponentProps extends IAbstractDeviceProps {
    id: string,
    name: string,
    path: string
}

interface IProjectionScreenLumeneState extends IAbstractDeviceState {}

class ProjectionScreenLumeneComponent extends AbstractDevice<IProjectionScreenLumeneComponentProps, IProjectionScreenLumeneState> {
    async getDeviceInformation(): Promise<any> {
        try {
            return await ProjectionScreenApiClient.getInstance().getLumene(this.props.id);
        } catch (error: any) {
            this.setState({
                hasRisenAnError: true
            });

            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await ProjectionScreenApiClient.getInstance().updateLumene(this.props.id, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        return Promise.resolve();
    }

    async up() {
        try {
            this.setState({
                isLoading: true
            });
            await ProjectionScreenApiClient.getInstance().upLumene(this.props.id);
            this.setState({
                isLoading: false
            });
        } catch(error) {
            this.setState({
                hasRisenAnError: true
            });
            console.error(error);
        }
    }

    async down() {
        try {
            await ProjectionScreenApiClient.getInstance().downLumene(this.props.id);
        } catch(error) {
            this.setState({
                hasRisenAnError: true
            });
            console.error(error);
        }
    }

    render() {
        return (
            <Card sx={{ m: 0.5, 'minWidth': '30%' }}>
                {this.renderMenu()}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                <CardHeader
                    avatar={<GoScreenFull />}
                    title={this.props.name}
                    subheader={this.props.path}
                    action={
                        <IconButton
                            size="small"
                            id={"projection-screen-component-" + this.props.id}
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
                <CardActions sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                </CardActions>
            </Card>
        )
    }
}

export default ProjectionScreenLumeneComponent;
