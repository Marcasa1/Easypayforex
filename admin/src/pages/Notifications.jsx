import React, { useState, useEffect } from 'react'
import { Box, Typography, List, ListItem, ListItemText, Paper, Chip } from '@mui/material'
import { io } from 'socket.io-client'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('userActivity', (data) => {
      setNotifications(prev => [{ id: Date.now(), ...data, read: false }, ...prev])
    })
    socket.on('adminNotification', (data) => {
      setNotifications(prev => [{ id: Date.now(), ...data, read: false }, ...prev])
    })
    return () => socket.disconnect()
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="white">Notifications</Typography>
        <Chip label="Mark All Read" onClick={markAllRead} sx={{ bgcolor: '#4fc3f7', color: 'white', cursor: 'pointer' }} />
      </Box>

      <Paper sx={{ bgcolor: '#13152a', borderRadius: 3, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="#8892b0">No notifications yet</Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((n, i) => (
              <ListItem key={i} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', bgcolor: n.read ? 'transparent' : 'rgba(79,195,247,0.05)' }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="white" fontWeight={n.read ? 'normal' : 'bold'}>
                      {n.type === 'register' ? '🆕 New User Registered' :
                       n.type === 'login' ? '🔑 User Logged In' :
                       n.type === 'deposit' ? '💰 New Deposit' :
                       n.type === 'trade' ? '📈 Trade Executed' :
                       n.type === 'withdrawal' ? '💸 Withdrawal Request' : '📢 Alert'}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="#8892b0">
                      {n.name || n.email || 'System'} • {new Date(n.time).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}
