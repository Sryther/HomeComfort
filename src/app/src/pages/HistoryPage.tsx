import React, { Component } from "react";
import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";

import EventApiClient from "../api-client/clients/EventApiClient";

interface State {
    events: any[];
}

export default class HistoryPage extends Component<{}, State> {
    state: State = { events: [] };

    async componentDidMount() {
        const events = await EventApiClient.getInstance().latest(300);
        this.setState({ events });
    }

    render() {
        const { events } = this.state;

        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Historique
                </Typography>

                <Stack spacing={1}>
                    {events.map((e: any) => (
                        <Card key={e._id} sx={{ m: 0.5 }}>
                            <CardContent>
                                <Stack spacing={0.5}>
                                    <Typography variant="subtitle2">
                                        {moment(e.date).format("YYYY-MM-DD HH:mm:ss")}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                        {e.httpVerb} {e.route}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        deviceType={e.deviceType || "n/a"} deviceId={e.deviceId || "n/a"}
                                    </Typography>

                                    <Accordion sx={{ mt: 1 }} disableGutters>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="body2">Args</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                                            {JSON.stringify(e.args || {}, null, 2)}
                                          </pre>
                                        </AccordionDetails>
                                    </Accordion>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Box>
        );
    }
}
