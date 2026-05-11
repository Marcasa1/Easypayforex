import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Avatar,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountBalanceWallet,
    TrendingUp,
    Dashboard,
    Person,
    Logout,
    Notifications,
    ShowChart,
    CurrencyExchange,
    Diamond,
    Assessment,
    Support,
    Translate,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTrading } from '../../context/TradingContext';

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const { positions } = useTrading();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/');
    };

    const menuItems = [
        { text: 'Home', path: '/', icon: <ShowChart /> },
        { text: 'Forex', path: '/forex', icon: <CurrencyExchange /> },
        { text: 'Commodities', path: '/commodities', icon: <Diamond /> },
        { text: 'Indices', path: '/indices', icon: <Assessment /> },
        { text: 'Trading', path: '/trading', icon: <TrendingUp />, auth: true },
        { text: 'AI Trading', path: '/ai-trading', icon: <TrendingUp />, auth: true },
        { text: 'Dashboard', path: '/dashboard', icon: <Dashboard />, auth: true },
        { text: 'Wallet', path: '/wallet', icon: <AccountBalanceWallet />, auth: true },
    ];

    const drawer = (
        <Box onClick={() => setMobileOpen(false)} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                <img src="/logo.svg" alt="Easypayforex" style={{ height: 40, marginRight: 10 }} />
                Easypayforex
            </Typography>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    (!item.auth || isAuthenticated) && (
                        <ListItem
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    )
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                color={scrolled ? 'default' : 'transparent'}
                elevation={scrolled ? 4 : 0}
                sx={{
                    transition: 'all 0.3s ease',
                    backgroundColor: scrolled ? 'background.paper' : 'transparent',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setMobileOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: isMobile ? 1 : 0,
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            mr: 4,
                        }}
                    >
                        <img
                            src="/logo.svg"
                            alt="Easypayforex"
                            style={{ height: 40, marginRight: 10 }}
                        />
                        Easypayforex
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                            {menuItems.map((item) => (
                                (!item.auth || isAuthenticated) && (
                                    <Button
                                        key={item.text}
                                        component={Link}
                                        to={item.path}
                                        color="inherit"
                                        sx={{
                                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                            borderBottom: location.pathname === item.path ? 2 : 0,
                                            borderColor: 'primary.main',
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                )
                            ))}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuthenticated ? (
                            <>
                                <IconButton color="inherit">
                                    <Badge badgeContent={positions?.length || 0} color="error">
                                        <TrendingUp />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    onClick={(e) => setNotificationAnchor(e.currentTarget)}
                                >
                                    <Badge badgeContent={3} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                                <IconButton onClick={handleMenu} color="inherit">
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: 'primary.main',
                                            fontSize: 14,
                                        }}
                                    >
                                        {user?.firstName?.[0]?.toUpperCase()}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem disabled>
                                        <Typography variant="body2">
                                            {user?.firstName} {user?.lastName}
                                        </Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                                        <Dashboard sx={{ mr: 1 }} /> Dashboard
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                                        <Person sx={{ mr: 1 }} /> Profile
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); navigate('/wallet'); }}>
                                        <AccountBalanceWallet sx={{ mr: 1 }} /> Wallet
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <Logout sx={{ mr: 1 }} /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="inherit"
                                    variant="outlined"
                                    size="small"
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar /> {/* Spacer */}

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 } }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;