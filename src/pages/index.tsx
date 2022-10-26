import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Dashboard from "../layout/dashboard";
import Clubes from "./Clubes";
import Eventos from "./Eventos";
import Home from "./Home";
import Membros from "./Membros";
import PopClube from "./PopClube";
import Presencas from "./Presencas";
import PrivateRoute from "./PrivateRoute";

function Pages() {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Home />} />
      <Route path="/pop" element={<PopClube />} />
      <Route
        path="/"
        element={<PrivateRoute element={<Dashboard usuario={usuario} />} />}
      >
        <Route path="clube">
          <Route index element={<PrivateRoute element={<Clubes />} />} />
          <Route path=":id" element={<PrivateRoute element={<Membros />} />} />
        </Route>
        <Route path="evento">
          <Route index element={<PrivateRoute element={<Eventos />} />} />
          <Route
            path=":id"
            element={<PrivateRoute element={<Presencas />} />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default Pages;
