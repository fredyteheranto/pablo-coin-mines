import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { useLocation } from "react-router-dom";
const ReferralLink = () => {
  const address = useAddress();

  const urlActual = window.location.origin;

  const [textoCopiar, setTextoCopiar] = useState();

  const copiarTextoAlPortapapeles = () => {
    navigator.clipboard
      .writeText(urlActual + "/?ref=" + address)
      .then(() => {
        alert("Texto copiado al portapapeles");
      })
      .catch((err) => {
        //////console.error("Error al copiar el texto:", err);
      });
  };

  return (
    <div>
      <div className="w-full text-center">Referall LINK</div>
      <div className=" justify-center mt-8  gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <div className="relative flex-1 flex items-center flex-col ">
          <input
            type="text"
            placeholder="Type here"
            readOnly
            className="input input-bordered"
            value={urlActual + "/?ref=" + address}
            onChange={(e) => setTextoCopiar(urlActual + "/?ref=" + address)}
          />
        </div>
        <div className="relative flex-1 flex items-center flex-col ">
          <button onClick={copiarTextoAlPortapapeles} className="btn btn-warning  btn-wide">
            Copy ref Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink;
