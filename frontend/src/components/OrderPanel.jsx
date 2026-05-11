import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ToggleButton,
    ToggleButtonGroup,
    Slider,
    Grid,
    Divider,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Info,
    Add,
    Remove,
    TrendingUp,
    TrendingDown,
} from '@mui/icons-material';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { tradingAPI } from '../../services/api';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const OrderPanel = ({ symbol, currentPrice }) => {
    const { openPosition, loading } = useTrading();
    const { user } = useAuth();
    
    const [orderType, setOrderType] = useState('market');
    const [tradeType, setTradeType] = useState('buy');
    const [volume, setVolume] = useState(0.01);
    const [stopLoss, setStopLoss] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [leverage, setLeverage] = useState(50);
    const [estimatedMargin, setEstimatedMargin] = useState(0);
    const [estimatedProfit, setEstimatedProfit] = useState(0);
    const [error, setError] = useState('');

    const pipValue = 10; // Simplified - varies by pair

    // Calculate margin and estimates
    useEffect(() => {
        if (currentPrice && volume) {
            const margin = (volume * currentPrice) / leverage;
            setEstimatedMargin(margin);
            
            if (takeProfit) {
                const tpDistance = Math.abs(takeProfit - currentPrice);
                const profit = tpDistance * volume * pipValue;
                setEstimatedProfit(profit);
            }
        }
    }, [volume, leverage, currentPrice, takeProfit]);

    const handleVolumeChange = (event, newValue) => {
        if (newValue !== null) {
            setVolume(newValue);
        }
    };

    const handleSubmit = async () => {
        try {
            setError('');
            
            if (!currentPrice) {
                setError('No price data available');
                return;
            }

            // Validate
            if (volume < 0.01) {
                setError('Minimum volume is 0.01');
                return;
            }

            if (estimatedMargin > user?.tradingAccount?.freeMargin) {
                setError('Insufficient margin');
                return;
            }

            await openPosition(symbol, tradeType, volume, orderType === 'market' ? null : currentPrice);
            
            // Reset form
            setStopLoss('');
            setTakeProfit('');
        } catch (error) {
            setError(error.message || 'Failed to open position');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                New Order
            </Typography>
            
            <Divider sx={{ mb: 2 }} />

            {/* Trade Type Toggle */}
            <ToggleButtonGroup
                value={tradeType}
                exclusive
                onChange={(e, val) => val && setTradeType(val)}
                fullWidth
                sx={{ mb: 2 }}
            >
                <ToggleButton 
                    value="buy" 
                    sx={{ 
                        color: 'success.main',
                        '&.Mui-selected': {
                            backgroundColor: 'success.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'success.dark',
                            }
                        }
                    }}
                >
                    <TrendingUp sx={{ mr: 1 }} /> BUY
                </ToggleButton>
                <ToggleButton 
                    value="sell"
                    sx={{ 
                        color: 'error.main',
                        '&.Mui-selected': {
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'error.dark',
                            }
                        }
                    }}
                >
                    <TrendingDown sx={{ mr: 1 }} /> SELL
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Order Type */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    label="Order Type"
                >
                    <MenuItem value="market">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>Market Execution</span>
                            <Typography variant="caption" color="textSecondary">Instant</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem value="limit">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>Limit Order</span>
                            <Typography variant="caption" color="textSecondary">At price</Typography>
                        </Box>
                    </MenuItem>
                    <MenuItem value="stop">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>Stop Order</span>
                            <Typography variant="caption" color="textSecondary">Trigger</Typography>
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>

            {/* Volume */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">Volume (Lots)</Typography>
                    <Typography variant="body2" color="primary">
                        {volume.toFixed(2)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                        size="small" 
                        onClick={() => setVolume(Math.max(0.01, volume - 0.01))}
                    >
                        <Remove />
                    </IconButton>
                    <Slider
                        value={volume}
                        onChange={(e, val) => setVolume(val)}
                        min={0.01}
                        max={10}
                        step={0.01}
                        sx={{ flex: 1 }}
                    />
                    <IconButton 
                        size="small" 
                        onClick={() => setVolume(Math.min(10, volume + 0.01))}
                    >
                        <Add />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    {[0.01, 0.05, 0.1, 0.5, 1].map((val) => (
                        <Button
                            key={val}
                            size="small"
                            variant="outlined"
                            onClick={() => setVolume(val)}
                            sx={{ minWidth: 'auto', px: 1, fontSize: '0.7rem' }}
                        >
                            {val}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Leverage */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Leverage</InputLabel>
                <Select
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    label="Leverage"
                >
                    {[1, 5, 10, 25, 50, 100].map((lev) => (
                        <MenuItem key={lev} value={lev}>
                            1:{lev}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Stop Loss & Take Profit */}
            <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Stop Loss"
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        InputProps={{ endAdornment: <Typography variant="caption">Pips</Typography> }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Take Profit"
                        type="number"
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(e.target.value)}
                        InputProps={{ endAdornment: <Typography variant="caption">Pips</Typography> }}
                    />
                </Grid>
            </Grid>

            {/* Order Summary */}
            <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'background.default' }}>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Margin Required</Typography>
                        <Typography variant="body2">${estimatedMargin.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Commission</Typography>
                        <Typography variant="body2">${(volume * 7).toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Available Margin</Typography>
                        <Typography variant="body2">
                            ${formatNumber(user?.tradingAccount?.freeMargin || 0)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="textSecondary">Est. Profit</Typography>
                        <Typography variant="body2" color="success.main">
                            ${estimatedProfit.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading || !currentPrice}
                    sx={{ py: 1.2 }}
                >
                    BUY {volume.toFixed(2)} Lots
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={() => {
                        setTradeType('sell');
                        handleSubmit();
                    }}
                    disabled={loading || !currentPrice}
                    sx={{ py: 1.2 }}
                >
                    SELL {volume.toFixed(2)} Lots
                </Button>
            </Box>
        </Paper>
    );
};

export default OrderPanel;