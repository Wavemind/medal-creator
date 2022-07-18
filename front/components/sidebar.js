/**
 * The external imports
 */
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Image, useTheme, VStack, Box } from "@chakra-ui/react";

/**
 * The internal imports
 */
import {
  LogoutIcon,
  FaqIcon,
  AlgorithmsIcon,
  LibraryIcon,
  RecentIcon,
} from "../assets/icons";
import { SidebarButton } from "../components";

const Sidebar = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation("common");

  const sidebarItems = useMemo(
    () => [
      { key: "algorithms", icon: <AlgorithmsIcon boxSize={10} /> },
      { key: "library", icon: <LibraryIcon boxSize={10} /> },
      { key: "recent", icon: <RecentIcon boxSize={6} /> },
    ],
    []
  );

  return (
    <VStack
      justifyContent="space-between"
      bg={colors.sidenav}
      paddingBottom={20}
      paddingTop={5}
    >
      <VStack width={118} spacing={10}>
        <SidebarButton
          // Get a better dynamic icon cos I can't change the color of this one
          icon={<Image src={"/logoDynamic.svg"} alt="logo" height="4vh" />}
          label="Dynamic Tanzania"
          handleClick={() => router.push("/")}
          active={router.pathname === "/"}
        />
        {sidebarItems.map(item => (
          <SidebarButton
            icon={item.icon}
            label={t(item.key)}
            handleClick={() => router.push(`/${item.key}`)}
            active={router.pathname.startsWith(item.key)}
          />
        ))}
      </VStack>
      <VStack width={118} spacing={10}>
        <SidebarButton
          icon={<FaqIcon boxSize={6} />}
          label={t("faq")}
          handleClick={() => router.push("/faq")}
          active={router.pathname.startsWith("/faq")}
        />
        <SidebarButton
          icon={<LogoutIcon boxSize={6} />}
          label={t("logout")}
          handleClick={() => console.log("logout")}
        />
      </VStack>
    </VStack>
  );
};

export default Sidebar;
