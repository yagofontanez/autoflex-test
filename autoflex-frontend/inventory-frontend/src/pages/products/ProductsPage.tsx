import { useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type Product,
  type ProductCreate,
  type ProductUpdate,
} from "../../api/products";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getErrorMessage } from "../../api/error";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ProductFormDialog } from "./ProductFormDialog";

export function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Product | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.code.localeCompare(b.code)),
    [items],
  );

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const data = await listProducts();
      setItems(data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setMode("create");
    setSelected(null);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setMode("edit");
    setSelected(p);
    setDialogOpen(true);
  }

  async function handleSubmit(payload: ProductCreate | ProductUpdate) {
    setError(null);

    try {
      if (mode === "create") {
        await createProduct(payload as ProductCreate);
      } else if (selected) {
        await updateProduct(selected.id, payload as ProductUpdate);
      }

      await refresh();
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    }
  }

  async function handleDelete(p: Product) {
    setDeleting(true);
    setError(null);

    try {
      await deleteProduct(p.id);
      setConfirmDelete(null);
      await refresh();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage products (code, name, price)
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
        >
          New
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined" sx={{ p: 2 }}>
        {loading ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={20} />
            <Typography>Loading...</Typography>
          </Stack>
        ) : sorted.length === 0 ? (
          <Typography>No products yet.</Typography>
        ) : (
          <Stack spacing={1}>
            {sorted.map((p) => (
              <Paper
                key={p.id}
                variant="outlined"
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ minWidth: 220 }}>
                  <Typography fontWeight={700}>
                    {p.code} - {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: {Number(p.price).toFixed(2)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="edit" onClick={() => openEdit(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => setConfirmDelete(p)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <ProductFormDialog
        open={dialogOpen}
        mode={mode}
        initial={selected}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete product "{confirmDelete?.code} -{" "}
            {confirmDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => confirmDelete && handleDelete(confirmDelete)}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
