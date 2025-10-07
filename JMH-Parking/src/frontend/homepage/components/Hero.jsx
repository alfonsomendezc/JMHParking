import cx from 'clsx';
import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import classes from '../styles/hero.module.css';

export function Hero() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.90} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Your Parking Solutions {' '}
          <Text component="span" inherit className={classes.highlight}>
             at Jackson Memorial Hospital
          </Text>
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Access our website to easily apply for a monthly parking account, find specific garage information, our contact information, and more! 
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} variant="white" size="lg">
            Apply
          </Button>
          <Button className={cx(classes.control, classes.secondaryControl)} size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}