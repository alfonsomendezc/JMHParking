import '@mantine/core/styles.css';
import Homepage from './homepage/Homepage';
import { MantineProvider } from '@mantine/core';

export default function App() {
    return (
        <MantineProvider>
            <Homepage/>
        </MantineProvider>
    );
}