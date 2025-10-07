import { SimpleGrid, Container, Button, Group, Badge, Card, Text, Image, Avatar, Center } from '@mantine/core';
import { IconCar, IconMapPin, IconCurrencyDollar } from '@tabler/icons-react';
import classes from '../styles/cards.module.css';
import MPALogo from '../../images/MPAlogo.png';

const garages = [
    {
        id: 'PPW',
        name: 'Park Plaza West - Green Garage',
        image: 'https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg',
        capacity: 600,
        address: '1611 NW 12th Avenue, Miami. FL 33136',
        status: 'Unavailable',
    },
    {
        id: 'PPE',
        name: 'Park Plaza East - Red Garage',
        image: 'https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg',
        capacity: 450,
        address: '901 NW 17th Street, Miami. FL 33136',
        status: 'Available',
    },
    {
        id: 'HPG',
        name: 'Highland Parking Garage - Yellow Garage',
        image: 'https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg',
        capacity: 450,
        address: '1801 NW 9th Avenue, Miami. FL 33136',
        status: 'Available',
    },
    {
        id: 'NG',
        name: 'North Garage - Blue Garage',
        image: 'https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg',
        capacity: 450,
        address: '1120 NW 20th Street, Miami. FL 33136',
        status: 'Unavailable',
    },
    {
        id: 'LOT10',
        name: 'Lot #10',
        image: 'https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg',
        capacity: 450,
        address: '1855 NW 8th Avenue, Miami. FL 33136',
        status: 'Available',
    },
    {
        id: 'LOT4',
        name: 'Lot #4',
        image: 'https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg',
        capacity: 450,
        address: '1227 NW 16th Street, Miami. FL 33136',
        status: 'Unavailable',
    },
];

function GarageCard({ g }) {
    const statusColor = g.status ? 'green' : g.status ? 'yellow' : 'red';

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section>
                <Image src={g.image} height={160} alt={g.name} />
            </Card.Section>

            <Badge className={classes.rating} variant="gradient" gradient={{ from: 'blue', to: 'Green' }}>
                {g.status}
            </Badge>

            <Text className={classes.title} fw={600}>{g.name}</Text>

            <Group gap="xs" mb="xs">
                <IconMapPin size={16} />
                <Text fz="sm">{g.address}</Text>
            </Group>
            <Group gap="sm" mb="md">
                <Group gap={6}>
                    <Text fz="sm">- # of Floors</Text>
                </Group>
                <Group gap={6}>
                    <Text fz="sm">- Clearance</Text>
                </Group>
                <Group gap={6}>
                    <Text fz="sm">- Reference Locations</Text>
                </Group>
            </Group>

            <Group gap="sm" mb="md">
            </Group>

            {/* <Badge color={statusColor} variant="light">{fillPct}% full</Badge> */}

            <Group justify="space-between" className={classes.footer}>
                <Center>
                    <Avatar src={MPALogo} size={24} radius="xl" mr="xs" />

                    <Group gap={8} mr={0}>
                        <Button size="xs" component="a">Directions</Button>
                    </Group>
                </Center>
            </Group>
        </Card>
    );
}

export function FeatureCards() {
    return (
        <Container size="lg" py="lg">
            <SimpleGrid
                cols={3}
                spacing="lg"
                breakpoints={[
                    { maxWidth: '62rem', cols: 2, spacing: 'md' }, // ~992px
                    { maxWidth: '36rem', cols: 1, spacing: 'sm' }, // ~576px
                    { maxWidth: '48rem', cols: 2, spacing: 'md' }, // ~768px
                    { maxWidth: '36rem', cols: 1, spacing: 'sm' }, // ~576px
                ]}
            >
                {garages.map((g) => (
                    <GarageCard key={g.id} g={g} />
                ))}
            </SimpleGrid>
        </Container>
    );
}
