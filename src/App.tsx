import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Viandas from "./pages/Viandas";
import PizzaParty from "./pages/PizzaParty";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/components/ui/toaster";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="viandas" element={<Viandas />} />
          <Route path="pizza-party" element={<PizzaParty />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="admin/panel" element={<AdminPanel />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
