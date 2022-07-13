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
import Heading from "./components/heading";

export default extendTheme(
  config,
  colors,
  fonts,
  common,
  Heading
);
