'use client'; // 👈 this file runs on the client

import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvidersWrapper({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
