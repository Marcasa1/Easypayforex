import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, TextField, Button, Typography, Paper, Avatar } from '@mui/material'
import { AdminPanelSettings as AdminIcon } from '@mui/icons-material'
import { login } from '../services/adminApi'
export default function Login() {
  const [email, setEmail] = useState('admin@easypayforex.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      localStorage.setItem('admin_token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0b1e 0%, #1a1a2e 100%)' }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ p: 5, bgcolor: 'rgba(19,21,42,0.95)', backdropFilter: 'blur(20px)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ bgcolor: '#4fc3f7', width: 70, height: 70, mx: 'auto', mb: 2 }}>
              <AdminIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" color="white">Admin Login</Typography>
            <Typography variant="body2" color="#8892b0">EASYPAYFOREX Administration</Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth margin="normal" label="Email Address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{ inputLabel: { style: { color: '#8892b0' } }, input: { style: { color: 'white' } } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#0a0b1e', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#4fc3f7' }, '&.Mui-focused fieldset': { borderColor: '#4fc3f7' } } }}
            />
            <TextField
              fullWidth margin="normal" label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{ inputLabel: { style: { color: '#8892b0' } }, input: { style: { color: 'white' } } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#0a0b1e', '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover fieldset': { borderColor: '#4fc3f7' }, '&.Mui-focused fieldset': { borderColor: '#4fc3f7' } } }}
            />
            {error && <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
            <Button type="submit" fullWidth variant="contained" disabled={loading}
              sx={{ mt: 3, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', color: 'white', fontWeight: 'bold', py: 1.5, borderRadius: 2, fontSize: '1rem', '&:hover': { opacity: 0.9 } }}>
              {loading ? 'Authenticating...' : 'Login to Admin Panel'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
