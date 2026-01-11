import React, { Component } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import _ from "lodash";

import ScheduleApiClient from "../api-client/clients/ScheduleApiClient";
import SceneApiClient from "../api-client/clients/SceneApiClient";

type Schedule = any;
type Scene = any;

interface State {
    schedules: Schedule[] ;
    scenes: Scene[];
    isCreateOpen: boolean;

    // Create form
    cronExpression?: string;
    mode?: "scene" | "advanced";
    sceneId?: string;

    route: string;
    httpVerb: string;
    argsJson: string;

    loading: boolean;
}

export default class SchedulesPage extends Component<{}, State> {
    state: State = {
        schedules: [],
        scenes: [],
        isCreateOpen: false,

        cronExpression: "0 20 * * *", // exemple
        mode: "scene",
        sceneId: undefined,

        route: "",
        httpVerb: "POST",
        argsJson: "{}", // JSON string

        loading: false
    };

    async componentDidMount() {
        await this.reload();
    }

    async reload() {
        this.setState({ loading: true });
        try {
            const [schedules, scenes] = await Promise.all([
                ScheduleApiClient.getInstance().all(),
                SceneApiClient.getInstance().all()
            ]);
            this.setState({ schedules, scenes });
        } finally {
            this.setState({ loading: false });
        }
    }

    openCreate = () => this.setState({ isCreateOpen: true });
    closeCreate = () => this.setState({ isCreateOpen: false });

    deleteSchedule = async (id: string) => {
        await ScheduleApiClient.getInstance().remove(id);
        await this.reload();
    };

    createSchedule = async () => {
        const { cronExpression, mode, sceneId, route, httpVerb, argsJson } = this.state;

        let action: any;

        if (mode === "scene") {
            if (_.isNil(sceneId) || sceneId === "") return;

            action = {
                route: `/scene/${sceneId}`,
                httpVerb: "POST",
                deviceId: sceneId,
                deviceType: "scene",
                args: {}
            };
        } else {
            // Advanced
            let args: any = {};
            try {
                args = JSON.parse(argsJson || "{}");
            } catch {
                // On laisse échouer côté API si besoin ; tu peux aussi afficher une toast ici
                args = {};
            }

            action = {
                route,
                httpVerb,
                deviceId: "manual",
                deviceType: "manual",
                args
            };
        }

        await ScheduleApiClient.getInstance().create({
            cronExpression,
            action
        });

        this.closeCreate();
        await this.reload();
    };

    render() {
        const { schedules, scenes, isCreateOpen, cronExpression, mode, sceneId, route, httpVerb, argsJson } = this.state;

        return (
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h5">Programmes</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={this.openCreate}>
                        Nouveau programme
                    </Button>
                </Stack>

                <Stack spacing={1}>
                    {schedules.map((s: any) => (
                        <Card key={s._id} sx={{ m: 0.5 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle1">{s.cronExpression}</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            {s.action?.httpVerb} {s.action?.route}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                            deviceType={s.action?.deviceType} deviceId={s.action?.deviceId}
                                        </Typography>
                                    </Box>
                                    <Tooltip title="Supprimer">
                                        <IconButton onClick={() => this.deleteSchedule(s._id)} size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                <Dialog open={isCreateOpen} onClose={this.closeCreate} maxWidth="sm" fullWidth>
                    <DialogTitle>Nouveau programme</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                label="Expression CRON"
                                value={cronExpression}
                                onChange={(e) => this.setState({ cronExpression: e.target.value })}
                                helperText="Exemple: 0 20 * * * (tous les jours à 20:00)"
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    label="Type"
                                    value={mode}
                                    onChange={(e) => this.setState({ mode: e.target.value as any })}
                                >
                                    <MenuItem value="scene">Déclencher une scène (routine)</MenuItem>
                                    <MenuItem value="advanced">Action avancée (route + verbe)</MenuItem>
                                </Select>
                            </FormControl>

                            {mode === "scene" ? (
                                <FormControl fullWidth>
                                    <InputLabel>Scène</InputLabel>
                                    <Select
                                        label="Scène"
                                        value={sceneId || ""}
                                        onChange={(e) => this.setState({ sceneId: e.target.value as string })}
                                    >
                                        {scenes.map((sc: any) => (
                                            <MenuItem key={sc._id} value={sc._id}>
                                                {sc.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <>
                                    <TextField
                                        label="Route (ex: /light/hue/...)"
                                        value={route}
                                        onChange={(e) => this.setState({ route: e.target.value })}
                                        fullWidth
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel>Verbe HTTP</InputLabel>
                                        <Select
                                            label="Verbe HTTP"
                                            value={httpVerb}
                                            onChange={(e) => this.setState({ httpVerb: e.target.value as string })}
                                        >
                                            <MenuItem value="POST">POST</MenuItem>
                                            <MenuItem value="PUT">PUT</MenuItem>
                                            <MenuItem value="DELETE">DELETE</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Args (JSON)"
                                        value={argsJson}
                                        onChange={(e) => this.setState({ argsJson: e.target.value })}
                                        fullWidth
                                        multiline
                                        minRows={4}
                                    />
                                </>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeCreate}>Annuler</Button>
                        <Button variant="contained" onClick={this.createSchedule}>
                            Créer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}
