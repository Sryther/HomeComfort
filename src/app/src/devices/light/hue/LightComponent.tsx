import React from "react";
import HueApiClient from "../../../api-client/clients/HueApiClient";
import './ColorPalette.css';
import { HslColorPicker, HslColor } from "react-colorful";
import {
    Box,
    Card,
    CardActions, CardContent,
    CardHeader,
    IconButton,
    Modal,
    Skeleton,
    Slider,
    Stack,
    Tooltip
} from "@mui/material";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../../abstract-device/AbstractDevice";
import _ from "lodash";
import {ColorLens, Light, LightMode, MoreVert, Nightlight} from "@mui/icons-material";

interface LightComponentProps extends IAbstractDeviceProps {
    idBridge: string,
    id: string,
    name: string,
    productname: string
}

interface LightComponentState extends IAbstractDeviceState {
    lightState?: any,
    brightness: number,
    power: string,
    color: {
        hue: number,
        saturation: number,
        brightness: number
    },
    isPaletteOpen: boolean
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
                lightState: data,
                power: data.on ? "on" : "off",
                brightness: data.bri,
                color: {
                    hue: 0,
                    saturation: 0,
                    brightness: 0
                }
            });
        } catch (e: any) {
            return Promise.reject(e);
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    async setLightIntensity(event: Event, newValue: number | number[]) {
        try {
            const brightness: number = _.isArray(newValue) ? newValue[0] : newValue;
            const power = brightness > 0 ? "on" : "off";

            await HueApiClient.getInstance().setStateLight(this.props.idBridge, this.props.id, { power: power, brightness: brightness === 0 ? 1 : brightness });

            this.setState({
                brightness: brightness,
                power: power
            });
        } catch(error) {
            console.error(error);
        }
    }

    async setLightColor(newColor: HslColor): Promise<any> {
        try {
            console.log(newColor)
            const color = {
                hue: Math.max(newColor.h, 0),
                saturation: Math.max(newColor.s, 0),
                brightness: Math.max(newColor.l, 0)
            };

            this.setState({
                color
            });

            await HueApiClient.getInstance().setStateLight(this.props.idBridge, this.props.id, { color });
        } catch(error) {
            console.error(error);
        }
    }

    renderPaletteModal() {
        if (!_.isNil(this.state.lightState)) {
            return (
                <Modal
                    open={!_.isNil(this.state.isPaletteOpen) ? this.state.isPaletteOpen : false}
                    onClose={() => {
                        this.setState({ isPaletteOpen: false})
                    }}
                >
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '5px',
                        p: 4,
                    }}>
                        <section className="custom-pointers">
                            <HslColorPicker
                                color={{ h: this.state.color.hue, s: this.state.color.saturation, l: this.state.color.brightness }}
                                onChange={this.setLightColor.bind(this)}
                            />
                        </section>
                    </Box>
                </Modal>
            );
        }
    }

    render() {
        let stateCommands = (
            <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />
        );
        let bgColor = "white";

        if (!_.isNil(this.state) && !_.isNil(this.state.lightState)) {
            stateCommands = (
                <Stack spacing={2} margin={2} direction="row" sx={{ mb: 1, width: '100%' }} alignItems="center">
                    <Nightlight />
                    <Slider
                        aria-label="intensity"
                        defaultValue={this.state.brightness}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        onChange={_.debounce(this.setLightIntensity.bind(this), 500)}
                    />
                    <LightMode />
                    <Tooltip title={"Définir une couleur"}>
                        <IconButton
                            size="small"
                            id={"hue-light-component-palette-" + this.props.id}
                            onClick={(event) => { this.setState({isPaletteOpen: true }) }}
                        >
                            <ColorLens />
                        </IconButton>
                    </Tooltip>
                </Stack>
            );
            if (this.state.power === 'on') {
                bgColor = "#49fdba";
            } else {
                bgColor = "white";
            }
        }

        return (
            <Card sx={{ m: 0.5, 'minWidth': '30%', backgroundColor: bgColor }}>
                {this.renderMenu()}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                {this.renderPaletteModal()}
                <CardHeader
                    sx={{width: '100%'}}
                    avatar={
                        <Light />
                    }
                    title={this.props.name}
                    subheader={ this.props.productname }
                    action={
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
                    }
                />
                <CardContent>
                    {this.renderError()}
                </CardContent>
                <CardActions sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, width: '100%' }}>
                        {stateCommands}
                    </Box>
                </CardActions>
            </Card>
        )
    }
}

export default LightComponent;
