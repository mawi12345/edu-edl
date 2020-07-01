/**
 *
 * AboutPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Box, Heading, Paragraph } from 'grommet';

interface Props {}

export function AboutPage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('about')}</title>
        <meta name="description" content={t('about')} />
      </Helmet>
      <Box flex justify="center" align="center" fill>
        <Heading>{t('about')}</Heading>
        <Paragraph>{t('aboutIntro')}</Paragraph>
      </Box>
    </>
  );
}
