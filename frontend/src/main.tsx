import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import App from './pages/App';
import './styles.css';

const theme = {
  palette: {
    primary: '#1565c0',
    secondary: '#ef6c00',
    surface: '#f5f7fa'
  },
  spacing: (multiplier: number) => `${multiplier * 8}px`
} as const;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
