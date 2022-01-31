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
import {PowerSettingsNew} from "@mui/icons-material";

interface IEndpointComponentProps {
    id: string,
    name: string
}

interface IEndpointComponentState {
    power: boolean
}

class VideoProjectorComponent extends Component<IEndpointComponentProps, IEndpointComponentState> {
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
            if (this.isRefreshDataRunning) return Promise.resolve();
            this.isRefreshDataRunning = true;
            const { data } = await getClient().get(`/video-projector/viewsonic/${this.props.id}/state`);
            this.isRefreshDataRunning = false;
            this.setState({
                power: data === "ON"
            });
        } catch (e: any) {
            // TODO
        }
    }

    async powerOn() {
        try {
            await getClient().post(`/video-projector/viewsonic/${this.props.id}/power-on`);
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    async powerOff() {
        try {
            await getClient().post(`/video-projector/viewsonic/${this.props.id}/power-off`);
            await this.refreshData();
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        let powerButton = <Box>
            <Tooltip title="Allumer">
                <IconButton size="small" color="primary" onClick={() => { this.powerOn.bind(this)() }}>
                    <PowerSettingsNew />
                </IconButton>
            </Tooltip>
        </Box>;

        if (!_.isNil(this.state)) {
            if (this.state.power) {
                powerButton = <Box>
                    <Tooltip title="Eteindre">
                        <IconButton size="small" color="error" onClick={() => { this.powerOff.bind(this)() }}>
                            <PowerSettingsNew />
                        </IconButton>
                    </Tooltip>
                </Box>;
            }
        }

        return (
            <Card sx={{ display: 'flex', m: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                            {this.props.name}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        {powerButton}
                    </Box>
                </Box>
            </Card>
        )
    }
}

export default VideoProjectorComponent;
