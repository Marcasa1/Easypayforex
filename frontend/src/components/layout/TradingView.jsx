import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, IconButton, ButtonGroup, Button } from '@mui/material';
import { Fullscreen, Settings, Timeline } from '@mui/icons-material';

// TradingView Widget Component
const TradingViewWidget = ({ symbol = 'EURUSD', theme = 'dark', interval = '60' }) => {
    const container = useRef(null);
    const [timeframe, setTimeframe] = useState(interval);
    const [chartType, setChartType] = useState('candlestick');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (window.TradingView) {
                new window.TradingView.widget({
                    autosize: true,
                    symbol: `FX:${symbol}`,
                    interval: timeframe,
                    timezone: 'Etc/UTC',
                    theme: theme,
                    style: '1',
                    locale: 'en',
                    toolbar_bg: '#f1f3f6',
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: 'tradingview_chart',
                    studies: [
                        'MASimple@tv-basicstudies',
                        'RSI@tv-basicstudies',
                        'MACD@tv-basicstudies',
                    ],
                    disabled_features: ['header_symbol_search', 'header_compare'],
                    enabled_features: ['study_templates'],
                });
            }
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [symbol, timeframe, theme]);

    return (
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
                p: 1, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">{symbol.replace('/', '')}</Typography>
                    <ButtonGroup size="small" variant="outlined">
                        {['1', '5', '15', '30', '60', '240', '1D', '1W'].map((tf) => (
                            <Button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                variant={timeframe === tf ? 'contained' : 'outlined'}
                            >
                                {tf}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>
                <Box>
                    <IconButton size="small">
                        <Settings fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                        <Fullscreen fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <div
                    id="tradingview_chart"
                    ref={container}
                    style={{ height: '100%', width: '100%' }}
                />
            </Box>
        </Paper>
    );
};

// Fallback Chart Component (if TradingView widget fails to load)
const FallbackChart = ({ symbol, data = [] }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !data.length) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw chart background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw price line
        if (data.length > 1) {
            const prices = data.map(d => d.close);
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const range = max - min;
            const stepX = width / (data.length - 1);

            ctx.strokeStyle = '#1976d2';
            ctx.lineWidth = 2;
            ctx.beginPath();

            data.forEach((point, i) => {
                const x = i * stepX;
                const y = height - ((point.close - min) / range) * (height - 40) - 20;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw current price
            const lastPrice = data[data.length - 1].close;
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.fillText(`$${lastPrice.toFixed(5)}`, 10, 30);
        }
    }, [data]);

    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                style={{ width: '100%', height: '100%' }}
            />
        </Box>
    );
};

const TradingView = ({ symbol, theme }) => {
    const [useFallback, setUseFallback] = useState(false);

    if (useFallback) {
        return <FallbackChart symbol={symbol} />;
    }

    return (
        <Box sx={{ height: '100%', minHeight: 500 }}>
            <TradingViewWidget symbol={symbol} theme={theme} />
        </Box>
    );
};

export default TradingView;