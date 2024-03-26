import React from "react";
import _ from "lodash";
import moment from "moment";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    Tooltip,
    Switch,
    MenuItem,
    Divider,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    CardHeader,
    CardActions
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
    Autorenew,
    Stream,
    LightModeTwoTone,
    NightlightTwoTone
} from "@mui/icons-material";
import { FaLeaf } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {IoWaterOutline} from "react-icons/io5";
import {WiHumidity} from "react-icons/wi";
import {v4 as uuidv4} from "uuid";
import AirApiClient from "../../api-client/clients/AirApiClient";

interface IAirDaikinComponentProps extends IAbstractDeviceProps {
    id: string,
    name: string,
    ip4?: string,
    ip6?: string
}

interface IAirDaikinComponentState extends IAbstractDeviceState {
    acControl?: any,
    acSensor?: any,
    acModel?: any,
    acWeekPower?: any,
    acYearPower?: any,
    commonBasic?: any,
    additionalInformationAnchorEl?: any,
    isAdditionalInformationOpen: boolean
}

moment.locale('fr');

class AirDaikinComponent extends AbstractDevice<IAirDaikinComponentProps, IAirDaikinComponentState> {
    constructor(props: any) {
        super(props);

        this.state = Object.assign(this.state, {
            additionalInformationAnchorEl: null,
            isAdditionalInformationOpen: false,
            isStatsOpen: false,
            statsData: {
                daily: [],
                monthly: []
            }
        });
    }

    async getDeviceInformation(): Promise<any> {
        try {
            return await AirApiClient.getInstance().getDaikin(this.props.id);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await AirApiClient.getInstance().updateDaikin(this.props.id, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        try {
            if (this.state.hasRaisenANetworkError || this.state.isRefreshDataRunning) return Promise.resolve();
            const { data } = await AirApiClient.getInstance().getDaikinInformation(this.props.id);
            this.setState(data);
        } catch (e: any) {
            return Promise.reject(e);
        }
    }

    async power(state: boolean) {
        try {
            await AirApiClient.getInstance().setDaikinValues(this.props.id, {
                power: state
            });
        } catch(error) {
            console.error(error);
        }
    }

    async changeTemp(inc: number) {
        try {
            await AirApiClient.getInstance().setDaikinValues(this.props.id, {
                targetTemperature: this.state.acControl.targetTemperature + inc
            });
        } catch(error) {
            console.error(error);
        }
    }

    async setMode(mode: string) {
        try {
            await AirApiClient.getInstance().setDaikinValues(this.props.id, {
                mode: mode
            });
        } catch(error) {
            console.error(error);
        }
    }

    async resetActualSpecialMode() {
        try {
            if (!_.isNil(this.state.acControl.specialMode)) {
                for (const specialMode of this.state.acControl.specialMode.split("/")) {
                    await AirApiClient.getInstance().setDaikinValues(this.props.id, {
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
            await AirApiClient.getInstance().setDaikinValues(this.props.id, {
                specialMode: specialMode,
                specialModeActive: true
            });
        } catch(error) {
            console.error(error);
        }
    }

    getPossibleActions(): Array<JSX.Element>{
        if (_.isNil(this.state) || _.isNil(this.state.acControl)) {
            return [];
        }

        const listItemsMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["HOT", (<MenuItem key={"HOT" + uuidv4()} onClick={async () => await this.setMode.bind(this)("HOT")}>
                <ListItemIcon><LocalFireDepartment sx={{"color": "orange"}} /></ListItemIcon>
                <ListItemText>Mode chauffage</ListItemText>
            </MenuItem>)],
            ["COLD", (<MenuItem key={"COLD" + uuidv4()} onClick={async () => await this.setMode.bind(this)("COLD")}>
                <ListItemIcon><AcUnit sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode climisation</ListItemText>
            </MenuItem>)],
            ["FAN", (<MenuItem key={"FAN" + uuidv4()} onClick={async () => await this.setMode.bind(this)("FAN")}>
                <ListItemIcon><Air /></ListItemIcon>
                <ListItemText>Mode ventilation</ListItemText>
            </MenuItem>)],
            ["AUTO", (<MenuItem key={"AUTO" + uuidv4()} onClick={async () => await this.setMode.bind(this)("AUTO")}>
                <ListItemIcon><Autorenew /></ListItemIcon>
                <ListItemText>Mode automatique</ListItemText>
            </MenuItem>)],
            ["DEHUMDID", (<MenuItem key={"DEHUMDID" + uuidv4()} onClick={async () => await this.setMode.bind(this)("DEHUMDID")}>
                <ListItemIcon><IoWaterOutline style={{ fontSize: "24px" }} /></ListItemIcon>
                <ListItemText>Mode déshumidification</ListItemText>
            </MenuItem>)]
        ]);
        const listItemsSpecialMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["STREAMER", (<MenuItem key={"STREAMER" + uuidv4()} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>
                <ListItemIcon><Stream sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode purification</ListItemText>
            </MenuItem>)],
            ["POWERFUL", (<MenuItem key={"POWERFUL" + uuidv4()} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("POWERFUL");
            }}>
                <ListItemIcon><ImPower style={{"color": "red", fontSize: "24px"}} /></ListItemIcon>
                <ListItemText>Mode puissant</ListItemText>
            </MenuItem>)],
            ["ECONO", (<MenuItem key={"ECONO" + uuidv4()} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("ECONO");
            }}>
                <ListItemIcon><FaLeaf style={{"color": "green", fontSize: "24px"}}/></ListItemIcon>
                <ListItemText>Mode économique</ListItemText>
            </MenuItem>)]
        ]);
        const listItemsSuperSpecialMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["POWERFUL/STREAMER", (<MenuItem key={"POWERFUL/STREAMER" + uuidv4()} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("POWERFUL");
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>
                <ListItemIcon><ImPower style={{"color": "red"}} /><Stream sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode puissant et purification</ListItemText>
            </MenuItem>)],
            ["ECONO/STREAMER", (<MenuItem key={"ECONO/STREAMER" + uuidv4()} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("ECONO");
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>
                <ListItemIcon><FaLeaf style={{"color": "green "}}/><Stream sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode économique et purification</ListItemText>
            </MenuItem>)]
        ]);

        listItemsMode.delete(this.state.acControl.mode);
        listItemsSpecialMode.delete(this.state.acControl.specialMode);
        listItemsSuperSpecialMode.delete(this.state.acControl.specialMode);

        const menu: Array<JSX.Element> = Array.from(listItemsMode.values());
        menu.push(<Divider key={"divideStandardWithSpecial" + uuidv4()} />);
        for (const itemSpecial of Array.from(listItemsSpecialMode.values())) {
            menu.push(itemSpecial);
        }
        menu.push(<Divider key={"divideSpecialWithSuperSpecial" + uuidv4()} />);
        for (const itemSuperSpecial of Array.from(listItemsSuperSpecialMode.values())) {
            menu.push(itemSuperSpecial);
        }

        menu.push(<Divider key={"divideSuperSpecialWithStats" + uuidv4()} />);
        menu.push(<MenuItem key={`air-enable-leds-${this.props.id}` + uuidv4()} onClick={async () => this.enableLEDs.bind(this)(true)}>
            <ListItemIcon><LightModeTwoTone /></ListItemIcon>
            <ListItemText>Activer les LEDs</ListItemText>
        </MenuItem>);
        menu.push(<MenuItem key={`air-disable-leds-${this.props.id}` + uuidv4()} onClick={async () => this.enableLEDs.bind(this)(false)}>
            <ListItemIcon><NightlightTwoTone /></ListItemIcon>
            <ListItemText>Désactiver les LEDs</ListItemText>
        </MenuItem>);

        return menu;
    }

    async enableLEDs(enabled: boolean) {
        try {
            await AirApiClient.getInstance().setDaikinLeds(this.props.id, enabled);

            this.closeMenu();
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    openAdditionalInformationPopover(event: React.MouseEvent) {
        this.setState({
            isAdditionalInformationOpen: true,
            additionalInformationAnchorEl: event.target
        });
    }

    handleAdditionalInformationPopoverClose() {
        this.setState({ isAdditionalInformationOpen: false });
    }

    render() {
        let mode = <div />;
        let specialMode = <div />;
        if (!_.isNil(this.state) && !_.isNil(this.state.acControl)) {

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
                    modeIcon = <IoWaterOutline style={{ fontSize: "24px" }} />
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
                    specialModeIcon = <ImPower style={{"color": "red", fontSize: "24px" }} />
                    specialModeVerbose = "Puissant";
                    break;
                case "POWERFUL/STREAMER":
                    specialModeIcon = (
                        <Box>
                            <ImPower style={{"color": "red", fontSize: "24px" }} />
                            <Stream sx={{"color": "lightblue"}} />
                        </Box>
                    )
                    specialModeVerbose = "Puissant/Purification";
                    break;
                case "ECONO/STREAMER":
                    specialModeIcon = (
                        <Box>
                            <FaLeaf style={{"color": "green", fontSize: "24px"}}/>
                            <Stream sx={{"color": "lightblue"}} />
                        </Box>
                    )
                    specialModeVerbose = "Economique/Purification";
                    break;
                case "ECONO":
                    specialModeIcon = <FaLeaf style={{"color": "green", fontSize: "24px"}}/>
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
            <Card sx={{ m: 0.5, 'minWidth': '30%' }}>
                {this.renderMenu(this.getPossibleActions())}
                {this.renderInformationModal()}
                <CardHeader
                    sx={{ width: '100%' }}
                    avatar={<Air />}
                    title={this.props.name}
                    subheader={this.props.ip4}
                    action={
                        <Box sx={{ display: 'flex' }}>
                            { !_.isNil(this.state) && !_.isNil(this.state.acControl) ?
                                <Switch color="secondary" onClick={() => this.power.bind(this)(!this.state.acControl.power)} defaultChecked={this.state.acControl.power} />
                                :
                                <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '58px', height: '38px' }} />
                            }
                            <IconButton
                                size="small"
                                id={"clients-component-" + this.props.id}
                                onClick={(event) => { this.openMenu.bind(this)(event) }}
                                aria-controls={!_.isNil(this.state) && this.state.isMenuOpen ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={!_.isNil(this.state) && this.state.isMenuOpen ? 'true' : undefined}
                            >
                                <MoreVert />
                            </IconButton>
                        </Box>
                    }
                />
                <CardContent sx={{ flex: '1 0 auto', width: '100%' }}>
                    {this.renderError()}
                    <Popover
                        open={this.state.isAdditionalInformationOpen}
                        anchorEl={this.state.additionalInformationAnchorEl}
                        onClose={this.handleAdditionalInformationPopoverClose.bind(this)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        {!_.isNil(this.state) && !_.isNil(this.state.acSensor) ?
                            <List sx={{p: 2}}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Thermostat/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        { this.state.acSensor.outdoorTemperature }°C à l'extérieur
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <WiHumidity style={{fontSize: "26px"}}/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        { this.state.acSensor.indoorHumidity }%
                                    </ListItemText>
                                </ListItem>
                            </List>
                            :
                            <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '36px' }} />
                        }
                    </Popover>
                    {!_.isNil(this.state) && !_.isNil(this.state.acControl) ?
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }} onClick={(event: React.MouseEvent) => this.openAdditionalInformationPopover.bind(this)(event)}>
                            <Tooltip title={"Température demandée"}>
                                <Box sx={{display: 'flex', m: 0.5}}>
                                    <Thermostat/>
                                    { this.state.acControl.targetTemperature }°C
                                </Box>
                            </Tooltip>
                            <Tooltip title={"Température intérieure"}>
                                <Box sx={{display: 'flex', m: 0.5}}>
                                    <Home/>
                                    {this.state.acSensor.indoorTemperature }°C
                                </Box>
                            </Tooltip>
                            <Box sx={{display: 'flex', m: 0.5, marginLeft: "auto"}}>
                                {mode}
                                {specialMode}
                            </Box>
                        </Typography>
                        :
                        <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%' }} />
                    }
                </CardContent>
                <CardActions sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {!_.isNil(this.state) && !_.isNil(this.state.acControl) ?
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
                            :
                            <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '80px', height: '48px' }} />
                        }
                    </Box>
                </CardActions>
            </Card>
        );
    }
}

export default AirDaikinComponent;
