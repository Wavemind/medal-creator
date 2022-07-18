/**
 * The external imports
 */
import React from "react";
import { useTranslation } from "next-i18next";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react";

/**
 * The internal imports
 */
import { UserIcon } from "../assets/icons";

const UserMenu = () => {
  const { t } = useTranslation("common");
  
  return (
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
  );
};

export default UserMenu;
