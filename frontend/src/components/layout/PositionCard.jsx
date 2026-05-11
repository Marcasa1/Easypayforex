import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    IconButton,
    Chip,
    LinearProgress,
    Collapse,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    Close,
    Edit,
    TrendingUp,
    TrendingDown,
    Timer,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import { useTrading } from '../../context/TradingContext';
import { formatCurrency, formatNumber, formatDuration } from '../../utils/formatters';

const PositionCard = ({ position }) => {
    const { closePosition, modifyPosition } = useTrading();
    const [expanded, setExpanded] = useState(false);
    const [modifyOpen, setModifyOpen] = useState(false);
    const [newSL, setNewSL] = useState(position.stopLoss || '');
    const [newTP, setNewTP] = useState(position.takeProfit || '');
    const [closing, setClosing] = useState(false);

    const profitLoss = position.floatingProfit || position.profit;
    const isProfitable = profitLoss >= 0;
    const duration = position.openedAt 
        ? Math.floor((Date.now() - new Date(position.openedAt).getTime()) / 1000)
        : 0;

    const handleClose = async () => {
        setClosing(true);
        try {
            await closePosition(position._id);
        } catch (error) {
            console.error('Failed to close position:', error);
        } finally {
            setClosing(false);
        }
    };

    const handleModify = async () => {
        try {
            await modifyPosition(position._id, {
                stopLoss: newSL ? parseFloat(newSL) : null,
                takeProfit: newTP ? parseFloat(newTP) : null,
            });
            setModifyOpen(false);
        } catch (error) {
            console.error('Failed to modify position:', error);
        }
    };

    return (
        <>
            <Card 
                sx={{ 
                    mb: 1,
                    borderLeft: 4,
                    borderColor: isProfitable ? 'success.main' : 'error.main',
                }}
            >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Symbol and Type */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={position.type.toUpperCase()}
                                size="small"
                                color={position.type === 'buy' ? 'success' : 'error'}
                                sx={{ minWidth: 60 }}
                            />
                            <Typography variant="body1" fontWeight="bold">
                                {position.symbol}
                            </Typography>
                            <Chip
                                icon={<Timer />}
                                label={formatDuration(duration)}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        {/* Profit/Loss */}
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography
                                variant="h6"
                                color={isProfitable ? 'success.main' : 'error.main'}
                            >
                                {isProfitable ? '+' : ''}{formatCurrency(profitLoss)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {position.pips > 0 ? '+' : ''}{position.pips?.toFixed(1)} pips
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="textSecondary">Volume</Typography>
                                <Typography variant="body2">{position.volume}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="textSecondary">Open Price</Typography>
                                <Typography variant="body2">{position.openPrice}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="textSecondary">Current</Typography>
                                <Typography variant="body2">{position.currentPrice}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="caption" color="textSecondary">Leverage</Typography>
                                <Typography variant="body2">1:{position.leverage}</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Expand for more details */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                            {expanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Box>

                    <Collapse in={expanded}>
                        <Box sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="caption" color="textSecondary">Stop Loss</Typography>
                                    <Typography variant="body2">
                                        {position.stopLoss || 'Not set'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="caption" color="textSecondary">Take Profit</Typography>
                                    <Typography variant="body2">
                                        {position.takeProfit || 'Not set'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="caption" color="textSecondary">Commission</Typography>
                                    <Typography variant="body2">
                                        {formatCurrency(position.commission || 0)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="caption" color="textSecondary">Swap</Typography>
                                    <Typography variant="body2">
                                        {formatCurrency(position.swap || 0)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="caption" color="textSecondary">Margin</Typography>
                                    <Typography variant="body2">
                                        {formatCurrency(position.margin)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="caption" color="textSecondary">Trade ID</Typography>
                                    <Typography variant="body2" fontSize="0.7rem">
                                        #{position._id?.slice(-8)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={handleClose}
                            disabled={closing}
                            startIcon={<Close />}
                            fullWidth
                        >
                            {closing ? 'Closing...' : 'Close Position'}
                        </Button>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => setModifyOpen(true)}
                        >
                            <Edit />
                        </IconButton>
                    </Box>

                    {/* Progress for margin level */}
                    {position.marginLevel && (
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(position.marginLevel, 100)}
                            color={position.marginLevel > 100 ? 'success' : position.marginLevel > 50 ? 'warning' : 'error'}
                            sx={{ mt: 1 }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modify Position Dialog */}
            <Dialog open={modifyOpen} onClose={() => setModifyOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Modify Position</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Stop Loss"
                            type="number"
                            value={newSL}
                            onChange={(e) => setNewSL(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Take Profit"
                            type="number"
                            value={newTP}
                            onChange={(e) => setNewTP(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModifyOpen(false)}>Cancel</Button>
                    <Button onClick={handleModify} variant="contained">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PositionCard;