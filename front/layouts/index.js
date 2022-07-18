/**
 * The external imports
 */
import React from "react";
import { useTranslation } from "next-i18next";
import {
  Flex,
  Image,
  useTheme,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Box,
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import { UserIcon } from "../assets/icons";
import { Sidebar } from "../components";

const Layout = ({ children }) => {
  const { colors } = useTheme();
  const { t } = useTranslation("common");

  return (
    <div>
      <Flex
        bg={colors.primary}
        height="8vh"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        paddingRight={5}
        paddingLeft={5}
      >
        <Image src={"/logo.svg"} alt="logo" height="6vh" />
        <Menu>
          <MenuButton as={IconButton} flex={0}>
            <UserIcon boxSize={6} />
          </MenuButton>
          <MenuList>
            <MenuItem>Information</MenuItem>
            <MenuItem>Password</MenuItem>
            <MenuItem>Projects</MenuItem>
            <MenuDivider marginLeft={3} marginRight={3} />
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Flex width="100%" minHeight="92vh">
        <Sidebar />
        <Box padding={10}>{children}</Box>
      </Flex>
    </div>
  );
};

export default Layout;
