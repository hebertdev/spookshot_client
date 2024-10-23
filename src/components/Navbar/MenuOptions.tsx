import { useState } from "react";

import { deleteToken } from "helpers/auth";
import { deleteTokenAPI } from "services/accounts";

import { Menu, Text, rem, Tooltip, UnstyledButton } from "@mantine/core";
import { IconSearch, IconTrash, IconMenuDeep } from "@tabler/icons-react";

import classes from "./Navbar.module.css";
import { showNotification } from "components/Notifications";

import { DarkModeToggle } from "./DarkModeToggle";

export function MenuOptions() {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await deleteTokenAPI();
      deleteToken();
      window.location.href = "/";
    } catch (e) {
      setLoading(false);
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Tooltip
          label={"Options"}
          position="right"
          transitionProps={{ duration: 0 }}
        >
          <UnstyledButton className={classes.link}>
            <IconMenuDeep
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>

        <DarkModeToggle />

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          onClick={handleLogout}
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
        >
          {loading ? "loading..." : "Logout"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
