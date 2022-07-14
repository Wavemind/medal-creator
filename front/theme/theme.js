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
import heading from "./components/heading";
import formLabel from "./components/formLabel";
import input from "./components/input";
import button from "./components/button";

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
