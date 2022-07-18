/**
 * The external imports
 */
import { extendTheme } from "@chakra-ui/react";

/**
 * The internal imports
 */
import common from "./common";
import fonts from "./foundations/fonts";
import colors from "./foundations/colors";
import config from "./foundations/config";
import heading from "./overrides/heading";
import formLabel from "./overrides/formLabel";
import input from "./overrides/input";
import button from "./overrides/button";

export default extendTheme(
  config,
  colors,
  fonts,
  common,
  heading,
  formLabel,
  input,
  button
);
