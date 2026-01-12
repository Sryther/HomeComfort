import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function Page(props: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5">{props.title}</Typography>
          {props.subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {props.subtitle}
            </Typography>
          )}
        </Box>
        {props.right}
      </Stack>
      {props.children}
    </Box>
  );
}
