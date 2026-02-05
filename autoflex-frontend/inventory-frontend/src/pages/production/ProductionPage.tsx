import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
import { getProductionSuggestion } from "../../api/production";
import { getErrorMessage } from "../../api/error";

export function ProductionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<null | Awaited<
    ReturnType<typeof getProductionSuggestion>
  >>(null);

  async function handleCalculate() {
    setLoading(true);
    setError(null);
    try {
      const resp = await getProductionSuggestion();
      setData(resp);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Production suggestion
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Calculates the best production plan based on available raw materials
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate production"}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined">
        {loading ? (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
            <CircularProgress size={20} />
            <Typography>Processing...</Typography>
          </Stack>
        ) : !data ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Click <b>Calculate production</b> to see the suggestion.
            </Typography>
          </Box>
        ) : data.items.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="text.secondary">
              No products can be produced with the current stock.
            </Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Unit price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total value</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.productId} hover>
                    <TableCell>
                      <Typography fontWeight={700}>
                        {item.productCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.productName}
                      </Typography>
                    </TableCell>

                    <TableCell>${Number(item.unitPrice).toFixed(2)}</TableCell>

                    <TableCell>{item.producibleQuantity}</TableCell>

                    <TableCell>
                      <Typography fontWeight={700}>
                        ${Number(item.totalValue).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
            >
              <Typography variant="h6" fontWeight={800}>
                Total: ${Number(data.totalValue).toFixed(2)}
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Stack>
  );
}
