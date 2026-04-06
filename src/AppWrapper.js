import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from './screens/Toast/ToastProvider';
import { ConfirmationProvider } from './screens/Modal/ConfirmationProvider';
import App from './App';

const Main = () => {
  return (
    <Router>
      <ConfirmationProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ConfirmationProvider>
    </Router>
  );
};

export default Main;
