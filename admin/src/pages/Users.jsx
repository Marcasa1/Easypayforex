import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Chip, Box } from '@mui/material'
import { getUsers, updateUser, deleteUser } from '../services/adminApi'
export default function Users() {
  const [users, setUsers] = useState([])
  const fetchUsers = async () => { try { const r = await getUsers(); setUsers(r.data.data) } catch(e){} }
  useEffect(() => { fetchUsers() }, [])
  const handleVerify = async (id) => { await updateUser(id, { kycStatus: 'verified' }); fetchUsers() }
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await deleteUser(id); fetchUsers() } }
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="white">User Management</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: '#13152a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Name</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Email</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Type</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Balance</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>KYC</TableCell>
              <TableCell sx={{ color:'white', fontWeight:'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell sx={{ color:'#8892b0' }}>{u.firstName} {u.lastName}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{u.email}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>{u.accountType}</TableCell>
                <TableCell sx={{ color:'#8892b0' }}>${u.wallet?.balance || 0}</TableCell>
                <TableCell><Chip label={u.kycStatus||'pending'} size="small" color={u.kycStatus==='verified'?'success':'warning'} variant="outlined" /></TableCell>
                <TableCell>
                  {u.kycStatus!=='verified' && <Button size="small" variant="outlined" color="success" onClick={()=>handleVerify(u._id)} sx={{ mr:1 }}>Verify</Button>}
                  <Button size="small" variant="outlined" color="error" onClick={()=>handleDelete(u._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
