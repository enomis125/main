import React, { createContext, useContext, useState } from 'react';

const AcessoContext = createContext();

export const useAcesso = () => useContext(AcessoContext);

export const AcessoProvider = ({ children }) => {
  const [acessos, setAcessos] = useState([]);

  return (
    <AcessoContext.Provider value={{ acessos, setAcessos }}>
      {children}
    </AcessoContext.Provider>
  );
};
