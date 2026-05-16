import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material'
import { getTransactions } from '../services/adminApi'
export default function Transactions() {
  const [txns, setTxns] = useState([])
  useEffect(() => { getTransactions().then(r => setTxns(r.data.data)).catch(()=>{}) }, [])
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="white">Transaction History</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: '#13152a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>User</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Type</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Amount</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Status</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {txns.map(t => (
              <TableRow key={t._id}>
                <TableCell sx={{ color:'#8892b0' }}>{t.user?.email || t.userId || 'N/A'}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{t.type}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>${t.amount}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{t.status}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{new Date(t.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
