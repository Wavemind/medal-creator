/**
 * The external imports
 */
import { extendTheme } from "@chakra-ui/react";

/**
 * The internal imports
 */
import globalStyles from "./styles";
import fonts from "./foundations/fonts";
import colors from "./foundations/colors";
import config from "./foundations/config";

export default extendTheme(
  config,
  colors,
  fonts,
  globalStyles,
);
