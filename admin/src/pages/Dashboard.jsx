import React, { useState, useEffect } from 'react'
import { Grid, Paper, Typography, Box } from '@mui/material'
import { People, BarChart, AttachMoney } from '@mui/icons-material'
import { getDashboard } from '../services/adminApi'
export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalTrades: 0, totalDeposits: 0 })
  useEffect(() => { getDashboard().then(r => setStats(r.data.data)).catch(()=>{}) }, [])
  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: <People sx={{ fontSize: 40, color: '#4fc3f7' }} /> },
    { label: 'Total Trades', value: stats.totalTrades, icon: <BarChart sx={{ fontSize: 40, color: '#7c4dff' }} /> },
    { label: 'Total Deposits', value: `$${stats.totalDeposits || 0}`, icon: <AttachMoney sx={{ fontSize: 40, color: '#00d4aa' }} /> },
  ]
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="white">Dashboard Overview</Typography>
      <Grid container spacing={3}>
        {cards.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper sx={{ p: 3, bgcolor: '#13152a', color: 'white', borderRadius: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box><Typography variant="body2" color="#8892b0">{card.label}</Typography><Typography variant="h4" fontWeight="bold" mt={1}>{card.value}</Typography></Box>
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
