import {Component} from "react";
import _ from "lodash";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress, Tooltip
} from "@mui/material";
import {PlayArrow, Stop, Pause, ElectricalServicesOutlined, CleaningServicesOutlined} from "@mui/icons-material";
import {Battery20, Battery30, Battery50, Battery60, Battery80, Battery90, BatteryFull} from "@mui/icons-material";
import {BatteryCharging20, BatteryCharging30, BatteryCharging50, BatteryCharging60, BatteryCharging80, BatteryCharging90, BatteryChargingFull} from "@mui/icons-material";

interface IRoborockComponentProps {
    id: string,
    name: string,
    ip: string
}

interface IRoborockComponentState {
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

class RoborockComponent extends Component<IRoborockComponentProps, IRoborockComponentState> {
    refreshDataHandle?: NodeJS.Timer;
    isRefreshDataRunning: boolean = false;

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        try {
            await this.refreshData();
            this.refreshDataHandle = setInterval(this.refreshData.bind(this), 5000);
        } catch(error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        if (this.refreshDataHandle) {
            clearTimeout(this.refreshDataHandle);
        }
    }

    async refreshData() {
        try {
            if (this.isRefreshDataRunning) return;
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`/cleaning/roborocks/devices/${this.props.id}/capabilities/state`);
            this.isRefreshDataRunning = false;
            this.setState(data);
        } catch (e: any) {
            // TODO
        }
    }

    async clean() {
        try {
            await getClient().post(`/cleaning/roborocks/devices/${this.props.id}/capabilities/control`, {
                "action": "app_start"
            });
            await this.refreshData();
        } catch (e: any) {
            // TODO
        }
    }

    async pause() {
        try {
            await getClient().post(`/cleaning/roborocks/devices/${this.props.id}/capabilities/control`, {
                "action": "app_pause"
            });
            await this.refreshData();
        } catch (e: any) {
            // TODO
        }
    }

    async stop() {
        try {
            await getClient().post(`/cleaning/roborocks/devices/${this.props.id}/capabilities/control`, {
                "action": "app_stop"
            });
            await this.refreshData();
        } catch (e: any) {
            // TODO
        }
    }

    async charge() {
        try {
            await this.stop();
            setTimeout(async () => {
                await getClient().post(`/cleaning/roborocks/devices/${this.props.id}/capabilities/control`, {
                    "action": "app_charge"
                });
                await this.refreshData.bind(this)();
            }, 3000);
        } catch (e: any) {
            // TODO
        }
    }

    render() {
        let batteryLevelElem = <CircularProgress size={16} color="inherit" />;
        let mainControlButtons = <div />;
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
                        <CleaningServicesOutlined sx={{height: 38, width: 38}}/>
                    </IconButton>
                </Tooltip>
            );

            if (this.state.cleaning) {
                mainControlButtons = (
                    <Box>
                        {pauseButton}
                        {stopButton}
                        {chargeButton}
                    </Box>
                );
            } else {
                mainControlButtons = (
                    <Box>
                        {playButton}
                    </Box>
                );
            }
        }

        return (
            <Card sx={{ display: 'flex', m: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {this.props.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }}>
                            {batteryLevelElem}%
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        {mainControlButtons}
                    </Box>
                </Box>
            </Card>
        )
    }
}

export default RoborockComponent;
