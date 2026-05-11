import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  AppBar, Toolbar, IconButton, Paper, Chip, Badge, Avatar, Divider,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem, Select, Drawer, List, ListItem, Fab, InputAdornment,
  Tabs, Tab, LinearProgress
} from '@mui/material'
import {
  TrendingUp, AccountBalanceWallet, ShowChart, CurrencyExchange,
  Diamond, Assessment, Notifications, Person, Star, ArrowForward,
  CheckCircle, Security, Speed, Support, Chat, Send, Close,
  Language, Phone, Email, Visibility, AttachMoney, Timeline,
  Public, WhatsApp, Telegram, Facebook, Twitter, YouTube
} from '@mui/icons-material'

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
  { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
  { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
  { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
  { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
  { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+233', country: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
]

const darkBg = '#0a0e27'
const cardBg = '#131842'
const accent = '#4fc3f7'

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
    </Box>
    <Box><Typography variant="h6" fontWeight="bold" sx={{ color: 'white', lineHeight: 1.2 }}>EASYPAY</Typography><Typography variant="caption" sx={{ color: accent, letterSpacing: 2 }}>FOREX</Typography></Box>
  </Box>
)

const LiveTicker = () => {
  const [data, setData] = useState([
    { symbol: 'EUR/USD', bid: 1.0850, change: '+0.15%', up: true },
    { symbol: 'GBP/USD', bid: 1.2650, change: '-0.20%', up: false },
    { symbol: 'USD/JPY', bid: 148.50, change: '+0.34%', up: true },
    { symbol: 'XAU/USD', bid: 2025.50, change: '+0.62%', up: true },
    { symbol: 'BTC/USD', bid: 43250, change: '+2.15%', up: true },
    { symbol: 'OIL/USD', bid: 72.50, change: '+1.25%', up: true },
    { symbol: 'US30', bid: 37500, change: '+0.40%', up: true },
  ])
  useEffect(() => { const i = setInterval(() => { setData(p => p.map(d => ({ ...d, bid: d.bid + (Math.random() - 0.5) * 0.1, change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(2) + '%', up: Math.random() > 0.5 }))) }, 2000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ bgcolor: '#0d1137', overflow: 'hidden', py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <Box sx={{ display: 'flex', gap: 4, px: 2 }}>
        {[...data, ...data].map((d, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{d.symbol}</Typography>
            <Typography variant="body2" sx={{ color: d.up ? '#4caf50' : '#f44336' }}>{d.bid.toFixed(2)}</Typography>
            <Chip label={d.change} size="small" sx={{ bgcolor: d.up ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)', color: d.up ? '#4caf50' : '#f44336', fontSize: '0.7rem', height: 20 }} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
EOFcat >> src/App.jsx << 'EOF'

const LiveTicker = () => {
  const [data, setData] = useState([
    { symbol: 'EUR/USD', bid: 1.0850, change: '+0.15%', up: true },
    { symbol: 'GBP/USD', bid: 1.2650, change: '-0.20%', up: false },
    { symbol: 'USD/JPY', bid: 148.50, change: '+0.34%', up: true },
    { symbol: 'XAU/USD', bid: 2025.50, change: '+0.62%', up: true },
    { symbol: 'BTC/USD', bid: 43250, change: '+2.15%', up: true },
    { symbol: 'OIL/USD', bid: 72.50, change: '+1.25%', up: true },
    { symbol: 'US30', bid: 37500, change: '+0.40%', up: true },
  ])
  useEffect(() => { const i = setInterval(() => { setData(p => p.map(d => ({ ...d, bid: d.bid + (Math.random() - 0.5) * 0.1, change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(2) + '%', up: Math.random() > 0.5 }))) }, 2000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ bgcolor: '#0d1137', overflow: 'hidden', py: 1, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <Box sx={{ display: 'flex', gap: 4, px: 2 }}>
        {[...data, ...data].map((d, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>{d.symbol}</Typography>
            <Typography variant="body2" sx={{ color: d.up ? '#4caf50' : '#f44336' }}>{d.bid.toFixed(2)}</Typography>
            <Chip label={d.change} size="small" sx={{ bgcolor: d.up ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)', color: d.up ? '#4caf50' : '#f44336', fontSize: '0.7rem', height: 20 }} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const LoginModal = ({ open, onClose }) => {
  const [method, setMethod] = useState('phone')
  const [sc, setSc] = useState(countryCodes[0])
  const [countryMenu, setCountryMenu] = useState(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const textFieldSx = { mb: 2, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: cardBg, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' } }}>
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
        <Logo />
        <Typography variant="h5" sx={{ mt: 2 }}>Welcome Back</Typography>
        <Typography variant="body2" sx={{ color: '#8892b0' }}>Login to your trading account</Typography>
      </DialogTitle>
      <DialogContent>
        <Tabs value={method} onChange={(e, v) => setMethod(v)} centered sx={{ mb: 3, '& .MuiTab-root': { color: '#8892b0' }, '& .Mui-selected': { color: accent } }}>
          <Tab value="phone" icon={<Phone />} label="Phone" />
          <Tab value="email" icon={<Email />} label="Email" />
        </Tabs>
        {method === 'phone' ? (
          <>
            <Typography variant="body2" sx={{ color: '#8892b0', mb: 1 }}>Select Country</Typography>
            <Button fullWidth variant="outlined" onClick={(e) => setCountryMenu(e.currentTarget)} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', mb: 2, justifyContent: 'flex-start', gap: 1 }}>
              <span style={{ fontSize: 24 }}>{sc.flag}</span> {sc.name} ({sc.code})
            </Button>
            <Menu anchorEl={countryMenu} open={Boolean(countryMenu)} onClose={() => setCountryMenu(null)} PaperProps={{ sx: { bgcolor: cardBg, maxHeight: 300 } }}>
              {countryCodes.map((c, i) => (
                <MenuItem key={i} onClick={() => { setSc(c); setCountryMenu(null) }} sx={{ color: 'white', gap: 1 }}><span style={{ fontSize: 20 }}>{c.flag}</span> {c.name} ({c.code})</MenuItem>
              ))}
            </Menu>
            <TextField fullWidth placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} InputProps={{ startAdornment: <Typography sx={{ color: accent, mr: 1 }}>{sc.code}</Typography> }} sx={textFieldSx} />
          </>
        ) : (
          <TextField fullWidth type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: <Email sx={{ color: accent, mr: 1 }} /> }} sx={textFieldSx} />
        )}
        <TextField fullWidth type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} sx={textFieldSx} />
        <Button fullWidth variant="contained" size="large" sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: 2, py: 1.5 }}>Login</Button>
        <Typography textAlign="center" sx={{ mt: 2, color: '#8892b0' }}>Don't have an account? <Button sx={{ color: accent }}>Sign Up</Button></Typography>
      </DialogContent>
    </Dialog>
  )
}
EOFcat >> src/App.jsx << 'EOF'

const LoginModal = ({ open, onClose }) => {
  const [method, setMethod] = useState('phone')
  const [sc, setSc] = useState(countryCodes[0])
  const [countryMenu, setCountryMenu] = useState(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const textFieldSx = { mb: 2, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: cardBg, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' } }}>
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>
        <Logo />
        <Typography variant="h5" sx={{ mt: 2 }}>Welcome Back</Typography>
        <Typography variant="body2" sx={{ color: '#8892b0' }}>Login to your trading account</Typography>
      </DialogTitle>
      <DialogContent>
        <Tabs value={method} onChange={(e, v) => setMethod(v)} centered sx={{ mb: 3, '& .MuiTab-root': { color: '#8892b0' }, '& .Mui-selected': { color: accent } }}>
          <Tab value="phone" icon={<Phone />} label="Phone" />
          <Tab value="email" icon={<Email />} label="Email" />
        </Tabs>
        {method === 'phone' ? (
          <>
            <Typography variant="body2" sx={{ color: '#8892b0', mb: 1 }}>Select Country</Typography>
            <Button fullWidth variant="outlined" onClick={(e) => setCountryMenu(e.currentTarget)} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', mb: 2, justifyContent: 'flex-start', gap: 1 }}>
              <span style={{ fontSize: 24 }}>{sc.flag}</span> {sc.name} ({sc.code})
            </Button>
            <Menu anchorEl={countryMenu} open={Boolean(countryMenu)} onClose={() => setCountryMenu(null)} PaperProps={{ sx: { bgcolor: cardBg, maxHeight: 300 } }}>
              {countryCodes.map((c, i) => (
                <MenuItem key={i} onClick={() => { setSc(c); setCountryMenu(null) }} sx={{ color: 'white', gap: 1 }}><span style={{ fontSize: 20 }}>{c.flag}</span> {c.name} ({c.code})</MenuItem>
              ))}
            </Menu>
            <TextField fullWidth placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} InputProps={{ startAdornment: <Typography sx={{ color: accent, mr: 1 }}>{sc.code}</Typography> }} sx={textFieldSx} />
          </>
        ) : (
          <TextField fullWidth type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: <Email sx={{ color: accent, mr: 1 }} /> }} sx={textFieldSx} />
        )}
        <TextField fullWidth type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} sx={textFieldSx} />
        <Button fullWidth variant="contained" size="large" sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: 2, py: 1.5 }}>Login</Button>
        <Typography textAlign="center" sx={{ mt: 2, color: '#8892b0' }}>Don't have an account? <Button sx={{ color: accent }}>Sign Up</Button></Typography>
      </DialogContent>
    </Dialog>
  )
}

const VisitorCounter = () => {
  const [live, setLive] = useState(47)
  const [views, setViews] = useState(1247)
  useEffect(() => { const i = setInterval(() => { setLive(Math.floor(Math.random() * 30) + 30); setViews(v => v + Math.floor(Math.random() * 3)) }, 5000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(76,175,80,0.1)', px: 2, py: 1, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{live} Online</Typography>
      </Box>
      <Divider orientation="vertical" sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20 }} />
      <Visibility sx={{ color: accent, fontSize: 16 }} />
      <Typography variant="caption" sx={{ color: '#8892b0' }}>{views.toLocaleString()} Views</Typography>
    </Box>
  )
}

const LiveMessages = () => {
  const msg = [{ n: 'James K.', c: '🇰🇪', a: 'deposited', am: '$5,000' },{ n: 'Sarah M.', c: '🇬🇧', a: 'withdrew', am: '$2,500' },{ n: 'Ahmed R.', c: '🇦🇪', a: 'earned', am: '$1,200' },{ n: 'Oluwaseun A.', c: '🇳🇬', a: 'deposited', am: '$3,200' }]
  const [c, setC] = useState(0)
  useEffect(() => { const i = setInterval(() => setC(p => (p + 1) % msg.length), 3000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ position: 'fixed', bottom: 80, left: 20, zIndex: 1000 }}>
      <Paper sx={{ bgcolor: cardBg, p: 2, borderRadius: 2, border: '1px solid rgba(76,175,80,0.3)', maxWidth: 260 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{msg[c].c}</Typography>
          <Box><Typography variant="body2" sx={{ color: 'white' }}><strong>{msg[c].n}</strong> {msg[c].a}</Typography>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{msg[c].am}</Typography></Box>
        </Box>
      </Paper>
    </Box>
  )
}

const Chatbot = () => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ text: "👋 Hello! I'm your Easypayforex assistant. How can I help?", sender: 'bot' }])
  const [input, setInput] = useState('')
  const qr = ['📊 Open Account', '💰 Deposit', '📈 Trading Guide', '💬 Support']
  const send = () => { if(!input.trim()) return; setMsgs([...msgs, {text: input, sender: 'user'}]); setInput(''); setTimeout(() => setMsgs(p => [...p, {text: "Thanks! Our team is available 24/7. How else can I help?", sender: 'bot'}]), 1000) }
  return (
    <>
      <Fab onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 20, right: 20, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', zIndex: 1000 }}><Chat /></Fab>
      {open && (
        <Paper sx={{ position: 'fixed', bottom: 80, right: 20, width: 350, height: 450, bgcolor: cardBg, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'white', width: 32, height: 32 }}><Chat sx={{ color: accent, fontSize: 18 }} /></Avatar>
              <Box><Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>Easypayforex Bot</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>🟢 Online</Typography></Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {msgs.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Paper sx={{ p: 1.5, maxWidth: '80%', borderRadius: 2, bgcolor: m.sender === 'user' ? accent : '#1a1f4e', color: 'white' }}><Typography variant="body2">{m.text}</Typography></Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>{qr.map((q, i) => <Chip key={i} label={q} size="small" onClick={() => setInput(q)} sx={{ bgcolor: 'rgba(79,195,247,0.1)', color: accent, cursor: 'pointer' }} />)}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" placeholder="Type..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
              <IconButton onClick={send} sx={{ bgcolor: accent }}><Send sx={{ color: 'white' }} /></IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  )
}
EOFcat >> src/App.jsx << 'EOF'

const VisitorCounter = () => {
  const [live, setLive] = useState(47)
  const [views, setViews] = useState(1247)
  useEffect(() => { const i = setInterval(() => { setLive(Math.floor(Math.random() * 30) + 30); setViews(v => v + Math.floor(Math.random() * 3)) }, 5000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(76,175,80,0.1)', px: 2, py: 1, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{live} Online</Typography>
      </Box>
      <Divider orientation="vertical" sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20 }} />
      <Visibility sx={{ color: accent, fontSize: 16 }} />
      <Typography variant="caption" sx={{ color: '#8892b0' }}>{views.toLocaleString()} Views</Typography>
    </Box>
  )
}

const LiveMessages = () => {
  const msg = [{ n: 'James K.', c: '🇰🇪', a: 'deposited', am: '$5,000' },{ n: 'Sarah M.', c: '🇬🇧', a: 'withdrew', am: '$2,500' },{ n: 'Ahmed R.', c: '🇦🇪', a: 'earned', am: '$1,200' },{ n: 'Oluwaseun A.', c: '🇳🇬', a: 'deposited', am: '$3,200' }]
  const [c, setC] = useState(0)
  useEffect(() => { const i = setInterval(() => setC(p => (p + 1) % msg.length), 3000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ position: 'fixed', bottom: 80, left: 20, zIndex: 1000 }}>
      <Paper sx={{ bgcolor: cardBg, p: 2, borderRadius: 2, border: '1px solid rgba(76,175,80,0.3)', maxWidth: 260 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{msg[c].c}</Typography>
          <Box><Typography variant="body2" sx={{ color: 'white' }}><strong>{msg[c].n}</strong> {msg[c].a}</Typography>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{msg[c].am}</Typography></Box>
        </Box>
      </Paper>
    </Box>
  )
}

const Chatbot = () => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ text: "👋 Hello! I'm your Easypayforex assistant. How can I help?", sender: 'bot' }])
  const [input, setInput] = useState('')
  const qr = ['📊 Open Account', '💰 Deposit', '📈 Trading Guide', '💬 Support']
  const send = () => { if(!input.trim()) return; setMsgs([...msgs, {text: input, sender: 'user'}]); setInput(''); setTimeout(() => setMsgs(p => [...p, {text: "Thanks! Our team is available 24/7. How else can I help?", sender: 'bot'}]), 1000) }
  return (
    <>
      <Fab onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 20, right: 20, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', zIndex: 1000 }}><Chat /></Fab>
      {open && (
        <Paper sx={{ position: 'fixed', bottom: 80, right: 20, width: 350, height: 450, bgcolor: cardBg, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'white', width: 32, height: 32 }}><Chat sx={{ color: accent, fontSize: 18 }} /></Avatar>
              <Box><Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>Easypayforex Bot</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>🟢 Online</Typography></Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {msgs.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Paper sx={{ p: 1.5, maxWidth: '80%', borderRadius: 2, bgcolor: m.sender === 'user' ? accent : '#1a1f4e', color: 'white' }}><Typography variant="body2">{m.text}</Typography></Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>{qr.map((q, i) => <Chip key={i} label={q} size="small" onClick={() => setInput(q)} sx={{ bgcolor: 'rgba(79,195,247,0.1)', color: accent, cursor: 'pointer' }} />)}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" placeholder="Type..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
              <IconButton onClick={send} sx={{ bgcolor: accent }}><Send sx={{ color: 'white' }} /></IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  )
}
EOFcat >> src/App.jsx << 'EOF'

const VisitorCounter = () => {
  const [live, setLive] = useState(47)
  const [views, setViews] = useState(1247)
  useEffect(() => { const i = setInterval(() => { setLive(Math.floor(Math.random() * 30) + 30); setViews(v => v + Math.floor(Math.random() * 3)) }, 5000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(76,175,80,0.1)', px: 2, py: 1, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{live} Online</Typography>
      </Box>
      <Divider orientation="vertical" sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20 }} />
      <Visibility sx={{ color: accent, fontSize: 16 }} />
      <Typography variant="caption" sx={{ color: '#8892b0' }}>{views.toLocaleString()} Views</Typography>
    </Box>
  )
}

const LiveMessages = () => {
  const msg = [{ n: 'James K.', c: '🇰🇪', a: 'deposited', am: '$5,000' },{ n: 'Sarah M.', c: '🇬🇧', a: 'withdrew', am: '$2,500' },{ n: 'Ahmed R.', c: '🇦🇪', a: 'earned', am: '$1,200' },{ n: 'Oluwaseun A.', c: '🇳🇬', a: 'deposited', am: '$3,200' }]
  const [c, setC] = useState(0)
  useEffect(() => { const i = setInterval(() => setC(p => (p + 1) % msg.length), 3000); return () => clearInterval(i) }, [])
  return (
    <Box sx={{ position: 'fixed', bottom: 80, left: 20, zIndex: 1000 }}>
      <Paper sx={{ bgcolor: cardBg, p: 2, borderRadius: 2, border: '1px solid rgba(76,175,80,0.3)', maxWidth: 260 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{msg[c].c}</Typography>
          <Box><Typography variant="body2" sx={{ color: 'white' }}><strong>{msg[c].n}</strong> {msg[c].a}</Typography>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>{msg[c].am}</Typography></Box>
        </Box>
      </Paper>
    </Box>
  )
}

const Chatbot = () => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ text: "👋 Hello! I'm your Easypayforex assistant. How can I help?", sender: 'bot' }])
  const [input, setInput] = useState('')
  const qr = ['📊 Open Account', '💰 Deposit', '📈 Trading Guide', '💬 Support']
  const send = () => { if(!input.trim()) return; setMsgs([...msgs, {text: input, sender: 'user'}]); setInput(''); setTimeout(() => setMsgs(p => [...p, {text: "Thanks! Our team is available 24/7. How else can I help?", sender: 'bot'}]), 1000) }
  return (
    <>
      <Fab onClick={() => setOpen(true)} sx={{ position: 'fixed', bottom: 20, right: 20, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', zIndex: 1000 }}><Chat /></Fab>
      {open && (
        <Paper sx={{ position: 'fixed', bottom: 80, right: 20, width: 350, height: 450, bgcolor: cardBg, borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'white', width: 32, height: 32 }}><Chat sx={{ color: accent, fontSize: 18 }} /></Avatar>
              <Box><Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>Easypayforex Bot</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>🟢 Online</Typography></Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}><Close /></IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {msgs.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
                <Paper sx={{ p: 1.5, maxWidth: '80%', borderRadius: 2, bgcolor: m.sender === 'user' ? accent : '#1a1f4e', color: 'white' }}><Typography variant="body2">{m.text}</Typography></Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>{qr.map((q, i) => <Chip key={i} label={q} size="small" onClick={() => setInput(q)} sx={{ bgcolor: 'rgba(79,195,247,0.1)', color: accent, cursor: 'pointer' }} />)}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField fullWidth size="small" placeholder="Type..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && send()} sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} />
              <IconButton onClick={send} sx={{ bgcolor: accent }}><Send sx={{ color: 'white' }} /></IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  )
}

const HomePage = ({ onLogin }) => (
  <Box sx={{ bgcolor: darkBg, minHeight: '100vh' }}>
    <Toolbar />
    <Box sx={{ position: 'relative', overflow: 'hidden', py: 10 }}>
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,77,255,0.3), transparent)' }} />
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <VisitorCounter />
            <Typography variant="h2" fontWeight="bold" sx={{ color: 'white', mt: 3, mb: 2 }}>Trade Smarter with <Box component="span" sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Intelligence</Box></Typography>
            <Typography variant="h6" sx={{ color: '#8892b0', mb: 4 }}>Advanced trading platform for Forex, Commodities & Indices.</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" onClick={onLogin} sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', px: 4, py: 1.5, borderRadius: 2 }} endIcon={<ArrowForward />}>Start Trading</Button>
              <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', px: 4, py: 1.5, borderRadius: 2 }}>Watch Demo</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3 }}>
              <Typography sx={{ color: accent, mb: 2 }} fontWeight="bold">📈 Live Market</Typography>
              {[{ p: 'EUR/USD', pr: '1.0850', c: '+0.15%', s: 'BUY' },{ p: 'GBP/USD', pr: '1.2650', c: '-0.20%', s: 'SELL' },{ p: 'XAU/USD', pr: '2,025.50', c: '+0.62%', s: 'BUY' },{ p: 'US30', pr: '37,500', c: '+0.40%', s: 'BUY' }].map((m, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{m.p}</Typography>
                  <Typography sx={{ color: 'white' }}>{m.pr}</Typography>
                  <Typography variant="caption" sx={{ color: m.c.startsWith('+') ? '#4caf50' : '#f44336' }}>{m.c}</Typography>
                  <Chip label={m.s} size="small" sx={{ bgcolor: m.s === 'BUY' ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)', color: m.s === 'BUY' ? '#4caf50' : '#f44336' }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Box>
)

function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  return (
    <Box>
      <AppBar position="fixed" sx={{ background: 'rgba(10,14,39,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}><Logo /></Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {['Markets', 'Trading', 'AI'].map(t => <Button key={t} sx={{ color: '#8892b0' }}>{t}</Button>)}
            <VisitorCounter />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <Button variant="outlined" onClick={() => setLoginOpen(true)} sx={{ color: accent, borderColor: accent, borderRadius: 2 }}>Login</Button>
            <Button variant="contained" onClick={() => setLoginOpen(true)} sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: 2 }}>Get Started</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <LiveTicker />
      <Routes><Route path="/" element={<HomePage onLogin={() => setLoginOpen(true)} />} /></Routes>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Chatbot />
      <LiveMessages />
    </Box>
  )
}
export default App
EOFcat >> src/App.jsx << 'EOF'

const HomePage = ({ onLogin }) => (
  <Box sx={{ bgcolor: darkBg, minHeight: '100vh' }}>
    <Toolbar />
    <Box sx={{ position: 'relative', overflow: 'hidden', py: 10 }}>
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(127,77,255,0.3), transparent)' }} />
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <VisitorCounter />
            <Typography variant="h2" fontWeight="bold" sx={{ color: 'white', mt: 3, mb: 2 }}>Trade Smarter with <Box component="span" sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Intelligence</Box></Typography>
            <Typography variant="h6" sx={{ color: '#8892b0', mb: 4 }}>Advanced trading platform for Forex, Commodities & Indices.</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" onClick={onLogin} sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', px: 4, py: 1.5, borderRadius: 2 }} endIcon={<ArrowForward />}>Start Trading</Button>
              <Button variant="outlined" size="large" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', px: 4, py: 1.5, borderRadius: 2 }}>Watch Demo</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3 }}>
              <Typography sx={{ color: accent, mb: 2 }} fontWeight="bold">📈 Live Market</Typography>
              {[{ p: 'EUR/USD', pr: '1.0850', c: '+0.15%', s: 'BUY' },{ p: 'GBP/USD', pr: '1.2650', c: '-0.20%', s: 'SELL' },{ p: 'XAU/USD', pr: '2,025.50', c: '+0.62%', s: 'BUY' },{ p: 'US30', pr: '37,500', c: '+0.40%', s: 'BUY' }].map((m, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{m.p}</Typography>
                  <Typography sx={{ color: 'white' }}>{m.pr}</Typography>
                  <Typography variant="caption" sx={{ color: m.c.startsWith('+') ? '#4caf50' : '#f44336' }}>{m.c}</Typography>
                  <Chip label={m.s} size="small" sx={{ bgcolor: m.s === 'BUY' ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)', color: m.s === 'BUY' ? '#4caf50' : '#f44336' }} />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </Box>
)

function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  return (
    <Box>
      <AppBar position="fixed" sx={{ background: 'rgba(10,14,39,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}><Logo /></Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {['Markets', 'Trading', 'AI'].map(t => <Button key={t} sx={{ color: '#8892b0' }}>{t}</Button>)}
            <VisitorCounter />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <Button variant="outlined" onClick={() => setLoginOpen(true)} sx={{ color: accent, borderColor: accent, borderRadius: 2 }}>Login</Button>
            <Button variant="contained" onClick={() => setLoginOpen(true)} sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius: 2 }}>Get Started</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <LiveTicker />
      <Routes><Route path="/" element={<HomePage onLogin={() => setLoginOpen(true)} />} /></Routes>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Chatbot />
      <LiveMessages />
    </Box>
  )
}
export default App
