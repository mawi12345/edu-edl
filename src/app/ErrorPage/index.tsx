import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { DocumentMissing } from "grommet-icons";
import { Text, Box, Heading, Button } from "grommet";

interface ErrorProps {
  openFileDialog: () => void;
}

export function ErrorPage({openFileDialog}: ErrorProps) {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("error")}</title>
        <meta name="description" content={t("errorInfo")} />
      </Helmet>
      <Box width={{ max: "500px" }} alignSelf={"center"}>
        <Heading textAlign={"center"} level={1} size={"medium"}>
          {t("error")}
        </Heading>
      </Box>
      <Box margin={{ bottom: "22px" }} alignSelf={"center"}>
        <DocumentMissing size={"large"} />
      </Box>
      <Box width={{ max: "500px" }} alignSelf={"center"}>
        <Text textAlign={"center"} size={"large"}>
          {t("errorInfo")}
        </Text>
      </Box>
      <Box align="center" pad="medium">
        <Button label={t("selectDifferentFile")} onClick={openFileDialog} />
      </Box>
    </>
  );
}
