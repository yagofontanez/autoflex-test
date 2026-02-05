import { useEffect, useMemo, useState } from "react";
import type { Product, ProductCreate, ProductUpdate } from "../../api/products";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (payload: ProductCreate | ProductUpdate) => Promise<void>;
};

export function ProductFormDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const isEdit = mode === "edit";

  const initialState = useMemo(
    () => ({
      code: initial?.code ?? "",
      name: initial?.name ?? "",
      price: initial?.price ?? 0,
    }),
    [initial],
  );

  const [code, setCode] = useState(initialState.code);
  const [name, setName] = useState(initialState.name);
  const [price, setPrice] = useState<number>(initialState.price);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCode(initialState.code);
    setName(initialState.name);
    setPrice(initialState.price);
  }, [initialState, open]);

  const canSave = isEdit
    ? name.trim().length > 0 && price > 0
    : code.trim().length > 0 && name.trim().length > 0 && price > 0;

  async function handleSave() {
    if (!canSave) return;

    setSaving(true);
    try {
      if (isEdit) {
        const payload: ProductUpdate = { name: name.trim(), price };
        await onSubmit(payload);
      } else {
        const payload: ProductCreate = {
          code: code.trim(),
          name: name.trim(),
          price,
        };
        await onSubmit(payload);
      }

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Product" : "New Product"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isEdit}
            placeholder="P001"
            fullWidth
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Notebook Gamer"
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            inputProps={{ min: 0, step: 0.01 }}
            placeholder="2500.00"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
