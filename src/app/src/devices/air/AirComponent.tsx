import React from "react";
import _ from "lodash";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress, Tooltip, Switch, MenuItem, Divider
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
    async getDeviceInformation(): Promise<any> {
        try {
            return await getClient().get(`/air/daikin/${this.props.id}`);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await getClient().put(`/air/daikin/${this.props.id}`, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        try {
            if (this.isRefreshDataRunning) return Promise.resolve();
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`/air/daikin/${this.props.id}/information`);
            this.setState(data);
            this.isRefreshDataRunning = false;
        } catch (e: any) {
            // TODO
        }
    }

    async power(state: boolean) {
        try {
            await getClient().post(`/air/daikin/${this.props.id}/set-values`, {
                power: state
            });
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    async changeTemp(inc: number) {
        try {
            await getClient().post(`/air/daikin/${this.props.id}/set-values`, {
                targetTemperature: this.state.acControl.targetTemperature + inc
            });
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    async setMode(mode: string) {
        try {
            await getClient().post(`/air/daikin/${this.props.id}/set-values`, {
                mode: mode
            });
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    async resetActualSpecialMode() {
        try {
            if (!_.isNil(this.state.acControl.specialMode)) {
                for (const specialMode of this.state.acControl.specialMode.split("/")) {
                    await getClient().post(`air/daikin/${this.props.id}/set-values`, {
                        specialMode: specialMode,
                        specialModeActive: false
                    });
                }
            }
        } catch(error) {
            console.error(error);
        }
    }

    async setSpecialMode(specialMode: string) {
        try {
            await getClient().post(`air/daikin/${this.props.id}/set-values`, {
                specialMode: specialMode,
                specialModeActive: true
            });
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    getPossibleActions(): Array<JSX.Element>{
        if (_.isNil(this.state) || _.isNil(this.state.acControl)) {
            return [];
        }

        const listItemsMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["HOT", (<MenuItem key={"HOT"} onClick={async () => await this.setMode.bind(this)("HOT")}>Mode chauffage</MenuItem>)],
            ["COLD", (<MenuItem key={"COLD"} onClick={async () => await this.setMode.bind(this)("COLD")}>Mode climisation</MenuItem>)],
            ["FAN", (<MenuItem key={"FAN"} onClick={async () => await this.setMode.bind(this)("FAN")}>Mode ventilation</MenuItem>)],
            ["AUTO", (<MenuItem key={"AUTO"} onClick={async () => await this.setMode.bind(this)("AUTO")}>Mode automatique</MenuItem>)],
            ["DEHUMDID", (<MenuItem key={"DEHUMDID"} onClick={async () => await this.setMode.bind(this)("DEHUMDID")}>Mode déshumidification</MenuItem>)]
        ]);
        const listItemsSpecialMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["STREAMER", (<MenuItem key={"STREAMER"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>Mode supp. purification</MenuItem>)],
            ["POWERFUL", (<MenuItem key={"POWERFUL"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("POWERFUL");
            }}>Mode supp. puissant</MenuItem>)],
            ["ECONO", (<MenuItem key={"ECONO"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("ECONO");
            }}>Mode supp. économique</MenuItem>)]
        ]);
        const listItemsSuperSpecialMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["POWERFUL/STREAMER", (<MenuItem key={"POWERFUL/STREAMER"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("POWERFUL");
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>Mode supp. puissant et purification</MenuItem>)],
            ["ECONO/STREAMER", (<MenuItem key={"ECONO/STREAMER"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("ECONO");
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>Mode supp. économique et purification</MenuItem>)]
    ])

        listItemsMode.delete(this.state.acControl.mode);
        listItemsSpecialMode.delete(this.state.acControl.specialMode);
        listItemsSuperSpecialMode.delete(this.state.acControl.specialMode);

        const menu: Array<JSX.Element> = Array.from(listItemsMode.values());
        menu.push(<Divider key={"divideStandardWithSpecial"} />);
        for (const itemSpecial of Array.from(listItemsSpecialMode.values())) {
            menu.push(itemSpecial);
        }
        menu.push(<Divider key={"divideStandardWithSuperSpecial"} />);
        for (const itemSuperSpecial of Array.from(listItemsSuperSpecialMode.values())) {
            menu.push(itemSuperSpecial);
        }

        return menu;
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
                case "POWERFUL/STREAMER":
                    specialModeIcon = (
                        <Box>
                            <ImPower style={{"color": "red"}} />
                            <Stream sx={{"color": "lightblue"}} />
                        </Box>
                    )
                    specialModeVerbose = "Puissant/Purification";
                    break;
                case "ECONO/STREAMER":
                    specialModeIcon = (
                        <Box>
                            <FaLeaf style={{"color": "green "}}/>
                            <Stream sx={{"color": "lightblue"}} />
                        </Box>
                    )
                    specialModeVerbose = "Economique/Purification";
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
            <Card sx={{ display: 'flex', m: 0.5, 'minWidth': '30%' }}>
                {this.renderMenu(this.getPossibleActions())}
                {this.renderInformationModal()}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%' }}>
                    <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                <Air /> {this.props.name}
                            </Typography>
                            <Box sx={{ marginLeft: "auto" }}>
                                {togglePower}
                                <IconButton
                                    size="small"
                                    id={"air-component-" + this.props.id}
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
