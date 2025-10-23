import * as React from "react";
import Homepage from './homepage/Homepage';
import Apply from './apply/Apply';
import { Outlet } from "react-router-dom";
import { Header } from './components/Header';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';


const theme = createTheme({
    fontFamily: 'Outfit, sans-serif',
});

export default function App() {

    return (
        <MantineProvider theme={theme}>
            <Header />
            <Outlet />
        </MantineProvider>
    );
}