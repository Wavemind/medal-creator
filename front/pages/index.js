/**
 * The external imports
 */
import React, { useMemo } from "react";
import {
  Heading,
  Stack,
  Box,
  Text,
  useColorMode,
  Button,
  Select,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

/**
 * The internal imports
 */
import { ShowMoreIcon, LogoutIcon, OverflowMenuIcon } from "../assets/icons";
import { DataTable } from "../components";

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const { t } = useTranslation("common");
  const router = useRouter();

  const tableData = useMemo(
    () => [
      {
        name: "Pneumonia",
        complaintCategory: "CC21 - General",
      },
      {
        name: "Deep wound",
        complaintCategory: "CC21 - General",
      },
      {
        name: "Low weight",
        complaintCategory: "CC21 - General",
      },
    ],
    []
  );

  const tableColumns = useMemo(
    () => [
      {
        accessorKey: "showMore",
        header: "",
        cell: _info => (
          <Button variant="ghost" onClick={() => console.log("show more")}>
            <ShowMoreIcon boxSize={6} />
          </Button>
        ),
      },
      {
        accessorKey: "name",
        header: () => <span>Name</span>,
        cell: info => info.getValue(),
      },
      {
        accessorKey: "complaintCategory",
        header: () => "Complaint category",
        cell: info => info.getValue(),
      },
      {
        accessorKey: "openDecisionTree",
        header: () => {},
        cell: _info => (
          <Button width="auto" onClick={() => console.log("clicked")}>
            Open Decision Tree
          </Button>
        ),
      },
      {
        accessorKey: "menu",
        header: () => {},
        cell: _info => (
          <Button variant="ghost" onClick={() => console.log("menu clicked")}>
            <OverflowMenuIcon boxSize={6} />
          </Button>
        ),
      },
    ],
    []
  );

  /**
   * Changes the selected language
   * @param {*} e event object
   */
  const handleLanguageSelect = e => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: e.target.value.toLowerCase(),
    });
  };

  return (
    <Stack>
      <LogoutIcon boxSize={8} color="red.500" />
      <Heading variant="h1">{t("welcome")}</Heading>
      <Button size="sm" colorScheme="blue" onClick={toggleColorMode}>
        Toggle Mode
      </Button>

      <Select
        placeholder="Select language"
        onChange={handleLanguageSelect}
        defaultValue={router.locale}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </Select>
      <Box>
        <Text fontWeight="normal">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          risus nunc, egestas eu augue ut, aliquet porta elit. Donec nec nisl
          nunc. Nam pulvinar gravida nisl quis laoreet. Vivamus diam mi, maximus
          sed erat vitae, bibendum efficitur mi. Vivamus aliquam, mauris sit
          amet lacinia commodo, dui risus rhoncus enim, vitae laoreet ante justo
          et sapien. Vivamus quis bibendum urna. Sed placerat rutrum turpis, ut
          molestie magna sodales nec. Vestibulum blandit ipsum vitae ante
          dignissim, vel blandit lacus vestibulum. Curabitur euismod dolor sit
          amet erat vulputate, ac vehicula erat aliquet. Morbi pellentesque ac
          nibh sed posuere. In commodo vel velit congue tempus. Fusce sem nisi,
          blandit ac feugiat luctus, suscipit nec leo. Ut vulputate, velit eget
          eleifend feugiat, ipsum nibh efficitur eros, at aliquet felis lectus
          ut felis. Fusce finibus neque nec mauris condimentum, in laoreet nisl
          aliquet. Suspendisse facilisis ligula risus, nec pulvinar massa
          maximus vitae. Etiam porttitor mi vitae urna egestas, in accumsan
          nulla congue.
        </Text>
        <Text fontWeight="black">
          Proin euismod turpis eu scelerisque placerat. Phasellus pretium mi sit
          amet aliquet volutpat. Donec nisi erat, iaculis a aliquet nec,
          interdum vitae tortor. Aenean dui nisl, varius eget pellentesque id,
          lobortis sit amet neque. Nulla facilisi. Sed eros nisi, blandit quis
          volutpat quis, rhoncus at tellus. Sed nec ipsum ut neque convallis
          commodo sed vitae dolor. Fusce urna metus, dictum in magna in, varius
          pulvinar est. Praesent in libero vel nibh dictum laoreet sed non erat.
          Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin
          feugiat sem ut felis convallis placerat. Quisque id ligula ac purus
          facilisis tempor ac et purus.
        </Text>
      </Box>

      <DataTable source="diagnosis" data={tableData} />
    </Stack>
  );
}

// Also works with getStaticProps
export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
