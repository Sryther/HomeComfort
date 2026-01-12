import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    shape: {
        borderRadius: 14,
    },
    typography: {
        fontFamily: [
            "Inter",
            "system-ui",
            "-apple-system",
            "Segoe UI",
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif",
        ].join(","),
        h5: { fontWeight: 700, letterSpacing: -0.3 },
        h6: { fontWeight: 700 },
        subtitle1: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 },
    },
    palette: {
        mode: "dark",
        primary: { main: "#38BDF8" },
        secondary: { main: "#A78BFA" },
        background: {
            default: "#0B1220",
            paper: "#0F172A",
        },
        text: {
            primary: "#E5E7EB",
            secondary: "#9CA3AF",
        },
        divider: "rgba(255,255,255,0.08)",
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: { paddingTop: 16, paddingBottom: 24 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                    backgroundImage: "none",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    paddingLeft: 14,
                    paddingRight: 14,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundImage: "none",
                },
            },
        },
        MuiTextField: {
            defaultProps: { size: "small" },
        },
        MuiChip: {
            styleOverrides: {
                root: { borderRadius: 10 },
            },
        },
    },
});
