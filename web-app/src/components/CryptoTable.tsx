import React, { useState } from "react";
import { useCryptoPrices } from "@/lib/useCryptoPrices";
import { Crypto } from "@/types/crypto";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, Button, CircularProgress, Typography, Box 
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const CryptoTable: React.FC = () => {
  const { data, isLoading, error, refetch } = useCryptoPrices();
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false); // Track refresh state

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-sec delay
    refetch();
    setIsRefreshing(false);
  };

  if (isLoading || isRefreshing) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Typography color="error" textAlign="center">Error fetching data</Typography>;

  const filteredData = data?.filter((crypto: Crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
        Crypto Price Tracker
      </Typography>

      <TextField
        fullWidth
        label="Search Cryptocurrency"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Button 
        variant="contained" 
        startIcon={<RefreshIcon />} 
        onClick={handleRefresh} 
        disabled={isRefreshing} // Disable button while refreshing
        sx={{ mb: 2 }}
      >
        {isRefreshing ? "Refreshing..." : "Refresh Prices"}
      </Button>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Price (USD)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Market Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.map((crypto: Crypto) => (
              <TableRow key={crypto.id} hover>
                <TableCell>{crypto.name}</TableCell>
                <TableCell>${crypto.current_price.toFixed(2)}</TableCell>
                <TableCell>${crypto.market_cap.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CryptoTable;
