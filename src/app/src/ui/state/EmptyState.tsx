import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

export default function EmptyState(props: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <Card>
            <CardContent>
                <Stack spacing={1}>
                    <Typography variant="subtitle1">{props.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.description}
                    </Typography>
                    {props.actionLabel && props.onAction && (
                        <Button variant="contained" onClick={props.onAction} sx={{ alignSelf: "flex-start", mt: 1 }}>
                            {props.actionLabel}
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}