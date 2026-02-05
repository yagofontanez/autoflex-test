import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type {
  RawMaterial,
  RawMaterialCreate,
  RawMaterialUpdate,
} from "../../api/rawMaterials";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: RawMaterial | null;
  onClose: () => void;
  onSubmit: (payload: RawMaterialCreate | RawMaterialUpdate) => Promise<void>;
};

export function RawMaterialFormDialog({
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
      stockQuantity: initial?.stockQuantity ?? 0,
    }),
    [initial],
  );

  const [code, setCode] = useState(initialState.code);
  const [name, setName] = useState(initialState.name);
  const [stockQuantity, setStockQuantity] = useState<number>(
    initialState.stockQuantity,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCode(initialState.code);
    setName(initialState.name);
    setStockQuantity(initialState.stockQuantity);
  }, [initialState, open]);

  const canSave = isEdit
    ? name.trim().length > 0 && stockQuantity >= 0
    : code.trim().length > 0 && name.trim().length > 0 && stockQuantity >= 0;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      if (isEdit) {
        const payload: RawMaterialUpdate = { name: name.trim(), stockQuantity };
        await onSubmit(payload);
      } else {
        const payload: RawMaterialCreate = {
          code: code.trim(),
          name: name.trim(),
          stockQuantity,
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
      <DialogTitle>
        {isEdit ? "Edit raw material" : "New raw material"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isEdit}
            placeholder="RM001"
            fullWidth
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Steel"
            fullWidth
          />
          <TextField
            label="Stock quantity"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(Number(e.target.value))}
            inputProps={{ min: 0, step: 0.001 }}
            fullWidth
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
