// DataContext.js
import React, { createContext, useContext, useState } from "react";

const FormDataContext = createContext();
const FormData2Context = createContext();

export function useFormData() {
  return useContext(FormDataContext);
}

export function useFormData2() {
  return useContext(FormData2Context);
}

export function DataContextProvider({ children }) {
  const [formData, setFormData] = useState([]);
  const [formData2, setFormData2] = useState([]);

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      <FormData2Context.Provider value={{ formData2, setFormData2 }}>{children}</FormData2Context.Provider>
    </FormDataContext.Provider>
  );
}
