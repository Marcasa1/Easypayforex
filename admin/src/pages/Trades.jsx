import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Box } from '@mui/material'
import { getTrades } from '../services/adminApi'
export default function Trades() {
  const [trades, setTrades] = useState([])
  useEffect(() => { getTrades().then(r => setTrades(r.data.data)).catch(()=>{}) }, [])
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="white">Trade Monitoring</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: '#13152a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Symbol</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Type</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Volume</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Open Price</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Close Price</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Profit</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map(t => (
              <TableRow key={t._id}>
                <TableCell sx={{ color:'#8892b0' }}>{t.symbol}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{t.type}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{t.volume}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{t.openPrice}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{t.closePrice||'-'}</TableCell>
                <TableCell sx={{ color: t.profit>=0?'#00d4aa':'#ff4757' }}>${t.profit?.toFixed(2)||0}</TableCell>
                <TableCell><Chip label={t.status} size="small" color={t.status==='open'?'success':'default'} variant="outlined" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
