import React from "react";
import _ from "lodash";
import moment from "moment";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress,
    Tooltip,
    Switch,
    MenuItem,
    Divider,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, Modal, Stack
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
    Autorenew, Stream, BarChart
} from "@mui/icons-material";
import { FaLeaf } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import AbstractDevice, {IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {IoWaterOutline, WiHumidity} from "react-icons/all";
import {AxisOptions, Chart} from "react-charts";

type Consumption = {
    date: string,
    consumption: number
}

type Series<T> = {
    label: string,
    data: T[]
}

type Stats = {
    daily: Series<Consumption>[],
    monthly: Series<Consumption>[]
}

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
    commonBasic?: any,
    additionalInformationAnchorEl?: any,
    isAdditionalInformationOpen: boolean,
    isStatsOpen: boolean,
    statsData: Stats
}

moment.locale('fr');

class AirComponent extends AbstractDevice<IAirComponentProps, IAirComponentState> {
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
            ["HOT", (<MenuItem key={"HOT"} onClick={async () => await this.setMode.bind(this)("HOT")}>
                <ListItemIcon><LocalFireDepartment sx={{"color": "orange"}} /></ListItemIcon>
                <ListItemText>Mode chauffage</ListItemText>
            </MenuItem>)],
            ["COLD", (<MenuItem key={"COLD"} onClick={async () => await this.setMode.bind(this)("COLD")}>
                <ListItemIcon><AcUnit sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode climisation</ListItemText>
            </MenuItem>)],
            ["FAN", (<MenuItem key={"FAN"} onClick={async () => await this.setMode.bind(this)("FAN")}>
                <ListItemIcon><Air /></ListItemIcon>
                <ListItemText>Mode ventilation</ListItemText>
            </MenuItem>)],
            ["AUTO", (<MenuItem key={"AUTO"} onClick={async () => await this.setMode.bind(this)("AUTO")}>
                <ListItemIcon><Autorenew /></ListItemIcon>
                <ListItemText>Mode automatique</ListItemText>
            </MenuItem>)],
            ["DEHUMDID", (<MenuItem key={"DEHUMDID"} onClick={async () => await this.setMode.bind(this)("DEHUMDID")}>
                <ListItemIcon><IoWaterOutline style={{ fontSize: "24px" }} /></ListItemIcon>
                <ListItemText>Mode déshumidification</ListItemText>
            </MenuItem>)]
        ]);
        const listItemsSpecialMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["STREAMER", (<MenuItem key={"STREAMER"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>
                <ListItemIcon><Stream sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode purification</ListItemText>
            </MenuItem>)],
            ["POWERFUL", (<MenuItem key={"POWERFUL"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("POWERFUL");
            }}>
                <ListItemIcon><ImPower style={{"color": "red", fontSize: "24px"}} /></ListItemIcon>
                <ListItemText>Mode puissant</ListItemText>
            </MenuItem>)],
            ["ECONO", (<MenuItem key={"ECONO"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("ECONO");
            }}>
                <ListItemIcon><FaLeaf style={{"color": "green", fontSize: "24px"}}/></ListItemIcon>
                <ListItemText>Mode économique</ListItemText>
            </MenuItem>)]
        ]);
        const listItemsSuperSpecialMode: Map<string, JSX.Element> = new Map<string, JSX.Element>([
            ["POWERFUL/STREAMER", (<MenuItem key={"POWERFUL/STREAMER"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("POWERFUL");
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>
                <ListItemIcon><ImPower style={{"color": "red"}} /><Stream sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode puissant et purification</ListItemText>
            </MenuItem>)],
            ["ECONO/STREAMER", (<MenuItem key={"ECONO/STREAMER"} onClick={async () => {
                await this.resetActualSpecialMode.bind(this)();
                await this.setSpecialMode.bind(this)("ECONO");
                await this.setSpecialMode.bind(this)("STREAMER");
            }}>
                <ListItemIcon><FaLeaf style={{"color": "green "}}/><Stream sx={{"color": "lightblue"}} /></ListItemIcon>
                <ListItemText>Mode économique et purification</ListItemText>
            </MenuItem>)]
    ])

        listItemsMode.delete(this.state.acControl.mode);
        listItemsSpecialMode.delete(this.state.acControl.specialMode);
        listItemsSuperSpecialMode.delete(this.state.acControl.specialMode);

        const menu: Array<JSX.Element> = Array.from(listItemsMode.values());
        menu.push(<Divider key={"divideStandardWithSpecial"} />);
        for (const itemSpecial of Array.from(listItemsSpecialMode.values())) {
            menu.push(itemSpecial);
        }
        menu.push(<Divider key={"divideSpecialWithSuperSpecial"} />);
        for (const itemSuperSpecial of Array.from(listItemsSuperSpecialMode.values())) {
            menu.push(itemSuperSpecial);
        }

        menu.push(<Divider key={"divideSuperSpecialWithStats"} />);
        menu.push(<MenuItem key={`air-getstats-${this.props.id}`} onClick={() => this.displayStats.bind(this)()}>
            <ListItemIcon><BarChart /></ListItemIcon>
            <ListItemText>Voir les statistiques</ListItemText>
        </MenuItem>);

        return menu;
    }

    displayStats() {
        this.setState({
            isBackdropOpen: true
        });
        this.closeMenu();

        const dailyData: Series<Consumption>[] = [{
            label: 'Utilisation journalière cumulée (heures)',
            data: []
        }];
        const monthlyData: Series<Consumption>[] = [{
            label: 'Consommation mensuelle (kWh)',
            data: []
        }];

        if (!_.isNil(this.state.acWeekPower)) {
            dailyData[0].data.push({
                consumption: Math.round(this.state.acWeekPower.todayRuntime) / 60,
                date: "Aujourd'hui"
            });

            for (let i = 0; i < this.state.acWeekPower.data.length; i++) {
                const data = this.state.acWeekPower.data[i];
                dailyData[0].data.push({
                    consumption: Math.round(data / 60),
                    date: moment().subtract(i + 1, 'day').format("dddd")
                })
            }
        }

        if (!_.isNil(this.state.acYearPower)) {
            for (let i = 0; i < this.state.acYearPower.previousYear.length; i++) {
                const data = this.state.acYearPower.previousYear[i];
                monthlyData[0].data.push({
                    consumption: data / 10,
                    date: moment().set('month', i).format("MMMM") + " " + moment().format("YYYY")
                });
            }
            for (let i = 0; i < this.state.acYearPower.currentYear.length; i++) {
                const data = this.state.acYearPower.currentYear[i];
                monthlyData[0].data.push({
                    consumption: data / 10,
                    date: moment().set('month', i).format("MMMM") + " " + moment().subtract(1, 'year').format("YYYY")
                });
            }
        }

        this.setState({
            isStatsOpen: true,
            statsData: {
                daily: dailyData,
                monthly: monthlyData
            },
            isBackdropOpen: false
        });
    }

    renderStats() {
        const primaryAxis: AxisOptions<Consumption> = {
            getValue: datum => datum.date,
        };

        const secondaryAxes: AxisOptions<Consumption>[] = [{
            getValue: datum => datum.consumption,
        }];

        if (!_.isNil(this.state.statsData)) {
            const dailyStats = this.state.statsData.daily;
            const monthlyStats = this.state.statsData.monthly;

            return (
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    bgcolor: 'background.paper',
                    borderRadius: '5px',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Stack style={{"width": "100%", "height": "100%"}}>
                        <div style={{"width": "100%", "height": "50%"}}>
                            {this.state.isStatsOpen && <Chart
                                id={`daily-stats-${this.props.id}`}
                                key={`daily-stats-${this.props.id}`}
                                options={{
                                    data: dailyStats,
                                    primaryAxis,
                                    secondaryAxes,
                                }}
                            />}
                        </div>
                        <div style={{"width": "100%", "height": "50%"}}>
                            {this.state.isStatsOpen && <Chart
                                id={`monthly-stats-${this.props.id}`}
                                key={`monthly-stats-${this.props.id}`}
                                options={{
                                    data: monthlyStats,
                                    primaryAxis,
                                    secondaryAxes,
                                }}
                            />}
                        </div>
                    </Stack>
                </Box>
            );
        }
        return (<div />);
    }

    onStatsClose() {
        this.setState({ isStatsOpen: false });
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
            <Card sx={{ display: 'flex', m: 0.5, 'minWidth': '30%' }}>
                {this.renderMenu(this.getPossibleActions())}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                <Modal
                    open={this.state.isStatsOpen}
                    onClose={this.onStatsClose.bind(this)}
                >
                    {this.renderStats.bind(this)()}
                </Modal>
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
                            <List sx={{ p: 2 }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <Thermostat />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {!_.isNil(this.state) && !_.isNil(this.state.acSensor) ? this.state.acSensor.outdoorTemperature : <CircularProgress size={16} color="inherit" />} °C à l'extérieur
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <WiHumidity style={{ fontSize: "26px" }} />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {!_.isNil(this.state) && !_.isNil(this.state.acSensor) ? this.state.acSensor.indoorHumidity : <CircularProgress size={16} color="inherit" />}%
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Popover>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }} onClick={(event: React.MouseEvent) => this.openAdditionalInformationPopover.bind(this)(event)}>
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
