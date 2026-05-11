import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    TrendingUp,
    Security,
    Speed,
    Support,
    AutoGraph,
    AccountBalanceWallet,
    CurrencyExchange,
    Diamond,
    Assessment,
    ArrowForward,
    PlayArrow,
    Star,
    People,
    Language,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isAuthenticated } = useAuth();
    const heroRef = useRef(null);
    const statsRef = useRef(null);

    const features = [
        {
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            title: 'Advanced Trading',
            description: 'Trade Forex, Commodities & Indices with cutting-edge tools and real-time market data',
        },
        {
            icon: <AutoGraph sx={{ fontSize: 40 }} />,
            title: 'AI-Powered Analysis',
            description: 'Get intelligent trading signals and market predictions powered by advanced AI algorithms',
        },
        {
            icon: <Security sx={{ fontSize: 40 }} />,
            title: 'Secure Platform',
            description: 'Bank-grade security with encryption, 2FA, and segregated client accounts',
        },
        {
            icon: <Speed sx={{ fontSize: 40 }} />,
            title: 'Lightning Fast',
            description: 'Execute trades in milliseconds with our low-latency infrastructure',
        },
        {
            icon: <Support sx={{ fontSize: 40 }} />,
            title: '24/7 Support',
            description: 'Round-the-clock customer support with live chat, email, and phone assistance',
        },
        {
            icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
            title: 'E-Wallet Integration',
            description: 'Seamless deposits and withdrawals with multiple e-wallet payment options',
        },
    ];

    const stats = [
        { icon: <People />, value: '50,000+', label: 'Active Traders' },
        { icon: <Language />, value: '150+', label: 'Countries' },
        { icon: <TrendingUp />, value: '$2B+', label: 'Trading Volume' },
        { icon: <Star />, value: '4.8/5', label: 'User Rating' },
    ];

    const markets = [
        { icon: <CurrencyExchange />, name: 'Forex', pairs: '50+ Pairs', spread: 'From 0.0 pips' },
        { icon: <Diamond />, name: 'Commodities', pairs: 'Gold, Oil, Silver', spread: 'Competitive' },
        { icon: <Assessment />, name: 'Indices', pairs: 'Global Indices', spread: 'Low spreads' },
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                ref={heroRef}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    pt: { xs: 12, md: 20 },
                    pb: { xs: 8, md: 15 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant="h2"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}
                                >
                                    Trade Smarter with Easypayforex
                                </Typography>
                                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                                    Advanced Trading Platform for Forex, Commodities & Indices
                                    with AI-Powered Insights
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {!isAuthenticated && (
                                        <>
                                            <Button
                                                component={Link}
                                                to="/register"
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: 'primary.main',
                                                    px: 4,
                                                    py: 1.5,
                                                    '&:hover': { bgcolor: 'grey.100' },
                                                }}
                                                endIcon={<ArrowForward />}
                                            >
                                                Start Trading Now
                                            </Button>
                                            <Button
                                                component={Link}
                                                to="/login"
                                                variant="outlined"
                                                size="large"
                                                sx={{
                                                    color: 'white',
                                                    borderColor: 'white',
                                                    px: 4,
                                                    py: 1.5,
                                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                                }}
                                            >
                                                Login
                                            </Button>
                                        </>
                                    )}
                                    {isAuthenticated && (
                                        <Button
                                            component={Link}
                                            to="/trading"
                                            variant="contained"
                                            size="large"
                                            sx={{
                                                bgcolor: 'white',
                                                color: 'primary.main',
                                                px: 4,
                                                py: 1.5,
                                            }}
                                        >
                                            Go to Trading Platform
                                        </Button>
                                    )}
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Paper elevation={24} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                    <Box sx={{ bgcolor: '#1a1a1a', p: 2, borderRadius: 1 }}>
                                        <Typography variant="body2" color="grey.500" gutterBottom>
                                            Live Market Overview
                                        </Typography>
                                        {[
                                            { pair: 'EUR/USD', price: '1.0850', change: '+0.15%' },
                                            { pair: 'GBP/USD', price: '1.2650', change: '-0.20%' },
                                            { pair: 'XAU/USD', price: '2025.50', change: '+0.62%' },
                                            { pair: 'US30', price: '37500', change: '+0.40%' },
                                        ].map((item) => (
                                            <Box
                                                key={item.pair}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    py: 1,
                                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight="bold">
                                                    {item.pair}
                                                </Typography>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2">{item.price}</Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color={item.change.startsWith('+') ? 'success.main' : 'error.main'}
                                                    >
                                                        {item.change}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box ref={statsRef} sx={{ py: 6, bgcolor: 'background.paper' }}>
                <Container>
                    <Grid container spacing={4}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <IconButton sx={{ color: 'primary.main', mb: 1 }}>
                                            {stat.icon}
                                        </IconButton>
                                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Why Choose Easypayforex?
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Everything you need for successful trading in one platform
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 8,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                        <Box sx={{ color: 'primary.main', mb: 2 }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" gutterBottom fontWeight="bold">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Markets Section */}
            <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
                <Container>
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Trade Multiple Markets
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                            Diversify your portfolio across different asset classes
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {markets.map((market, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <Card sx={{ textAlign: 'center', p: 4 }}>
                                        <Box sx={{ color: 'primary.main', mb: 2, fontSize: 60 }}>
                                            {market.icon}
                                        </Box>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {market.name}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                            {market.pairs}
                                        </Typography>
                                        <Typography variant="body2" color="primary">
                                            {market.spread}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            to={`/${market.name.toLowerCase()}`}
                                            variant="outlined"
                                            sx={{ mt: 2 }}
                                            endIcon={<ArrowForward />}
                                        >
                                            Start Trading
                                        </Button>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 8,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Container>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Ready to Start Trading?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Join thousands of traders worldwide and experience the future of trading
                    </Typography>
                    <Button
                        component={Link}
                        to={isAuthenticated ? '/trading' : '/register'}
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                            '&:hover': { bgcolor: 'grey.100' },
                        }}
                        endIcon={<ArrowForward />}
                    >
                        {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
