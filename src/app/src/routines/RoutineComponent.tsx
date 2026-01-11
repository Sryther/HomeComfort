import React, { Component } from "react";
import {
    Card,
    CardContent,
    Stack,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import SceneApiClient from "../api-client/clients/SceneApiClient";
import SceneComponent from "./scene/SceneComponent";

interface Props {
    scene: any; // Scene
    onChanged: () => Promise<void>;
}

interface State {
    isEditOpen: boolean;
    isRenameOpen: boolean;
    newName: string;
}

export default class RoutineComponent extends Component<Props, State> {
    state: State = {
        isEditOpen: false,
        isRenameOpen: false,
        newName: this.props.scene?.name || ""
    };

    openEdit = () => this.setState({ isEditOpen: true });
    closeEdit = () => this.setState({ isEditOpen: false });

    openRename = () => this.setState({ isRenameOpen: true, newName: this.props.scene?.name || "" });
    closeRename = () => this.setState({ isRenameOpen: false });

    run = async () => {
        await SceneApiClient.getInstance().run(this.props.scene._id);
    };

    rename = async () => {
        await SceneApiClient.getInstance().update(this.props.scene._id, { name: this.state.newName });
        this.closeRename();
        await this.props.onChanged();
    };

    remove = async () => {
        await SceneApiClient.getInstance().remove(this.props.scene._id);
        await this.props.onChanged();
    };

    render() {
        const { scene } = this.props;
        const actionsCount = Array.isArray(scene.actions) ? scene.actions.length : 0;

        return (
            <>
                <Card sx={{ m: 0.5 }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle1">{scene.name}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                    {actionsCount} action(s)
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" onClick={this.run}>
                                    Lancer
                                </Button>
                                <Button variant="contained" onClick={this.openEdit}>
                                    Éditer
                                </Button>
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" onClick={this.openRename}>
                                Renommer
                            </Button>
                            <Button size="small" color="error" onClick={this.remove}>
                                Supprimer
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                <Dialog open={this.state.isEditOpen} onClose={this.closeEdit} maxWidth="md" fullWidth>
                    <DialogTitle>Routine : {scene.name}</DialogTitle>
                    <DialogContent>
                        <SceneComponent key={scene._id} id={scene._id} name={scene.name} itemDefinitionName={"Editer la scène"} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeEdit}>Fermer</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.isRenameOpen} onClose={this.closeRename} maxWidth="sm" fullWidth>
                    <DialogTitle>Renommer la routine</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nom"
                            value={this.state.newName}
                            onChange={(e) => this.setState({ newName: e.target.value })}
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeRename}>Annuler</Button>
                        <Button variant="contained" onClick={this.rename}>
                            Enregistrer
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}
