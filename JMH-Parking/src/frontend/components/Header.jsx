import { useState } from 'react';
import {
  Burger,
  Container,
  Group,
  Drawer,
  Stack,
  Button,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '/workspaces/JMHParking/JMH-Parking/src/styles/header.module.css';
import MPALogo from '../images/MPAlogo.png';


const NAV_ITEMS = [
  { key: 'apply', label: 'Apply', href: '/apply' },
  { key: 'contact', label: 'Contact Us', href: '/contact-us' },
  { key: 'login', label: 'Log In', href: '/log-in' },
];

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState('apply');
  const { colorScheme } = useMantineColorScheme();

  const handleNavClick = (key) => {
    setActive(key);
    close();
  };

  return (
    <header className={classes.header} withBorder={false}>
      <Container size="lg" className={classes.inner}>
        <a href="/" className={classes.brandWrap} aria-label="Home">
          <img
            src={MPALogo}
            className={classes.logoHeader}
            alt="Miami Parking Authority logo"
          />
          <span className={classes.brand}>Miami Parking Authority</span>
        </a>

        {/* Desktop Navigation */}
        <Group gap="xs" visibleFrom="sm" aria-label="Main navigation">
          {NAV_ITEMS.map((n) => (
            <Button
              key={n.key}
              component="a"
              href={n.href}
              size="sm"
              variant={active === n.key ? 'filled' : 'subtle'}
              color={colorScheme === 'dark' ? 'blue.4' : 'blue'}
              data-active={active === n.key}
              aria-current={active === n.key ? 'page' : undefined}
              className={classes.navBtn}
              onClick={() => handleNavClick(n.key)}
            >
              {n.label}
            </Button>
          ))}
        </Group>

        {/* Burger icon for mobile */}
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
          color="white"
          className={classes.burgerRight}
          aria-label="Toggle navigation menu"
        />
      </Container>

      {/* Subtle divider line */}
      <div className={classes.headerShadow} />

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        padding="md"
        size="xs"
        hiddenFrom="sm"
        title="Menu"
        overlayProps={{ opacity: 0.2, blur: 4 }}
      >
        <Stack gap="xs">
          {NAV_ITEMS.map((n) => (
            <Button
              key={n.key}
              component="a"
              href={n.href}
              size="md"
              variant={active === n.key ? 'filled' : 'subtle'}
              color={colorScheme === 'dark' ? 'blue.4' : 'blue'}
              onClick={() => handleNavClick(n.key)}
            >
              {n.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </header>
  );
}
