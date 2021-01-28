/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route } from 'react-router-dom';
import { push } from 'connected-react-router';
import { GlobalStyle } from 'styles/global-styles';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { HomePage } from './containers/HomePage/Loadable';
import { AboutPage } from './containers/AboutPage/Loadable';
import { ErrorPage } from './components/ErrorPage/Loadable';
import { SelectPage } from './containers/SelectPage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { Box, Footer, Main, Text, Button } from 'grommet';
import { Github, DocumentText } from 'grommet-icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { sliceKey, reducer, actions } from './slice';
import { appSaga } from './saga';

const DropTarget = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export function App() {
  const { t } = useTranslation();
  useInjectReducer({ key: sliceKey, reducer: reducer });
  const dispatch = useDispatch();
  useInjectSaga({ key: sliceKey, saga: appSaga });

  const onDrop = React.useCallback(
    acceptedFiles => {
      const [file] = acceptedFiles;
      dispatch(actions.readBlob(file as Blob));
    },
    [dispatch],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

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
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/error" component={ErrorPage} />
            <Route exact path="/select" component={SelectPage} />
            <Route exact path="/about" component={AboutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Main>
        <Footer
          background="light-3"
          pad="small"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Box
            align="center"
            direction="row"
            gap="xsmall"
            onClick={() => dispatch(push('/'))}
          >
            <DocumentText color="brand" size="medium" />
            <Text alignSelf="center" color="brand" size="small">
              {t('heading')}
            </Text>
          </Box>
          <Box direction="row" gap="xxsmall" justify="center">
            {/*
            <Button
              hoverIndicator="light-1"
              onClick={() => dispatch(push('/about'))}
            >
              <Box pad="small" direction="row" align="center" gap="small">
                <Info />
                <Text size="small">{t('about')}</Text>
              </Box>
            </Button>
            */}
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
