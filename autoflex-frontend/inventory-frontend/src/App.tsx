import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { TopNav } from "./components/TopNav";
import { ProductsPage } from "./pages/products/ProductsPage";

export default function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Container sx={{ mt: 3, mb: 6 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          {/* <Route path="/raw-materials" element={<RawMaterialsPage />} />
          <Route path="/production" element={<ProductionPage />} /> */}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
