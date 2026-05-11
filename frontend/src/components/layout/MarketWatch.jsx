import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    LinearProgress,
    Badge,
} from '@mui/material';
import {
    Search,
    Star,
    StarBorder,
    MoreVert,
    TrendingUp,
    TrendingDown,
    Refresh,
} from '@mui/icons-material';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const MarketWatch = ({ onSelectSymbol, selectedSymbol }) => {
    const [tab, setTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMarket, setSelectedMarket] = useState(null);
    
    const { marketData: liveData, isConnected } = useWebSocket();

    const [markets, setMarkets] = useState({
        forex: [
            { symbol: 'EUR/USD', bid: 1.0850, ask: 1.0852, spread: 0.0002, change: 0.15, changePercent: 0.14, high: 1.0875, low: 1.0825 },
            { symbol: 'GBP/USD', bid: 1.2650, ask: 1.2653, spread: 0.0003, change: -0.25, changePercent: -0.20, high: 1.2675, low: 1.2625 },
            { symbol: 'USD/JPY', bid: 148.50, ask: 148.53, spread: 0.03, change: 0.50, changePercent: 0.34, high: 148.75, low: 148.25 },
            { symbol: 'USD/CHF', bid: 0.8750, ask: 0.8753, spread: 0.0003, change: -0.10, changePercent: -0.11, high: 0.8775, low: 0.8725 },
            { symbol: 'AUD/USD', bid: 0.6550, ask: 0.6552, spread: 0.0002, change: 0.05, changePercent: 0.08, high: 0.6575, low: 0.6525 },
            { symbol: 'USD/CAD', bid: 1.3450, ask: 1.3453, spread: 0.0003, change: 0.20, changePercent: 0.15, high: 1.3475, low: 1.3425 },
            { symbol: 'NZD/USD', bid: 0.6150, ask: 0.6152, spread: 0.0002, change: -0.05, changePercent: -0.08, high: 0.6175, low: 0.6125 },
            { symbol: 'EUR/GBP', bid: 0.8575, ask: 0.8577, spread: 0.0002, change: 0.10, changePercent: 0.12, high: 0.8585, low: 0.8565 },
            { symbol: 'EUR/JPY', bid: 161.25, ask: 161.28, spread: 0.03, change: 0.75, changePercent: 0.47, high: 161.50, low: 160.75 },
            { symbol: 'GBP/JPY', bid: 187.80, ask: 187.84, spread: 0.04, change: 0.45, changePercent: 0.24, high: 188.25, low: 187.25 },
        ],
        commodities: [
            { symbol: 'XAU/USD', bid: 2025.50, ask: 2026.00, spread: 0.50, change: 12.50, changePercent: 0.62, high: 2030.00, low: 2015.00 },
            { symbol: 'XAG/USD', bid: 23.45, ask: 23.48, spread: 0.03, change: -0.25, changePercent: -1.05, high: 23.75, low: 23.25 },
            { symbol: 'OIL/USD', bid: 72.50, ask: 72.55, spread: 0.05, change: 1.25, changePercent: 1.75, high: 73.00, low: 71.50 },
            { symbol: 'GAS/USD', bid: 2.45, ask: 2.46, spread: 0.01, change: -0.05, changePercent: -2.00, high: 2.52, low: 2.42 },
        ],
        indices: [
            { symbol: 'US30', bid: 37500, ask: 37505, spread: 5, change: 150, changePercent: 0.40, high: 37600, low: 37400 },
            { symbol: 'SPX500', bid: 4780, ask: 4782, spread: 2, change: 25, changePercent: 0.53, high: 4795, low: 4765 },
            { symbol: 'NAS100', bid: 16850, ask: 16855, spread: 5, change: 120, changePercent: 0.72, high: 16900, low: 16750 },
            { symbol: 'UK100', bid: 7650, ask: 7652, spread: 2, change: -30, changePercent: -0.39, high: 7680, low: 7640 },
            { symbol: 'GER30', bid: 16750, ask: 16755, spread: 5, change: 85, changePercent: 0.51, high: 16800, low: 16700 },
            { symbol: 'JPN225', bid: 35750, ask: 35760, spread: 10, change: 250, changePercent: 0.70, high: 35800, low: 35650 },
        ],
    });

    // Update market data from WebSocket
    useEffect(() => {
        if (liveData && Object.keys(liveData).length > 0) {
            setMarkets(prev => {
                const updated = { ...prev };
                ['forex', 'commodities', 'indices'].forEach(category => {
                    if (updated[category]) {
                        updated[category] = updated[category].map(market => {
                            const live = liveData[market.symbol];
                            if (live) {
                                return {
                                    ...market,
                                    bid: live.bid || market.bid,
                                    ask: live.ask || market.ask,
                                    spread: live.spread || market.spread,
                                    change: live.change || market.change,
                                    changePercent: live.changePercent || market.changePercent,
                                    high: live.high || market.high,
                                    low: live.low || market.low,
                                };
                            }
                            return market;
                        });
                    }
                });
                return updated;
            });
        }
    }, [liveData]);

    const toggleFavorite = (symbol) => {
        setFavorites(prev =>
            prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol]
        );
    };

    const getCurrentMarkets = () => {
        const categories = ['forex', 'commodities', 'indices'];
        let currentMarkets = markets[categories[tab]] || [];
        
        if (searchTerm) {
            currentMarkets = currentMarkets.filter(m =>
                m.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort: favorites first, then by symbol
        return currentMarkets.sort((a, b) => {
            const aFav = favorites.includes(a.symbol) ? -1 : 0;
            const bFav = favorites.includes(b.symbol) ? -1 : 0;
            return aFav - bFav || a.symbol.localeCompare(b.symbol);
        });
    };

    const handleContextMenu = (event, market) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setSelectedMarket(market);
    };

    return (
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Market Watch</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Badge color={isConnected ? 'success' : 'error'} variant="dot">
                            <Refresh size="small" />
                        </Badge>
                        <Typography variant="caption" color={isConnected ? 'success.main' : 'error.main'}>
                            {isConnected ? 'Live' : 'Reconnecting...'}
                        </Typography>
                    </Box>
                </Box>

                {/* Search */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search symbols..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label={`Forex (${markets.forex.length})`} />
                <Tab label={`Commodities (${markets.commodities.length})`} />
                <Tab label={`Indices (${markets.indices.length})`} />
            </Tabs>

            {/* Market List */}
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" />
                            <TableCell>Symbol</TableCell>
                            <TableCell align="right">Bid</TableCell>
                            <TableCell align="right">Ask</TableCell>
                            <TableCell align="right">Spread</TableCell>
                            <TableCell align="right">Change</TableCell>
                            <TableCell padding="checkbox" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getCurrentMarkets().map((market) => (
                            <TableRow
                                key={market.symbol}
                                hover
                                selected={selectedSymbol === market.symbol}
                                onClick={() => onSelectSymbol?.(market.symbol)}
                                onContextMenu={(e) => handleContextMenu(e, market)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell padding="checkbox">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(market.symbol);
                                        }}
                                    >
                                        {favorites.includes(market.symbol) ? (
                                            <Star fontSize="small" color="warning" />
                                        ) : (
                                            <StarBorder fontSize="small" />
                                        )}
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">
                                        {market.symbol}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="success.main">
                                        {market.bid.toFixed(
                                            market.symbol.includes('JPY') ? 3 : 
                                            market.symbol.includes('XAU') ? 2 : 5
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" color="error.main">
                                        {market.ask.toFixed(
                                            market.symbol.includes('JPY') ? 3 : 
                                            market.symbol.includes('XAU') ? 2 : 5
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2">
                                        {market.spread.toFixed(
                                            market.symbol.includes('JPY') ? 3 : 
                                            market.symbol.includes('XAU') ? 2 : 5
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                        {market.change > 0 ? (
                                            <TrendingUp fontSize="small" color="success" />
                                        ) : (
                                            <TrendingDown fontSize="small" color="error" />
                                        )}
                                        <Typography
                                            variant="body2"
                                            color={market.change >= 0 ? 'success.main' : 'error.main'}
                                        >
                                            {market.changePercent > 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell padding="checkbox">
                                    <IconButton size="small">
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => {
                    onSelectSymbol?.(selectedMarket?.symbol);
                    setAnchorEl(null);
                }}>
                    Open Chart
                </MenuItem>
                <MenuItem onClick={() => {
                    toggleFavorite(selectedMarket?.symbol);
                    setAnchorEl(null);
                }}>
                    {favorites.includes(selectedMarket?.symbol) ? 'Remove from Favorites' : 'Add to Favorites'}
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    Create Alert
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    Market Details
                </MenuItem>
            </Menu>
        </Paper>
    );
};

export default MarketWatch;