import {Component} from "react";
import _ from "lodash";
import getClient from "../../api-client";
import {
    Card,
    Box,
    CardContent,
    Typography,
    IconButton,
    CircularProgress, Tooltip, Switch
} from "@mui/material";
import {Thermostat, Home, Remove, Stop, PlayArrow, Add} from "@mui/icons-material";

interface IAirComponentProps {
    id: string,
    name: string,
    ip4?: string,
    ip6?: string
}

interface IAirComponentState {
    acControl?: any,
    acSensor?: any,
    acModel?: any,
    acWeekPower?: any,
    acYearPower?: any,
    commonBasic?: any
}

class AirComponent extends Component<IAirComponentProps, IAirComponentState> {
    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        try {
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    async refreshData() {
        const { data } = await getClient().get(`air/daikin/${this.props.id}/information`);
        this.setState(data);
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
        const powerOff = (
            <Tooltip title="Eteindre">
                <IconButton color="primary" aria-label="pause" onClick={() => { this.power.bind(this)(false) }}>
                    <Stop sx={{height: 38, width: 38}}/>
                </IconButton>
            </Tooltip>
        );
        const powerOn = (
            <Tooltip title="Allumer">
                <IconButton color="primary" aria-label="play" onClick={() => { this.power.bind(this)(true)} }>
                    <PlayArrow sx={{height: 38, width: 38}}/>
                </IconButton>
            </Tooltip>
        );

        let togglePower = <div />;
        let controls = <div />;
        if (!_.isNil(this.state)) {
            togglePower = (
                <Switch sx={{ marginLeft: "auto" }} onClick={() => this.power.bind(this)(!this.state.acControl.power)} defaultChecked={this.state.acControl.power} />
            );

            controls = (
                <Box>
                    <Tooltip title="Diminuer la température désirée">
                        <IconButton size="small" color="secondary" aria-label="previous" onClick={() => { this.changeTemp.bind(this)(-0.5) }}>
                            <Remove />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Augmenter la température désirée">
                        <IconButton size="small" color="secondary" aria-label="next" onClick={() => { this.changeTemp.bind(this)(0.5) }}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        }

        return (
            <Card sx={{ display: 'flex', m: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                {this.props.name}
                            </Typography>
                            {togglePower}
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ display: 'flex' }}>
                            <Box sx={{ display: 'flex', m: 0.5 }}>
                                <Thermostat />
                                {!_.isNil(this.state) ?
                                    this.state.acControl.targetTemperature : <CircularProgress size={16} color="inherit" />
                                } °C
                            </Box>
                            <Box sx={{ display: 'flex', m: 0.5 }}>
                                <Home />
                                {!_.isNil(this.state) ?
                                    this.state.acSensor.indoorTemperature : <CircularProgress size={12} color="inherit" />
                                } °C
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
