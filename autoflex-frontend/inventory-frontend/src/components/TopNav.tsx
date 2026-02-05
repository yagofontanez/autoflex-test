import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export function TopNav() {
  const { pathname } = useLocation();

  const linkStyle = (path: string) => ({
    color: "white",
    textDecoration: "none",
    fontWeight: pathname === path ? 700 : 400,
  });

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Inventory
        </Typography>

        <Button component={Link} to="/products" sx={linkStyle("/products")}>
          Products
        </Button>
        <Button
          component={Link}
          to="/raw-materials"
          sx={linkStyle("/raw-materials")}
        >
          Raw Materials
        </Button>
        <Button component={Link} to="/production" sx={linkStyle("/production")}>
          Production
        </Button>
      </Toolbar>
    </AppBar>
  );
}
