/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useMemo, useState } from "react";

import {
  addProductMaterial,
  deleteProductMaterial,
  listProductMaterials,
  updateProductMaterial,
  type ProductMaterial,
} from "../../../api/productMaterials";
import { listRawMaterials, type RawMaterial } from "../../../api/rawMaterials";
import { getErrorMessage } from "../../../api/error";

type Props = {
  productId: number;
  productName: string;
  productCode?: string;
  open: boolean;
  onClose: () => void;
};

export function ProductMaterialsDialog({
  productId,
  productName,
  productCode,
  open,
  onClose,
}: Props) {
  const [items, setItems] = useState<ProductMaterial[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rawMaterialId, setRawMaterialId] = useState<number | "">("");
  const [requiredQuantity, setRequiredQuantity] = useState<number>(0);

  const [drafts, setDrafts] = useState<Record<number, number>>({});

  const rawMaterialOptions = useMemo(() => {
    const used = new Set(items.map((i) => i.rawMaterialId));
    return rawMaterials.filter((rm) => !used.has(rm.id));
  }, [items, rawMaterials]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [materials, rms] = await Promise.all([
        listProductMaterials(productId),
        listRawMaterials(),
      ]);
      setItems(materials);
      setRawMaterials(rms);

      const nextDrafts: Record<number, number> = {};
      for (const pm of materials)
        nextDrafts[pm.id] = Number(pm.requiredQuantity);
      setDrafts(nextDrafts);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) refresh();
    if (!open) {
      setRawMaterialId("");
      setRequiredQuantity(0);
      setError(null);
    }
  }, [open]);

  const canAdd = rawMaterialId !== "" && requiredQuantity > 0;

  async function handleAdd() {
    if (!canAdd) return;
    setBusy(true);
    setError(null);
    try {
      await addProductMaterial(productId, {
        rawMaterialId: rawMaterialId as number,
        requiredQuantity,
      });
      setRawMaterialId("");
      setRequiredQuantity(0);
      await refresh();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  function rowIsDirty(pm: ProductMaterial) {
    const d = drafts[pm.id];
    return typeof d === "number" && d > 0 && d !== Number(pm.requiredQuantity);
  }

  async function handleSave(pm: ProductMaterial) {
    const value = drafts[pm.id];
    if (!value || value <= 0) return;

    setBusy(true);
    setError(null);
    try {
      await updateProductMaterial(productId, pm.id, {
        requiredQuantity: value,
      });
      await refresh();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(pm: ProductMaterial) {
    setBusy(true);
    setError(null);
    try {
      await deleteProductMaterial(productId, pm.id);
      await refresh();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={0.5}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="h6" fontWeight={800}>
              Bill of Materials
            </Typography>
            {productCode && <Chip size="small" label={productCode} />}
            <Chip size="small" variant="outlined" label={`#${productId}`} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {productName}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography fontWeight={700}>Add raw material</Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <TextField
                  select
                  label="Raw material"
                  value={rawMaterialId}
                  onChange={(e) => setRawMaterialId(Number(e.target.value))}
                  fullWidth
                >
                  {rawMaterialOptions.length === 0 ? (
                    <MenuItem value="" disabled>
                      No available raw materials
                    </MenuItem>
                  ) : (
                    rawMaterialOptions.map((rm) => (
                      <MenuItem key={rm.id} value={rm.id}>
                        {rm.code} — {rm.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>

                <TextField
                  label="Required quantity"
                  type="number"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(Number(e.target.value))}
                  inputProps={{ min: 0, step: 0.001 }}
                  fullWidth
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  disabled={!canAdd || busy}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Add
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Tip: quantities are per 1 unit of product.
              </Typography>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={700}>
                  Materials in this product
                </Typography>
                <Chip size="small" label={`${items.length} item(s)`} />
              </Stack>
            </Box>

            <Divider />

            {loading ? (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ p: 2 }}
              >
                <CircularProgress size={18} />
                <Typography>Loading...</Typography>
              </Stack>
            ) : items.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography color="text.secondary">
                  No materials linked yet. Add one above.
                </Typography>
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Raw material</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 200 }}>
                      Required qty
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, width: 120 }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((pm) => (
                    <TableRow key={pm.id} hover>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography fontWeight={700}>
                            {pm.rawMaterialCode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pm.rawMaterialName}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={drafts[pm.id] ?? Number(pm.requiredQuantity)}
                          onChange={(e) =>
                            setDrafts((d) => ({
                              ...d,
                              [pm.id]: Number(e.target.value),
                            }))
                          }
                          inputProps={{ min: 0, step: 0.001 }}
                          fullWidth
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Save quantity">
                            <span>
                              <IconButton
                                onClick={() => handleSave(pm)}
                                disabled={busy || !rowIsDirty(pm)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </span>
                          </Tooltip>

                          <Tooltip title="Remove">
                            <span>
                              <IconButton
                                onClick={() => handleDelete(pm)}
                                disabled={busy}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={busy}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
