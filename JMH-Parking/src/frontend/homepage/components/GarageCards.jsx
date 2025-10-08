import { useState } from "react";
import {
  Box,
  SimpleGrid,
  Container,
  Button,
  Group,
  Badge,
  Card,
  Text,
  Image,
  Avatar,
  Center,
  Collapse,
  AspectRatio,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMapPin } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import classes from "../styles/cards.module.css";
import MPALogo from "../../images/MPAlogo.png";

const garages = [
  { id: "PPW", name: "Park Plaza West - Green Garage", image: "https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg", capacity: 600, address: "1140 NW 16th Avenue, Miami, FL 33136", status: "Unavailable" },
  { id: "PPE", name: "Park Plaza East - Red Garage", image: "https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg", capacity: 450, address: "901 NW 17th Street, Miami, FL 33136", status: "Available" },
  { id: "HPG", name: "Highland Parking Garage - Yellow Garage", image: "https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg", capacity: 450, address: "1801 NW 9th Avenue, Miami, FL 33136", status: "Available" },
  { id: "NG", name: "North Garage - Blue Garage", image: "https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg", capacity: 450, address: "1120 NW 20th Street, Miami, FL 33136", status: "Unavailable" },
  { id: "LOT10", name: "Lot #10", image: "https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg", capacity: 450, address: "1855 NW 8th Avenue, Miami, FL 33136", status: "Available" },
  { id: "LOT4", name: "Lot #4", image: "https://storage.googleapis.com/jacksonh/1/JHS_Location_JacksonMemorial_Header-1.jpg", capacity: 450, address: "1227 NW 16th Street, Miami, FL 33136", status: "Unavailable" },
];

// ---- helpers ----
function buildDirectionsUrl({ placeId, lat, lng, address }) {
  const base = "https://www.google.com/maps/dir/?api=1";
  const params = new URLSearchParams({ travelmode: "driving" });
  if (placeId) params.set("destination_place_id", placeId);
  else if (lat && lng) params.set("destination", `${lat},${lng}`);
  else if (address) params.set("destination", address);
  return `${base}&${params.toString()}`;
}

function MapEmbed({ placeId, address, lat, lng }) {
  const query = placeId ? `place_id:${placeId}` : lat && lng ? `${lat},${lng}` : encodeURIComponent(address || "");
  const src = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GMAPS_KEY}&q=${query}`;
  return (
    <AspectRatio ratio={16 / 9} radius="sm">
      <iframe
        src={src}
        loading="lazy"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Map preview"
      />
    </AspectRatio>
  );
}

function getStatusColor(status) {
  const s = String(status || "").toLowerCase().trim();
  if (s === "available") return "green";
  if (s === "unavailable") return "red";
  return "yellow";
}

// ---- card ----
function GarageCard({ g }) {
  const [showMap, setShowMap] = useState(false);
  const directionsUrl = buildDirectionsUrl(g);

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section>
        <Image src={g.image} height={160} alt={g.name} />
      </Card.Section>

      <Badge className={classes.rating} color={getStatusColor(g.status)} radius="xl" variant="filled" size="sm">
        {g.status}
      </Badge>

      <Text className={classes.title} fw={600}>
        {g.name}
      </Text>

      <Group gap="xs" mb="xs">
        <IconMapPin size={16} />
        <Text fz="sm">{g.address}</Text>
      </Group>

      <Group gap="sm" mb="md">
        <Text fz="sm">- # of Floors</Text>
        <Text fz="sm">- Clearance</Text>
        <Text fz="sm">- Reference Locations</Text>
      </Group>

      <Group justify="space-between" className={classes.footer}>
        <Center>
          <Avatar src={MPALogo} size={24} radius="xl" mr="xs" />
          <Group gap={8} mr={0}>
            <Button size="xs" onClick={() => setShowMap((v) => !v)}>
              {showMap ? "Hide map" : "Directions"}
            </Button>
            <Button size="xs" variant="light" component="a" href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </Button>
          </Group>
        </Center>
      </Group>

      <Collapse in={showMap} transitionDuration={200}>
        <div style={{ marginTop: 12 }}>
          <MapEmbed address={g.address} />
        </div>
      </Collapse>
    </Card>
  );
}

// ---- list (carousel on mobile, grid otherwise) ----
export function GarageCards() {
  return (
    <Container size="lg" py="lg">
      {/* Mobile: carousel */}
      <Box hiddenFrom="sm">
        <Carousel
          withIndicators
          loop
          align="start"
          slideSize="100%"
          slideGap="sm"
          styles={{ viewport: { paddingLeft: 12, paddingRight: 12 } }}
        >
          {garages.map((g) => (
            <Carousel.Slide key={g.id} style={{ display: 'flex' }}>
              <GarageCard g={g} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>

      {/* ≥ sm: grid */}
      <Box visibleFrom="sm">
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: "sm", sm: "md", lg: "lg" }}
        >
          {garages.map((g) => (
            <GarageCard key={g.id} g={g} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
