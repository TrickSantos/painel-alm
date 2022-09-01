import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Dashboard from "../layout/dashboard";
import Clubes from "./Clubes";
import Eventos from "./Eventos";
import Home from "./Home";
import Membros from "./Membros";

function Pages() {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Home />} />
      <Route path="/" element={<Dashboard usuario={usuario} />}>
        <Route path="clube">
          <Route index element={<Clubes />} />
          <Route path=":id" element={<Membros />} />
        </Route>
        <Route path="evento" element={<Eventos />} />
      </Route>
    </Routes>
  );
}

export default Pages;
