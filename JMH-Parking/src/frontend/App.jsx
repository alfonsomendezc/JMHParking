import '@mantine/core/styles.css';
import Homepage from './homepage/Homepage';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
        fontFamily: 'Outfit, sans-serif',
    });

export default function App() {

    
    return (
        <MantineProvider theme={theme}>
            <Homepage />
        </MantineProvider>
    );
}