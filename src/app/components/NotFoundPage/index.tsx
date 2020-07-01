import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CircleQuestion } from 'grommet-icons';
import { Text, Box, Heading } from 'grommet';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Box alignSelf={'center'}>
        <Heading level={1} size={'large'}>
          4<CircleQuestion size={'large'} />4
        </Heading>
      </Box>
      <Box alignSelf={'center'}>
        <Text size={'large'}>Page not found.</Text>
      </Box>
    </>
  );
}
