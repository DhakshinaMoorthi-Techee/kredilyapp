import "./App.css";
import React, { useState } from "react";
import { Invoice } from "./data";
import Main from "./Components/Main";

export const MyContext = React.createContext();

function App() {
  const [invoiceDetails, setInvoiceDetails] = useState(Invoice);

  const updateInvoiceDetails = (value) => {
    setInvoiceDetails([...invoiceDetails, value]);
  };

  return (
    <MyContext.Provider value={[invoiceDetails, updateInvoiceDetails]}>
      <div className="App">
        <Main />
      </div>
    </MyContext.Provider>
  );
}

export default App;
