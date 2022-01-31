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
    alive: boolean
}

class EndpointComponent extends Component<IEndpointComponentProps, IEndpointComponentState> {
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
            const { data } = await getClient().get(`/network/endpoints/${this.props.id}/alive`);
            this.isRefreshDataRunning = false;
            this.setState({
                alive: data.alive
            });
        } catch (e: any) {
            // TODO
        }
    }

    async powerOn() {
        try {
            await getClient().post(`network/endpoint/${this.props.id}/wake`);
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
            if (this.state.alive) {
                powerButton = <Tooltip title="Allumé">
                    <PowerSettingsNew sx={{ color: 'green' }}/>
                </Tooltip>;
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

export default EndpointComponent;
