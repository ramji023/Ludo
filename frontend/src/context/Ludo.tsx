import React, { createContext, type ReactElement } from "react";
import { useState } from "react";

interface ludoStateType {
  [key: string]: unknown;
}

interface ludoContextType {
  ludoState: ludoStateType | null;
  setLudoState: React.Dispatch<React.SetStateAction<ludoStateType | null>>;
}

export const ludoStateContext = React.createContext<
  ludoContextType | undefined
>(undefined);

export const LudoStateContextProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [ludoState, setLudoState] = useState<ludoStateType | null>(null);

  return (
    <ludoStateContext.Provider value={{ ludoState, setLudoState }}>
      {children}
    </ludoStateContext.Provider>
  );
};
