import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalStyle } from '../styles/global-styles';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { HomePage } from './HomePage';
import { ErrorPage } from './ErrorPage';
import { SelectPage } from './SelectPage';
import { Box, Footer, Main, Text, Button } from 'grommet';
import { Github, DocumentText } from 'grommet-icons';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { actions } from './slice';
import { selectRoute } from './selectors';
import { useAppDispatch } from '../store';

const DropTarget = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export function App() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onDrop = React.useCallback(
    (acceptedFiles: Blob[]) => {
      const [file] = acceptedFiles;
      dispatch(actions.readBlob(file));
    },
    [dispatch],
  );
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
  });

  const route = useSelector(selectRoute);

  return (
    <>
      <Helmet
        titleTemplate={`%s - ${t('heading')}`}
        defaultTitle={t('heading')}
      >
        <meta name="description" content="Generate EDL files" />
      </Helmet>
      <DropTarget {...getRootProps()}>
        <Main
          background={isDragActive ? 'light-2' : 'light-1'}
          elevation="large"
          gap="large"
        >
          {route === 'home' && <HomePage openFileDialog={open} />}
          {route === 'select' && <SelectPage openFileDialog={open} />}
          {route === 'error' && <ErrorPage openFileDialog={open} />}

        </Main>
        <Footer
          background="light-3"
          pad="small"
        >
          <Box
            align="center"
            direction="row"
            gap="xsmall"
          >
            <DocumentText color="brand" size="medium" />
            <Text alignSelf="center" color="brand" size="small">
              {t('heading')}
            </Text>
          </Box>
          <Box direction="row" gap="xxsmall" justify="center">
            <Button
              hoverIndicator="light-1"
              onClick={() =>
                (window.location.href = 'https://github.com/mawi12345/edu-edl')
              }
            >
              <Box pad="small" direction="row" align="center" gap="small">
                <Github />
                <Text size="small">Github</Text>
              </Box>
            </Button>
          </Box>
          <Text textAlign="center" size="xsmall">
            © {new Date().getFullYear()} Martin Wind
          </Text>
        </Footer>
        <input {...getInputProps()} />
      </DropTarget>
      <GlobalStyle />
    </>
  );
}
