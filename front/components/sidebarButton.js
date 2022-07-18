/**
 * The external imports
 */
import React from "react";
import { VStack, Text, useTheme } from "@chakra-ui/react";

/**
 * The internal imports
 */

const SidebarButton = ({ icon, label, handleClick, active }) => {
  const { colors } = useTheme();

  return (
    <VStack
      onClick={active ? null : handleClick}
      width="100%"
      height="8vh"
      justifyContent="center"
      style={{ cursor: "pointer" }}
      borderLeftColor={colors.secondary}
      borderLeftWidth={active ? 4 : 0}
      borderLeftStyle="solid"
    >
      {icon}
      <Text
        fontSize="xs"
        color={active ? colors.secondary : colors.primary}
        fontWeight={active ? "bold" : "normal"}
        textAlign="center"
      >
        {label}
      </Text>
    </VStack>
  );
};

export default SidebarButton;
