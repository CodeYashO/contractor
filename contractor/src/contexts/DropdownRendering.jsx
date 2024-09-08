"use client";
import React, { createContext, useState, useContext } from "react";

export const DropdownContext = createContext({
  dropdownOpen: null,
  toggleDropdown: () => {},
});

export function DropdownProvider({ children }) {
  const [dropdownOpen, setdropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setdropdownOpen(true);
  };

  const value = {
    dropdownOpen,
    toggleDropdown,
  };

  return (
    <DropdownContext.Provider value={value}>
      {children}
    </DropdownContext.Provider>
  );
}
