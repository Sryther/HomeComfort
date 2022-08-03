import React from "react";
import _ from "lodash";
import {
    Card,
    Box,
    Typography,
    Tooltip,
    Icon,
    Skeleton,
    CardHeader,
    CardActions,
    IconButton, CardContent
} from "@mui/material";
import {
    PlayArrow,
    Stop,
    Pause,
    ElectricalServicesOutlined, MoreVert
} from "@mui/icons-material";
import {Battery20, Battery30, Battery50, Battery60, Battery80, Battery90, BatteryFull} from "@mui/icons-material";
import {BatteryCharging20, BatteryCharging30, BatteryCharging50, BatteryCharging60, BatteryCharging80, BatteryCharging90, BatteryChargingFull} from "@mui/icons-material";
import AbstractDevice, {IAbstractDeviceProps, IAbstractDeviceState} from "../abstract-device/AbstractDevice";
import {GiVacuumCleaner} from "react-icons/gi";
import CleanApiClient from "../../api-client/clients/CleanApiClient";

interface ICleaningRoborockComponentProps extends IAbstractDeviceProps {
    id: string,
    name: string,
    ip: string
}

interface ICleaningRoborockComponentState extends IAbstractDeviceState {
    batteryLevel: number,
    charging: boolean,
    cleaning: boolean,
    fanSpeed: number
}

const iconPouleBatteries = {
    0: <Battery20 />,
    1: <Battery20 />,
    2: <Battery20 />,
    3: <Battery30 />,
    4: <Battery30 />,
    5: <Battery50 />,
    6: <Battery60 />,
    7: <Battery60 />,
    8: <Battery80 />,
    9: <Battery90 />,
    10: <BatteryFull />
};

const iconPouleBatteriesInCharge = {
    0: <BatteryCharging20 />,
    1: <BatteryCharging20 />,
    2: <BatteryCharging20 />,
    3: <BatteryCharging30 />,
    5: <BatteryCharging50 />,
    6: <BatteryCharging60 />,
    8: <BatteryCharging80 />,
    9: <BatteryCharging90 />,
    10: <BatteryChargingFull />
}

class CleaningRoborockComponent extends AbstractDevice<ICleaningRoborockComponentProps, ICleaningRoborockComponentState> {
    async getDeviceInformation(): Promise<any> {
        try {
            return await CleanApiClient.getInstance().getRoborock(this.props.id);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async updateDeviceInformation(data: any): Promise<any> {
        try {
            return await CleanApiClient.getInstance().updateRoborock(this.props.id, data);
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    async refreshData() {
        try {
            if (this.state.hasRaisenANetworkError || this.state.isRefreshDataRunning) return Promise.resolve();
            const { data } = await CleanApiClient.getInstance().getRoborockState(this.props.id);
            this.setState(data);
        } catch (e: any) {
            return Promise.reject(e);
        }
    }

    async clean() {
        try {
            await CleanApiClient.getInstance().startRoborock(this.props.id);
        } catch (e: any) {
            // TODO
        }
    }

    async pause() {
        try {
            await CleanApiClient.getInstance().pauseRoborock(this.props.id);
        } catch (e: any) {
            // TODO
        }
    }

    async stop() {
        try {
            await CleanApiClient.getInstance().stopRoborock(this.props.id);
        } catch (e: any) {
            // TODO
        }
    }

    async charge() {
        try {
            await this.stop();
            setTimeout(async () => {
                await CleanApiClient.getInstance().chargeRoborock(this.props.id);
                await this.refreshData.bind(this)();
            }, 3000);
        } catch (e: any) {
            // TODO
        }
    }

    render() {
        let batteryLevelElem = <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />;
        let mainControlButtons = <div />;
        let endpointState = <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '38px' }} />;
        let bgColor = "white";

        if (!_.isNil(this.state)) {
            const iconBatteryPouleIReallyWant: any = this.state.charging ? iconPouleBatteriesInCharge : iconPouleBatteries;
            batteryLevelElem = (<Box sx={{ display: 'flex' }}>
                {iconBatteryPouleIReallyWant[Math.floor(this.state.batteryLevel / 10)]} {this.state.batteryLevel}
            </Box>);

            const pauseButton = (
                <Tooltip title="Pause">
                    <IconButton color="primary" aria-label="play" onClick={() => { this.pause.bind(this)()} }>
                        <Pause sx={{height: 38, width: 38}}/>
                    </IconButton>
                </Tooltip>
            );
            const stopButton = (
                <Tooltip title="Stop">
                    <IconButton color="primary" aria-label="play" onClick={() => { this.stop.bind(this)()} }>
                        <Stop sx={{height: 38, width: 38}}/>
                    </IconButton>
                </Tooltip>
            );
            const chargeButton = (
                <Tooltip title="Charger">
                    <IconButton color="primary" aria-label="play" onClick={() => { this.charge.bind(this)()} }>
                        <ElectricalServicesOutlined sx={{height: 38, width: 38}}/>
                    </IconButton>
                </Tooltip>
            );
            const playButton = (
                <Tooltip title="Lancer">
                    <IconButton color="primary" aria-label="play" onClick={() => { this.clean.bind(this)()} }>
                        <PlayArrow sx={{height: 38, width: 38}}/>
                    </IconButton>
                </Tooltip>
            );

            if (this.state.cleaning) {
                bgColor = "#49fdba";
                mainControlButtons = (
                    <Box>
                        {pauseButton}
                        {stopButton}
                        {chargeButton}
                    </Box>
                );
                endpointState = (
                    <Tooltip title="Allumé">
                        <Icon>
                            <PlayArrow sx={{color: "green" }} />
                        </Icon>
                    </Tooltip>
                );
            } else {
                bgColor = "white";
                mainControlButtons = (
                    <Box>
                        {playButton}
                    </Box>
                );
                endpointState = <div />;
            }
        }

        return (
            <Card sx={{ m: 0.5, 'minWidth': '30%', backgroundColor: bgColor }}>
                {this.renderMenu()}
                {this.renderInformationModal()}
                {this.renderBackdrop()}
                <CardHeader
                    sx={{width: '100%'}}
                    avatar={<GiVacuumCleaner />}
                    title={this.props.name}
                    subheader={ !_.isNil(this.state) ?
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }}>
                            {batteryLevelElem}%
                            <Box sx={{ display: 'flex', m: 0.5, marginLeft: "auto" }}>
                                {endpointState}
                            </Box>
                        </Typography>
                        :
                        <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '100%', height: '28px' }} />
                    }
                    action={
                        <IconButton
                            size="small"
                            id={"roborock-component-" + this.props.id}
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
                    { !_.isNil(this.state) ?
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            {mainControlButtons}
                        </Box>
                        :
                        <Skeleton variant="text" animation="wave" sx={{ display: 'flex', width: '54px', height: '54px' }} />
                    }
                </CardActions>
            </Card>
        )
    }
}

export default CleaningRoborockComponent;
