import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FeatureCards } from "./components/GarageCards";
import classes from "./styles/homepage.module.css";

export default function Homepage() {
    return (
        <>
            <Header />
            <Hero />
            <div style={{textAlign: "center"}}>
                !!! Notification for construction
            </div>
            <div className={classes.title}>
                Our Garages
                <FeatureCards />
            </div>
            <div className={classes.title}>
                Our Campus Map
            </div>
            <div className={classes.title}>
                Our Campus Map
            </div>
        </>
    );
}