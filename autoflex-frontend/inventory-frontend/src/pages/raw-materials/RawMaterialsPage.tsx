import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  createRawMaterial,
  deleteRawMaterial,
  listRawMaterials,
  updateRawMaterial,
  type RawMaterial,
  type RawMaterialCreate,
  type RawMaterialUpdate,
} from "../../api/rawMaterials";
import { getErrorMessage } from "../../api/error";
import { RawMaterialFormDialog } from "./RawMaterialFormDialog";

export function RawMaterialsPage() {
  const [items, setItems] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<RawMaterial | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<RawMaterial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.code.localeCompare(b.code)),
    [items],
  );

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listRawMaterials();
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

  function openEdit(rm: RawMaterial) {
    setMode("edit");
    setSelected(rm);
    setDialogOpen(true);
  }

  async function handleSubmit(payload: RawMaterialCreate | RawMaterialUpdate) {
    setError(null);
    try {
      if (mode === "create") {
        await createRawMaterial(payload as RawMaterialCreate);
      } else if (selected) {
        await updateRawMaterial(selected.id, payload as RawMaterialUpdate);
      }
      await refresh();
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    }
  }

  async function handleDelete(rm: RawMaterial) {
    setDeleting(true);
    setError(null);
    try {
      await deleteRawMaterial(rm.id);
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
            Raw Materials
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage raw materials (code, name, stock quantity)
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
          <Typography color="text.secondary">No raw materials yet.</Typography>
        ) : (
          <Stack spacing={1}>
            {sorted.map((rm) => (
              <Paper
                key={rm.id}
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
                <Box sx={{ minWidth: 260 }}>
                  <Typography fontWeight={700}>
                    {rm.code} — {rm.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {Number(rm.stockQuantity).toFixed(3)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="edit" onClick={() => openEdit(rm)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => setConfirmDelete(rm)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <RawMaterialFormDialog
        open={dialogOpen}
        mode={mode}
        initial={selected}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Delete raw material</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <b>{confirmDelete?.code}</b>?
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
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
