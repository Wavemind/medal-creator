/**
 * The external imports
 */
import { Heading, Stack, Box, Text, useColorMode, Button } from '@chakra-ui/react'

export default function Home() {
  const { toggleColorMode } = useColorMode();
  return (
    <Stack>
      <Heading as="h1" fontSize="35px" fontWeight="semibold">Hello !</Heading>
      <Button size="sm" colorScheme="blue" onClick={toggleColorMode}>
        Toggle Mode
      </Button>
      <Box>
        <Text fontSize="12px" fontWeight="regular">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum risus nunc, egestas eu augue ut, aliquet porta elit. Donec nec nisl nunc. Nam pulvinar gravida nisl quis laoreet. Vivamus diam mi, maximus sed erat vitae, bibendum efficitur mi. Vivamus aliquam, mauris sit amet lacinia commodo, dui risus rhoncus enim, vitae laoreet ante justo et sapien. Vivamus quis bibendum urna. Sed placerat rutrum turpis, ut molestie magna sodales nec. Vestibulum blandit ipsum vitae ante dignissim, vel blandit lacus vestibulum. Curabitur euismod dolor sit amet erat vulputate, ac vehicula erat aliquet. Morbi pellentesque ac nibh sed posuere. In commodo vel velit congue tempus. Fusce sem nisi, blandit ac feugiat luctus, suscipit nec leo. Ut vulputate, velit eget eleifend feugiat, ipsum nibh efficitur eros, at aliquet felis lectus ut felis. Fusce finibus neque nec mauris condimentum, in laoreet nisl aliquet. Suspendisse facilisis ligula risus, nec pulvinar massa maximus vitae. Etiam porttitor mi vitae urna egestas, in accumsan nulla congue.</Text>
        <Text>Proin euismod turpis eu scelerisque placerat. Phasellus pretium mi sit amet aliquet volutpat. Donec nisi erat, iaculis a aliquet nec, interdum vitae tortor. Aenean dui nisl, varius eget pellentesque id, lobortis sit amet neque. Nulla facilisi. Sed eros nisi, blandit quis volutpat quis, rhoncus at tellus. Sed nec ipsum ut neque convallis commodo sed vitae dolor. Fusce urna metus, dictum in magna in, varius pulvinar est. Praesent in libero vel nibh dictum laoreet sed non erat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin feugiat sem ut felis convallis placerat. Quisque id ligula ac purus facilisis tempor ac et purus.</Text>
        <Text>Nulla metus dui, fringilla non placerat non, pretium in libero. Donec aliquet nisl ipsum, eget blandit ligula blandit id. Suspendisse ut euismod magna, a convallis augue. Fusce ac ex ornare dui efficitur elementum id non quam. Sed magna nisi, rutrum a mattis vel, lobortis dictum urna. Praesent volutpat viverra sem, vitae rhoncus tellus commodo in. In in commodo tellus. Donec pretium consequat gravida. Morbi eu tempor nunc, quis hendrerit massa. Suspendisse potenti.</Text>
        <Text>Fusce nibh urna, varius ultrices iaculis a, fringilla at velit. Proin vehicula velit eget felis vestibulum, sed egestas sapien tempor. Aliquam erat volutpat. Vivamus ultrices magna vel cursus maximus. Sed sapien sapien, scelerisque a ultrices id, interdum ac ex. Vestibulum aliquet orci vel quam blandit euismod. Nam nulla nibh, tincidunt iaculis mollis non, viverra sed velit. Fusce rhoncus nisl non facilisis ornare. Phasellus dictum tellus sit amet felis facilisis vehicula sed a erat. Ut semper vehicula mauris quis fringilla. Praesent est nibh, tempus pulvinar mauris sed, varius ultrices velit. Nulla blandit, sapien ac blandit dapibus, mi orci porttitor mauris, id porttitor metus metus et nisi. Nunc cursus, magna in commodo venenatis, nibh nunc scelerisque purus, in convallis sapien justo vitae arcu. Donec vel blandit risus, eu luctus mi. Duis sit amet massa eu justo varius tincidunt a eu enim. Nunc sodales congue mi, in molestie lacus dictum non.</Text>
        <Text>Sed euismod nunc nisl, id egestas massa egestas et. Sed sagittis faucibus mi, vel mattis mauris condimentum dignissim. Vestibulum quis massa congue lacus luctus tempor. Pellentesque tristique leo ac lorem ultricies eleifend. Aliquam scelerisque sit amet risus ultrices eleifend. Nulla scelerisque lorem orci, eget dictum diam pellentesque non. Nam tempus id arcu et ultricies.</Text>
      </Box>
    </Stack >
  )
}
