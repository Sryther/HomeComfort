import React from "react";
import _ from "lodash";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress, Tooltip, Switch, Menu, MenuItem
} from "@mui/material";
import {
    Thermostat,
    Home,
    Remove,
    Add,
    MoreVert,
    LocalFireDepartment,
    Air,
    AcUnit,
    Autorenew, Stream
} from "@mui/icons-material";
import { FaLeaf } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";

interface IAirComponentProps {
    id: string,
    name: string,
    ip4?: string,
    ip6?: string
}

interface IAirComponentState extends IAbstractDeviceState {
    acControl?: any,
    acSensor?: any,
    acModel?: any,
    acWeekPower?: any,
    acYearPower?: any,
    commonBasic?: any
}

class AirComponent extends AbstractDevice<IAirComponentProps, IAirComponentState> {
    constructor(props: any) {
        super(props);
    }

    async refreshData() {
        try {
            if (this.isRefreshDataRunning) return Promise.resolve();
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`air/daikin/${this.props.id}/information`);
            this.setState(data);
            this.isRefreshDataRunning = false;
        } catch (e: any) {
            // TODO
        }
    }

    async power(state: boolean) {
        try {
            await getClient().post(`air/daikin/${this.props.id}/set-values`, {
                power: state
            });
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    async changeTemp(inc: number) {
        try {
            await getClient().post(`air/daikin/${this.props.id}/set-values`, {
                targetTemperature: this.state.acControl.targetTemperature + inc
            });
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        let togglePower = <div />;
        let controls = <div />;
        let mode = <div />;
        let specialMode = <div />;
        if (!_.isNil(this.state) && !_.isNil(this.state.acControl)) {
            togglePower = (
                <Switch sx={{ marginLeft: "auto" }} color="secondary" onClick={() => this.power.bind(this)(!this.state.acControl.power)} defaultChecked={this.state.acControl.power} />
            );

            controls = (
                <Box>
                    <Tooltip title="Diminuer la température désirée">
                        <IconButton color="primary" aria-label="previous" onClick={() => { this.changeTemp.bind(this)(-0.5) }}>
                            <Remove />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Augmenter la température désirée">
                        <IconButton color="primary" aria-label="next" onClick={() => { this.changeTemp.bind(this)(0.5) }}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </Box>
            );

            let modeVerbose = "";
            let modeIcon = <div />;
            switch (this.state.acControl.mode) {
                case "HOT":
                    modeIcon = <LocalFireDepartment sx={{"color": "orange"}} />
                    modeVerbose = "Chauffe";
                    break;
                case "COLD":
                    modeIcon = <AcUnit sx={{"color": "lightblue"}} />
                    modeVerbose = "Climatise";
                    break;
                case "AUTO":
                case "AUTO1":
                case "AUTO2":
                    modeIcon = <Autorenew />
                    modeVerbose = "Automatique";
                    break;
                case "DEHUMDID":
                    modeIcon = <LocalFireDepartment />
                    modeVerbose = "Déshumidifacation";
                    break;
                case "FAN":
                    modeIcon = <Air />
                    modeVerbose = "Ventilation";
                    break;
            }
            mode = (
                <Tooltip title={modeVerbose}>
                    {modeIcon}
                </Tooltip>
            );

            let specialModeVerbose = "";
            let specialModeIcon = <div />;
            switch (this.state.acControl.specialMode) {
                case "STREAMER":
                    specialModeIcon = <Stream sx={{"color": "lightblue"}} />
                    specialModeVerbose = "Purification";
                    break;
                case "POWERFUL":
                    specialModeIcon = <ImPower style={{"color": "red"}} />
                    specialModeVerbose = "Puissant";
                    break;
                case "ECONO":
                    specialModeIcon = <FaLeaf style={{"color": "green "}}/>
                    specialModeVerbose = "Economique";
                    break;
            }
            specialMode = (
                <Tooltip title={specialModeVerbose}>
                    {specialModeIcon}
                </Tooltip>
            );
        }

        return (
            <Card sx={{ display: 'flex', m: 0.5, 'min-width': '30%' }}>
                <Menu
                    anchorEl={document.querySelector("#air-component-" + this.props.id)}
                    open={!_.isNil(this.state) && this.state.isMenuOpen}
                    onClose={this.closeMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={this.closeMenu}>Profile</MenuItem>
                    <MenuItem onClick={this.closeMenu}>My account</MenuItem>
                    <MenuItem onClick={this.closeMenu}>Logout</MenuItem>
                </Menu>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                <Air /> {this.props.name}
                            </Typography>
                            {togglePower}
                            <IconButton
                                size="small"
                                id={"air-component-" + this.props.id}
                                onClick={() => { this.openMenu.bind(this) }}
                                aria-controls={!_.isNil(this.state) && this.state.isMenuOpen ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={!_.isNil(this.state) && this.state.isMenuOpen ? 'true' : undefined}
                            >
                                <MoreVert />
                            </IconButton>
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }}>
                            <Tooltip title={"Température demandée"}>
                                <Box sx={{ display: 'flex', m: 0.5 }}>
                                    <Thermostat />
                                    {!_.isNil(this.state) && !_.isNil(this.state.acControl) ?
                                        this.state.acControl.targetTemperature : <CircularProgress size={16} color="inherit" />
                                    } °C
                                </Box>
                            </Tooltip>
                            <Tooltip title={"Température intérieure"}>
                                <Box sx={{ display: 'flex', m: 0.5 }}>
                                    <Home />
                                    {!_.isNil(this.state) && !_.isNil(this.state.acControl) ?
                                        this.state.acSensor.indoorTemperature : <CircularProgress size={12} color="inherit" />
                                    } °C
                                </Box>
                            </Tooltip>
                            <Box sx={{ display: 'flex', m: 0.5, marginLeft: "auto" }}>
                                {mode}
                                {specialMode}
                            </Box>
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        {controls}
                    </Box>
                </Box>
            </Card>
        );
    }
}

export default AirComponent;
