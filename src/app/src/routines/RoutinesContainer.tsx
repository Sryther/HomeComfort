import React, { Component } from "react";
import { Box, Stack, Typography } from "@mui/material";
import SceneApiClient from "../api-client/clients/SceneApiClient";
import RoutineComponent from "./RoutineComponent";
import EmptyState from "../ui/state/EmptyState";

interface State {
    scenes: any;
}

export default class RoutinesContainer extends Component<{}, State> {
    state: State = { scenes: [] };

    async componentDidMount() {
        const scenes = await SceneApiClient.getInstance().all();
        this.setState({ scenes });
    }

    render() {
        const { scenes } = this.state;

        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Routines
                </Typography>

                <Stack spacing={1}>
                    {scenes.map((scene: any) => (
                        <RoutineComponent
                            key={scene._id}
                            scene={scene}
                            onChanged={async () => {
                                const updated = await SceneApiClient.getInstance().all();
                                this.setState({ scenes: updated });
                            }}
                        />
                    ))}
                    {scenes.length == 0 ? <EmptyState
                        title="Aucune routine"
                        description="Créez une routine pour lancer plusieurs actions d’un seul clic."
                        actionLabel="Créer une routine"
                    /> : null}
                </Stack>
            </Box>
        );
    }
}
