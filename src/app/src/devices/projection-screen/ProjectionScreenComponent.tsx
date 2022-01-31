import {Component} from "react";
import getClient from "../../api-client";
import {
    Card,
    Box,
    IconButton, Tooltip, Typography, CardContent,
} from "@mui/material";
import {ArrowUpward, ArrowDownward} from "@mui/icons-material";

interface IProjectionScreenComponentProps {
    id: string,
    name: string
}

interface IProjectionScreenState {}

class ProjectionScreenComponent extends Component<IProjectionScreenComponentProps, IProjectionScreenState> {
    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {}

    async up() {
        try {
            await getClient().post(`/projection-screen/lumene/${this.props.id}/up`);
        } catch(error) {
            console.error(error);
        }
    }

    async down() {
        try {
            await getClient().post(`/projection-screen/lumene/${this.props.id}/down`);
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Card sx={{ display: 'flex', m: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Typography component="div" variant="h5">
                                {this.props.name}
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box>
                        <Tooltip title="Descendre">
                            <IconButton size="small" color="secondary" aria-label="previous" onClick={() => { this.down.bind(this)() }}>
                                <ArrowDownward />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Monter">
                            <IconButton size="small" color="secondary" aria-label="next" onClick={() => { this.up.bind(this)() }}>
                                <ArrowUpward />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Card>
        )
    }
}

export default ProjectionScreenComponent;
