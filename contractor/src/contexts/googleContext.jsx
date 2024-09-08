"use client"

import React, { createContext, useState,} from "react";

export const GoogleButtonContext = createContext({
    googleButton : null,
    addgoogleButton : () => {}
});

export function GoogleButtonProvider({ children }) {

    const [googleButton , setgoogleButton] = useState(false);

    const addgoogleButton = (val) => {
        setgoogleButton(val);
    }

    const value = {
      googleButton,
      addgoogleButton,
    };
  
    return (
      <GoogleButtonContext.Provider value={value}> {children} </GoogleButtonContext.Provider>
    );
  }