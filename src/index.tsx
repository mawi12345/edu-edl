import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Grommet, grommet, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from './app/index';

import { HelmetProvider } from 'react-helmet-async';

import { store } from './store';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
      <HelmetProvider>
        <Grommet theme={mergedTheme}>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </Grommet>
      </HelmetProvider>
  </Provider>
);

