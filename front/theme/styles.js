/**
 * The external imports
 */
import { mode } from "@chakra-ui/theme-tools";

export default {
  styles: {
    global: (props) => ({
      body: {
        bg: mode("white", "gray.800")(props),
      },
      h1: {
        color: mode("black", "gray.200")(props),
        fontSize: "5xl"
      }
    }),
  }
};
