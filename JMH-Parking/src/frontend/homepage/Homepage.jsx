import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { GarageCards } from "./components/GarageCards";
import { BackgroundImage, Overlay, Container, Title, Image, Text } from "@mantine/core";
import classes from "./styles/homepage.module.css";
import CampusMap from "../images/CampusMap.jpg";

export default function Homepage() {
    return (
        <>
            <Header />
            <Hero />

            <BackgroundImage
                src="https://images.squarespace-cdn.com/content/v1/5f2453bea051b1314d8043aa/96790d5f-d392-4593-82e9-7e3d5c5764eb/JHS_Location_JacksonMemorial_Header-1.jpg"
                radius="sm"
                style={{
                    position: "relative",
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Overlay
                    gradient="linear-gradient(145deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 100%)"
                    blur={5}
                    opacity={0.95}
                    zIndex={1}
                />

                <Container size="lg" style={{ position: "relative", zIndex: 2, color: "white" }}>
                    <div
                        style={{
                            textAlign: "center",
                            padding: "1rem 1rem",
                            borderRadius: 8,
                            background: "rgba(255, 0, 0, 0.20)",
                            backdropFilter: "blur(1px)",
                            marginBottom: "1.25rem",
                            marginTop: "1.25rem",
                            border: "1px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        🚧 <strong>Construction Notice:</strong>
                        <Text c="black" fz="md">TO BE COMPLETED</Text>
                    </div>
                    <Container size="lg" className={classes.homeContainer} >

                        <div >
                            <Title className={classes.homeTitle} order={1}>
                                    Our Garages
                            </Title>
                            <GarageCards />
                        </div>
                    </Container>
                    <Container size="lg" className={classes.homeContainer} >
                        <div>
                            <Title className={classes.homeTitle} >Our Campus Map</Title>
                            {/* <CampusMap /> */}
                            <Image src={CampusMap} />

                        </div>
                    </Container>
                    <Container size="lg" className={classes.homeContainer} >


                        <div>
                            <Title className={classes.homeTitle} >Our Rates</Title>
                            {/* <RatesTable /> */}
                            <Text c="black" fz="md">TO BE COMPLETED</Text>
                        </div>
                    </Container>
                    <Container size="lg" className={classes.homeContainer} >

                        <div>
                            <Title className={classes.homeTitle} >Where To Find Us</Title>
                            {/* <ContactSection /> */}
                            <Text c="black" fz="md">TO BE COMPLETED</Text>
                        </div>
                    </Container>
                </Container>
            </BackgroundImage>
        </>
    );
}
