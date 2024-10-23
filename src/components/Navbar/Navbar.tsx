"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import {
  IconHome2,
  IconCamera,
  IconUser,
  IconFiles,
  IconPumpkinScary,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { MenuOptions } from "./MenuOptions";
import { useUserContext } from "hooks/useUserContext";
import { useEffect } from "react";
import { axiosInterceptors } from "helpers/axios";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  url?: string;
}

function NavbarLink({ icon: Icon, label, active, url }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        className={classes.link}
        data-active={active || undefined}
        component={Link}
        href={`${url}`}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function Navbar() {
  axiosInterceptors();
  const { handleGetUser, user } = useUserContext();
  const mockdata = [
    { icon: IconHome2, label: "Feed", url: "/" },
    { icon: IconCamera, label: "Editor", url: "/editor" },
    { icon: IconUser, label: "Account", url: `/@${user?.username}` },
    { icon: IconFiles, label: "My Files", url: "/account/my-files" },
  ];
  const pathname = usePathname();
  const links = mockdata.map((link) => (
    <NavbarLink {...link} key={link.label} active={pathname === link.url} />
  ));

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <>
      <div className="w-[90px]" />

      <nav className={classes.navbar}>
        <Center>
          <Link href={"/"}>
            <IconPumpkinScary size={40} stroke={1.5} />
          </Link>
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
          <MenuOptions />
        </Stack>
      </nav>
    </>
  );
}
