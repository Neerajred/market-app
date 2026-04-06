import React, { createContext, useContext, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ConfirmationContext = createContext();

export const useConfirmation = () => useContext(ConfirmationContext);

export const ConfirmationProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const askConfirm = ({ title, message, onConfirm }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await onConfirm();
        setModalState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirm = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmationContext.Provider value={{ askConfirm }}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeConfirm}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
    </ConfirmationContext.Provider>
  );
};
