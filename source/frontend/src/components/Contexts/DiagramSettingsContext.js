import React, {createContext, useContext, useReducer} from 'react';

export const DiagramSettingsContext = createContext();
export const DiagramSettingsProvider = ({reducer, initialState, children}) =>(
  <DiagramSettingsContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </DiagramSettingsContext.Provider>
);
export const useDiagramSettingsState = () => useContext(DiagramSettingsContext);