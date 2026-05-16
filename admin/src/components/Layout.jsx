import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button, CssBaseline, IconButton, Badge, Avatar, Menu, MenuItem, Divider } from '@mui/material'
import { Dashboard as DashboardIcon, People as UsersIcon, TrendingUp as TradesIcon, AttachMoney as TxnsIcon, ExitToApp as LogoutIcon, Notifications as BellIcon, AccountBalanceWallet as WalletIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { io } from 'socket.io-client'
const drawerWidth = 260
export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [notifications, setNotifications] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  
  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('userActivity', (data) => {
      setNotifications(prev => [{ id: Date.now(), ...data, read: false }, ...prev].slice(0, 50))
    })
    socket.on('adminNotification', (data) => {
      setNotifications(prev => [{ id: Date.now(), ...data, read: false }, ...prev].slice(0, 50))
    })
    return () => socket.disconnect()
  }, [])
  
  const handleLogout = () => { localStorage.removeItem('admin_token'); navigate('/login') }
  const unreadCount = notifications.filter(n => !n.read).length
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Users', icon: <UsersIcon />, path: '/users' },
    { text: 'Trades', icon: <TradesIcon />, path: '/trades' },
    { text: 'Transactions', icon: <TxnsIcon />, path: '/transactions' },
    { text: 'Admin Wallet', icon: <WalletIcon />, path: '/wallet' },
    { text: 'Notifications', icon: <Badge badgeContent={unreadCount} color="error"><BellIcon /></Badge>, path: '/notifications' },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: '#4fc3f7', width: 36, height: 36, fontSize: 16, fontWeight: 'bold' }}>EF</Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>EASYPAYFOREX</Typography>
              <Typography variant="caption" sx={{ color: '#4fc3f7' }}>Admin Panel</Typography>
            </Box>
          </Box>
          
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ mr: 2 }}>
            <Badge badgeContent={unreadCount} color="error">
              <BellIcon />
            </Badge>
          </IconButton>
          
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { bgcolor: '#1a1a2e', color: 'white', maxHeight: 400, width: 350 } }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="subtitle2" fontWeight="bold">Notifications</Typography>
            </Box>
            {notifications.slice(0, 10).map((n, i) => (
              <MenuItem key={i} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'normal' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: n.read ? '#8892b0' : 'white', fontWeight: n.read ? 'normal' : 'bold' }}>
                    {n.type === 'register' ? '🆕 New Registration' : n.type === 'login' ? '🔑 User Login' : n.type === 'deposit' ? '💰 Deposit' : n.type === 'trade' ? '📈 Trade' : '📢 Alert'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8892b0' }}>
                    {n.name || n.email} • {new Date(n.time).toLocaleTimeString()}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <MenuItem onClick={() => { navigate('/notifications'); setAnchorEl(null) }} sx={{ justifyContent: 'center', color: '#4fc3f7' }}>
              View All Notifications
            </MenuItem>
          </Menu>
          
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="permanent" sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#0f1123', color: 'white', borderRight: '1px solid rgba(255,255,255,0.05)' } }}>
        <Toolbar />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: '#4fc3f7', width: 60, height: 60, mx: 'auto', mb: 1, fontSize: 24, fontWeight: 'bold' }}>A</Avatar>
          <Typography variant="subtitle1" fontWeight="bold">Admin User</Typography>
          <Typography variant="caption" sx={{ color: '#4fc3f7' }}>Super Admin</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path} selected={location.pathname === item.path}
              sx={{
                borderRadius: 2, mb: 0.5,
                '&.Mui-selected': { bgcolor: 'rgba(79,195,247,0.15)', '&:hover': { bgcolor: 'rgba(79,195,247,0.2)' } },
                '&:hover': { bgcolor: 'rgba(79,195,247,0.05)' }
              }}>
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#4fc3f7' : 'rgba(255,255,255,0.5)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: location.pathname === item.path ? 'bold' : 'normal' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#0a0b1e', minHeight: '100vh', p: 3, pt: 10 }}>
        {children}
      </Box>
    </Box>
  )
}
