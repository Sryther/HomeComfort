import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
);
