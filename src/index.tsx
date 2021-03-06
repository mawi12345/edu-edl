/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from 'serviceWorker';
import { Grommet, grommet, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'utils/history';
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { configureAppStore } from 'store/configureStore';

// Initialize languages
import './locales/i18n';

const theme: ThemeType = {
  global: {
    colors: {
      brand: '#126a94',
    },
    font: {
      family: 'Roboto',
    },
  },
};

const mergedTheme = deepMerge(grommet, theme);

const store = configureAppStore(history);
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <HelmetProvider>
        <Grommet theme={mergedTheme}>
          <React.StrictMode>
            <Component />
          </React.StrictMode>
        </Grommet>
      </HelmetProvider>
    </ConnectedRouter>
  </Provider>
);
const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app', './locales/i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    const App = require('./app').App;
    render(App);
  });
}

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
