"use client"
import React, { createContext, useState, useContext } from 'react';

const InviteContext = createContext();

export const InviteProvider = ({ children }) => {
  const [inviteSent, setInviteSent] = useState(false);

  const value = {
    inviteSent,
    setInviteSent,
  };

  return (
    <InviteContext.Provider value={value}>
      {children}
    </InviteContext.Provider>
  );
};

export const useInvite = () => useContext(InviteContext);
