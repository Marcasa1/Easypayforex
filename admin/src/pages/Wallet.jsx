import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Paper, Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { AccountBalanceWallet, Add, Remove } from '@mui/icons-material'
import { getWallet, depositWallet, withdrawWallet } from '../services/adminApi'

export default function Wallet() {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('binance')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchWallet() }, [])

  const fetchWallet = async () => {
    try {
      const res = await getWallet()
      setBalance(res.data.data.balance)
    } catch (err) { console.error(err) }
  }

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert('Enter valid amount')
    setLoading(true)
    try {
      await depositWallet(parseFloat(amount))
      alert(`✅ $${amount} added to admin wallet`)
      setAmount('')
      fetchWallet()
    } catch (err) { alert('Failed') }
    setLoading(false)
  }

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert('Enter valid amount')
    if (!walletAddress) return alert('Enter wallet address')
    setLoading(true)
    try {
      await withdrawWallet(parseFloat(amount), method)
      alert(`✅ Withdrawal of $${amount} via ${method.toUpperCase()} initiated.\nAddress: ${walletAddress}`)
      setAmount('')
      setWalletAddress('')
      fetchWallet()
    } catch (err) { alert(err.response?.data?.message || 'Failed') }
    setLoading(false)
  }

  const methods = [
    { value: 'binance', label: 'Binance Pay' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'skrill', label: 'Skrill' },
    { value: 'neteller', label: 'Neteller' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'crypto', label: 'Crypto Wallet' },
  ]

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
        <AccountBalanceWallet sx={{ mr: 1, verticalAlign: 'middle', color: '#4fc3f7' }} />
        Admin Maintenance Wallet
      </Typography>
      <Typography variant="body2" color="#8892b0" gutterBottom>
        All trading fees are automatically deposited here. Withdraw via Binance or any e-wallet.
      </Typography>

      <Paper sx={{ p: 4, bgcolor: '#13152a', borderRadius: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="#8892b0" gutterBottom>Available Balance</Typography>
        <Typography variant="h2" fontWeight="bold" color="#4fc3f7" sx={{ my: 2 }}>
          ${balance.toFixed(2)}
        </Typography>
        <Typography variant="caption" color="#8892b0">
          Auto-funded from 1% trading fees
        </Typography>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth type="number" placeholder="Enter amount"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment>, style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#0a0b1e', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '& input': { color: 'white' } } }}
            />
          </Grid>
          <Grid item xs={6} md={3.5}>
            <Button fullWidth variant="contained" onClick={handleDeposit} disabled={loading}
              sx={{ bgcolor: '#00d4aa', py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#00b894' } }}
              startIcon={<Add />}>Deposit</Button>
          </Grid>
          <Grid item xs={6} md={3.5}>
            <Button fullWidth variant="contained" onClick={handleWithdraw} disabled={loading}
              sx={{ bgcolor: '#ff4757', py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#ff6b81' } }}
              startIcon={<Remove />}>Withdraw</Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#8892b0' }}>Withdrawal Method</InputLabel>
              <Select value={method} onChange={(e) => setMethod(e.target.value)} label="Withdrawal Method"
                sx={{ bgcolor: '#0a0b1e', color: 'white', '& .MuiSvgIcon-root': { color: 'white' } }}>
                {methods.map((m) => (
                  <MenuItem key={m.value} value={m.value} sx={{ color: 'white', bgcolor: '#13152a' }}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth placeholder="Wallet Address / Email"
              value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#0a0b1e', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '& input': { color: 'white' } } }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}
