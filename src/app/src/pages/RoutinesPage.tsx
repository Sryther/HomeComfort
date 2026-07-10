import React, { Component } from "react";
import { Chip, Card, CardContent, Stack, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import _ from "lodash";

import SceneApiClient from "../api-client/clients/SceneApiClient";
import ScheduleApiClient from "../api-client/clients/ScheduleApiClient";
import Page from "../ui/page/Page";

interface State {
    scenes: any;
    schedules: any;

    isAddOpen: boolean;
    targetSceneId?: string;
    cronExpression: string;
}

export default class RoutinesPage extends Component<{}, State> {
    state: State = {
        scenes: [],
        schedules: [],
        isAddOpen: false,
        targetSceneId: undefined,
        cronExpression: "0 20 * * *"
    };

    async componentDidMount() {
        await this.reload();
    }

    async reload() {
        const [scenes, schedules] = await Promise.all([
            SceneApiClient.getInstance().all(),
            ScheduleApiClient.getInstance().all()
        ]);
        this.setState({ scenes, schedules });
    }

    openAdd = (sceneId: string) => {
        this.setState({ isAddOpen: true, targetSceneId: sceneId });
    };

    closeAdd = () => this.setState({ isAddOpen: false, targetSceneId: undefined });

    createSceneSchedule = async () => {
        const { targetSceneId, cronExpression } = this.state;
        if (_.isNil(targetSceneId)) return;

        await ScheduleApiClient.getInstance().create({
            cronExpression,
            action: {
                route: `/api/scene/${targetSceneId}`,
                httpVerb: "POST",
                deviceId: targetSceneId,
                deviceType: "scene",
                args: {}
            }
        });

        this.closeAdd();
        await this.reload();
    };

    render() {
        const { scenes, schedules, isAddOpen, cronExpression } = this.state;

        return (
            <Page title="Routines" subtitle="Déclenchez plusieurs actions en un clic, et planifiez-les si besoin.">
                <Stack spacing={1}>
                    {scenes.map((sc: any) => {
                        const linked = schedules.filter((s: any) => s.action?.route === `/api/scene/${sc._id}` && s.action?.httpVerb === "POST");

                        return (
                            <Card key={sc._id} sx={{ m: 0.5 }}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Typography variant="subtitle1">{sc.name}</Typography>

                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            Programmes associés : {linked.length}
                                        </Typography>

                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {linked.map((s: any) => (
                                                <Chip key={s._id} size="small" label={s.cronExpression} variant="outlined" />
                                            ))}
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
                                            <Button variant="outlined" onClick={() => SceneApiClient.getInstance().run(sc._id)}>
                                                Lancer
                                            </Button>
                                            <Button variant="contained" onClick={() => this.openAdd(sc._id)}>
                                                Ajouter un programme
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>

                <Dialog open={isAddOpen} onClose={this.closeAdd} maxWidth="sm" fullWidth>
                    <DialogTitle>Ajouter un programme</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Expression CRON"
                            value={cronExpression}
                            onChange={(e) => this.setState({ cronExpression: e.target.value })}
                            helperText="Exemple: 0 20 * * *"
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeAdd}>Annuler</Button>
                        <Button variant="contained" onClick={this.createSceneSchedule}>
                            Créer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Page>
        );
    }
}
