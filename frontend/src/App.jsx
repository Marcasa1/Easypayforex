import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Grid, Paper, Chip, TextField,
  InputAdornment, IconButton, AppBar, Toolbar, MenuItem, Card, CardContent,
  CardMedia, Checkbox, FormControlLabel, Fab, Avatar, List, ListItem,
  ListItemText, ListItemAvatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Badge
} from '@mui/material'
import {
  TrendingUp, ShowChart, ArrowForward, Person, Phone, Email, Lock,
  Visibility, VisibilityOff, Star, AccountBalanceWallet, ArrowUpward,
  ArrowDownward, Chat, Send, Close, Public, Search, Group, Article, CheckCircle
} from '@mui/icons-material'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { marketAPI, tradingAPI, walletAPI, authAPI } from './services/api'
import { io } from 'socket.io-client'

// ---------- Dark theme ----------
const darkBg   = '#0a0b1e'
const cardBg   = '#13152a'
const accent   = '#4fc3f7'
const green    = '#00d4aa'
const red      = '#ff4757'
const gold     = '#ffc107'
const fieldStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }
  }
}

// ---------- All 195+ Countries ----------
const allCountries = [
  { code: "+93", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", name: "Albania" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+376", flag: "🇦🇩", name: "Andorra" },
  { code: "+244", flag: "🇦🇴", name: "Angola" },
  { code: "+1-268", flag: "🇦🇬", name: "Antigua and Barbuda" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+374", flag: "🇦🇲", name: "Armenia" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+1-242", flag: "🇧🇸", name: "Bahamas" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+1-246", flag: "🇧🇧", name: "Barbados" },
  { code: "+375", flag: "🇧🇾", name: "Belarus" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+501", flag: "🇧🇿", name: "Belize" },
  { code: "+229", flag: "🇧🇯", name: "Benin" },
  { code: "+975", flag: "🇧🇹", name: "Bhutan" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+387", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
  { code: "+267", flag: "🇧🇼", name: "Botswana" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+238", flag: "🇨🇻", name: "Cabo Verde" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+236", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+235", flag: "🇹🇩", name: "Chad" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+269", flag: "🇰🇲", name: "Comoros" },
  { code: "+242", flag: "🇨🇬", name: "Congo (Congo-Brazzaville)" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+385", flag: "🇭🇷", name: "Croatia" },
  { code: "+53", flag: "🇨🇺", name: "Cuba" },
  { code: "+357", flag: "🇨🇾", name: "Cyprus" },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+243", flag: "🇨🇩", name: "Democratic Republic of the Congo" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "+1-767", flag: "🇩🇲", name: "Dominica" },
  { code: "+1-809", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+291", flag: "🇪🇷", name: "Eritrea" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+268", flag: "🇸🇿", name: "Eswatini" },
  { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+679", flag: "🇫🇯", name: "Fiji" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", flag: "🇬🇲", name: "Gambia" },
  { code: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+30", flag: "🇬🇷", name: "Greece" },
  { code: "+1-473", flag: "🇬🇩", name: "Grenada" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+224", flag: "🇬🇳", name: "Guinea" },
  { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+592", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", flag: "🇭🇹", name: "Haiti" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+36", flag: "🇭🇺", name: "Hungary" },
  { code: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+1-876", flag: "🇯🇲", name: "Jamaica" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+7", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+686", flag: "🇰🇮", name: "Kiribati" },
  { code: "+383", flag: "🇽🇰", name: "Kosovo" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+371", flag: "🇱🇻", name: "Latvia" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+266", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", flag: "🇱🇾", name: "Libya" },
  { code: "+423", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+261", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", flag: "🇲🇼", name: "Malawi" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+960", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+356", flag: "🇲🇹", name: "Malta" },
  { code: "+692", flag: "🇲🇭", name: "Marshall Islands" },
  { code: "+222", flag: "🇲🇷", name: "Mauritania" },
  { code: "+230", flag: "🇲🇺", name: "Mauritius" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+691", flag: "🇫🇲", name: "Micronesia" },
  { code: "+373", flag: "🇲🇩", name: "Moldova" },
  { code: "+377", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", flag: "🇲🇳", name: "Mongolia" },
  { code: "+382", flag: "🇲🇪", name: "Montenegro" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+258", flag: "🇲🇿", name: "Mozambique" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar (Burma)" },
  { code: "+264", flag: "🇳🇦", name: "Namibia" },
  { code: "+674", flag: "🇳🇷", name: "Nauru" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+850", flag: "🇰🇵", name: "North Korea" },
  { code: "+389", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+680", flag: "🇵🇼", name: "Palau" },
  { code: "+507", flag: "🇵🇦", name: "Panama" },
  { code: "+675", flag: "🇵🇬", name: "Papua New Guinea" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51", flag: "🇵🇪", name: "Peru" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+40", flag: "🇷🇴", name: "Romania" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "+250", flag: "🇷🇼", name: "Rwanda" },
  { code: "+1-869", flag: "🇰🇳", name: "Saint Kitts and Nevis" },
  { code: "+1-758", flag: "🇱🇨", name: "Saint Lucia" },
  { code: "+1-784", flag: "🇻🇨", name: "Saint Vincent and the Grenadines" },
  { code: "+685", flag: "🇼🇸", name: "Samoa" },
  { code: "+378", flag: "🇸🇲", name: "San Marino" },
  { code: "+239", flag: "🇸🇹", name: "São Tomé and Príncipe" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+221", flag: "🇸🇳", name: "Senegal" },
  { code: "+381", flag: "🇷🇸", name: "Serbia" },
  { code: "+248", flag: "🇸🇨", name: "Seychelles" },
  { code: "+232", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+421", flag: "🇸🇰", name: "Slovakia" },
  { code: "+386", flag: "🇸🇮", name: "Slovenia" },
  { code: "+677", flag: "🇸🇧", name: "Solomon Islands" },
  { code: "+252", flag: "🇸🇴", name: "Somalia" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+211", flag: "🇸🇸", name: "South Sudan" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+249", flag: "🇸🇩", name: "Sudan" },
  { code: "+597", flag: "🇸🇷", name: "Suriname" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "+963", flag: "🇸🇾", name: "Syria" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+992", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+670", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+676", flag: "🇹🇴", name: "Tonga" },
  { code: "+1-868", flag: "🇹🇹", name: "Trinidad and Tobago" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+993", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+688", flag: "🇹🇻", name: "Tuvalu" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+678", flag: "🇻🇺", name: "Vanuatu" },
  { code: "+379", flag: "🇻🇦", name: "Vatican City" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+967", flag: "🇾🇪", name: "Yemen" },
  { code: "+260", flag: "🇿🇲", name: "Zambia" },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe" }
]

const tradingImages = [
  '/images/trading/chart1.jpg',
  '/images/trading/chart2.jpg',
  '/images/trading/chart3.jpg',
  '/images/trading/chart4.jpg'
]

const popups = [
  "🇰🇪 James won EUR/USD +$1,250",
  "🇬🇧 Sarah gained GBP/USD +$890",
  "🇦🇪 Ahmed earned Gold +$2,340",
  "🇳🇬 David profited BTC +$3,120"
]

const reviews = [
  { name: "Forex Expert", comment: "Best spreads! EUR/USD at 0.1 pips. Fast execution.", rating: 5, flag: "🇺🇸" },
  { name: "Gold Trader", comment: "XAU/USD execution is lightning fast. Great platform!", rating: 5, flag: "🇦🇪" },
  { name: "Index Master", comment: "US30 and S&P500 charts are crystal clear.", rating: 4, flag: "🇬🇧" },
  { name: "Crypto King", comment: "BTC/USD competitive spreads. Highly recommend!", rating: 5, flag: "🇳🇬" }
]

const newsItems = [
  { title: 'Fed Signals Potential Rate Cut in September', time: '2 hours ago', cat: 'Forex' },
  { title: 'Gold Hits All-Time High Amid Global Uncertainty', time: '4 hours ago', cat: 'Commodities' },
  { title: 'S&P 500 Reaches New Milestone Above 5,000', time: '6 hours ago', cat: 'Indices' }
]

const liveJoins = [
  { name: 'Michael R.', country: '🇺🇸', time: 'just now' },
  { name: 'Sarah K.', country: '🇬🇧', time: '30 sec ago' },
  { name: 'Ahmed M.', country: '🇦🇪', time: '1 min ago' },
  { name: 'Priya S.', country: '🇮🇳', time: '2 min ago' },
  { name: 'Chen W.', country: '🇨🇳', time: '3 min ago' }
]

// ---------- Components ----------
const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box sx={{ width: 42, height: 42, borderRadius: 2, overflow: 'hidden' }}>
      <img src="/images/logo.jpg" alt="EASYPAYFOREX" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </Box>
    <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
      EASYPAY<span style={{ color: accent }}>FOREX</span>
    </Typography>
  </Box>
)

const Navbar = () => (
  <AppBar position="fixed" sx={{ background: 'rgba(10,11,30,0.95)', zIndex: 1100 }}>
    <Toolbar>
      <Logo />
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
        {['Home','Markets','Trading','Portfolio','Dashboard'].map(item => (
          <Typography key={item} component="a"
            href={item==='Home'?'/':`/${item.toLowerCase()}`}
            sx={{ color:'#8892b0', textDecoration:'none', fontSize:'0.9rem', '&:hover':{color:'white'} }}>
            {item}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
        <Badge badgeContent={liveJoins.length} color="success">
          <IconButton sx={{ color:'#8892b0' }}><Group /></IconButton>
        </Badge>
        <Button variant="outlined" href="/login"
          sx={{ color:'white', borderColor:'rgba(255,255,255,0.3)', borderRadius:2, fontSize:'0.85rem' }}>
          Login
        </Button>
        <Button variant="contained" href="/register"
          sx={{ background:'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius:2, fontSize:'0.85rem' }}>
          Create Account
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
)

const LiveTicker = ({ markets }) => {
  if (!markets.length) return null
  return (
    <Box sx={{ bgcolor: '#0d1137', overflow: 'hidden', py: 1.2, mt: 8 }}>
      <Box sx={{ display: 'flex', gap: 5, px: 2, animation: 'scroll 35s linear infinite' }}>
        {[...markets, ...markets].map((item, i) => (
          <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1.5, whiteSpace:'nowrap' }}>
            <Typography variant="body2" sx={{ color:'white', fontWeight:'bold' }}>{item.pair}</Typography>
            <Typography variant="body2" sx={{ color: item.up ? green : red }}>{item.price}</Typography>
            <Chip label={item.change} size="small"
              sx={{ bgcolor: item.up ? 'rgba(0,212,170,0.2)' : 'rgba(255,71,87,0.2)', color: item.up ? green : red, fontSize:'0.7rem', height:20 }} />
          </Box>
        ))}
      </Box>
      <style>{'@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}'}</style>
    </Box>
  )
}

const TradePopups = () => {
  const [i, setI] = useState(0)
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setInterval(() => {
      setShow(false)
      setTimeout(() => { setI(p => (p+1)%popups.length); setShow(true) }, 300)
    }, 3500)
    return () => clearInterval(t)
  }, [])
  return (
    <Box sx={{ position:"fixed", bottom:100, left:20, zIndex:998 }}>
      {show && <Paper sx={{ bgcolor:"rgba(0,212,170,0.95)", color:"white", p:1.5, borderRadius:2, maxWidth:300 }}>
        <Typography variant="body2">🎉 {popups[i]}</Typography>
      </Paper>}
    </Box>
  )
}

const AIChatbot = () => {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ text: "👋 Hello! Ask me about forex, commodities, indices, trading strategies, account help, deposits, withdrawals, or platform features.", sender: 'bot' }])
  const [input, setInput] = useState('')
  const quickReplies = ['📊 EUR/USD Signal','📈 XAU/USD Analysis','💰 Deposit Help','📉 Market News','🤖 AI Prediction','🏦 Account Types','💳 Withdrawal','📱 Mobile Trading','🛡️ Security']

  const knowledge = {
    'eur/usd':'EUR/USD is currently trading at the price shown on the live ticker. Our AI suggests a BUY with a tight stop loss at 1.0800 and take profit at 1.0920. Confidence: 72%.',
    'gbp/usd':'GBP/USD is under bearish pressure. A SELL position is recommended with stop loss at 1.2700 and take profit at 1.2580.',
    'usd/jpy':'USD/JPY is in an uptrend. BUY at current levels, targeting 149.20 with a stop at 148.10.',
    'xau/usd':'Gold (XAU/USD) is breaking resistance. Strong BUY signal. Target $2,050, stop loss $2,015.',
    'btc/usd':'Bitcoin is volatile. Our AI sees a potential rally to $45,000. BUY with caution.',
    'oil':'Crude oil is rallying on supply concerns. BUY at current price, target $75.00.',
    'deposit':'To deposit funds: Go to Wallet → Deposit. We accept Stripe, PayPal, Skrill, Neteller, and bank transfer. Minimum deposit is $50.',
    'withdraw':'To withdraw: Go to Wallet → Withdraw. Withdrawals are processed within 24 hours. Minimum withdrawal is $50.',
    'account types':'We offer Individual, Corporate, and Affiliate accounts. Individual accounts are for personal traders. Corporate accounts are for businesses. Affiliate accounts allow you to earn commissions by referring others.',
    'affiliate':'As an affiliate, you earn up to 20% commission on every trade made by your referrals. Share your unique link and earn passive income.',
    'spread':'Our spreads are among the lowest in the industry – starting from 0.0 pips on major forex pairs.',
    'leverage':'We offer leverage up to 1:100 for forex, 1:50 for commodities, and 1:20 for indices.',
    'margin':'Margin is the amount required to open a trade. For example, with 1:100 leverage, a $100,000 position requires only $1,000 margin.',
    'security':'We use bank‑grade encryption, two‑factor authentication (2FA), and segregated client accounts to keep your funds safe.',
    'kyc':'KYC (Know Your Customer) verification is required to comply with regulations. Upload your ID and proof of address in the Profile section.',
    'mobile':'Yes! Our platform is fully responsive. You can trade from your mobile browser or our upcoming app.',
    'demo':'We offer a free demo account with $10,000 virtual funds. Click "View Demo" on the home page to try it.',
    'contact':'Our support team is available 24/7 via live chat, email (support@easypayforex.com), or phone.',
    'signals':'Our AI trading signals analyze market trends and generate BUY/SELL recommendations with entry, stop loss, and take profit levels.',
    'forex':'Forex is the largest financial market. We offer 50+ currency pairs with tight spreads and fast execution.',
    'commodities':'Trade gold, silver, oil, and natural gas with competitive spreads and leverage up to 1:50.',
    'indices':'Trade global indices like S&P 500, NASDAQ, Dow Jones, FTSE 100, and DAX with low commissions.',
    'crypto':'We offer Bitcoin, Ethereum, and other crypto CFDs with 24/7 trading.',
    'education':'We provide free educational resources including webinars, tutorials, and market analysis to help you improve your trading skills.',
    'platform':'Our platform is web‑based, no download required. You can trade from any device with an internet connection.',
  }

  const getAnswer = (question) => {
    const q = question.toLowerCase().replace(/[^a-z0-9\s]/g, '')
    for (let [key, answer] of Object.entries(knowledge)) {
      if (q.includes(key)) return answer
    }
    if (q.match(/^(hi|hello|hey|what's up|good morning)/)) return "Hello! How can I help you with your trading today?"
    if (q.includes('thank')) return "You're welcome! Happy trading! 🚀"
    if (q.includes('help')) return "I can help with forex signals, account questions, deposits/withdrawals, platform features, and trading strategies. Just ask!"
    if (q.includes('price') || q.includes('market')) return "Check the live ticker at the top of the page for real‑time prices, or visit the Markets page."
    return "I'm not sure about that. Try asking about forex signals, deposits, withdrawals, account types, or trading strategies. You can also type 'help' for a list of topics."
  }

  const send = () => {
    if (!input.trim()) return
    setMsgs([...msgs, { text: input, sender: 'user' }])
    const reply = getAnswer(input)
    setInput('')
    setTimeout(() => setMsgs(p => [...p, { text: reply, sender: 'bot' }]), 500)
  }

  return (
    <>
      <Fab onClick={() => setOpen(true)} sx={{ position:'fixed', bottom:24, right:24, background:'linear-gradient(135deg, #4fc3f7, #7c4dff)', zIndex:1000 }}>
        <Chat />
      </Fab>
      {open && (
        <Paper sx={{ position:'fixed', bottom:90, right:24, width:380, height:500, bgcolor:cardBg, borderRadius:3, border:'1px solid rgba(255,255,255,0.1)', zIndex:1000, display:'flex', flexDirection:'column' }}>
          <Box sx={{ p:2, background:'linear-gradient(135deg, #4fc3f7, #7c4dff)', borderRadius:'12px 12px 0 0', display:'flex', justifyContent:'space-between' }}>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
              <Avatar sx={{ bgcolor:'white', width:36, height:36 }}>🤖</Avatar>
              <Box>
                <Typography variant="body2" sx={{ color:'white', fontWeight:'bold' }}>AI Assistant</Typography>
                <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.8)' }}>🟢 Online | Answers all questions</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color:'white' }}><Close /></IconButton>
          </Box>
          <Box sx={{ flexGrow:1, overflow:'auto', p:2 }}>
            {msgs.map((m, i) => (
              <Box key={i} sx={{ display:'flex', justifyContent:m.sender==='user'?'flex-end':'flex-start', mb:1 }}>
                <Paper sx={{ p:1.5, maxWidth:'85%', borderRadius:2, bgcolor:m.sender==='user'?accent:'#1a1f4e', color:'white' }}>
                  <Typography variant="body2">{m.text}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          <Box sx={{ p:1.5, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display:'flex', gap:0.5, mb:1, flexWrap:'wrap' }}>
              {quickReplies.map((q, i) => (
                <Chip key={i} label={q} size="small"
                  onClick={() => { setInput(q); setTimeout(send, 100) }}
                  sx={{ bgcolor:'rgba(79,195,247,0.1)', color:accent, cursor:'pointer', fontSize:'0.65rem' }} />
              ))}
            </Box>
            <Box sx={{ display:'flex', gap:1 }}>
              <TextField fullWidth size="small" placeholder="Ask me anything..."
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key==='Enter' && send()}
                sx={{ '& .MuiOutlinedInput-root':{color:'white','& fieldset':{borderColor:'rgba(255,255,255,0.2)'}} }} />
              <IconButton onClick={send} sx={{ bgcolor:accent }}>
                <Send sx={{ color:'white' }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  )
}

// ---------- Login Page ----------
const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields')
      return
    }
    try {
      const res = await authAPI.login({
        email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
        phoneNumber: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
        password
      })
      localStorage.setItem('easypayforex_token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ bgcolor: cardBg, p: 4, borderRadius: 3, maxWidth: 400, width: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
          Login to EASYPAYFOREX
        </Typography>
        {error && <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
        <TextField
          fullWidth placeholder="Email or Phone Number" value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#8892b0' }} /></InputAdornment> }}
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
        />
        <TextField
          fullWidth type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#8892b0' }} /></InputAdornment> }}
          sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
        />
        <Button
          fullWidth variant="contained" size="large" onClick={handleLogin}
          sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
        >
          Login
        </Button>
        <Typography sx={{ color: '#8892b0', textAlign: 'center', mt: 2 }}>
          Don't have an account? <Button component="a" href="/register" sx={{ color: accent, textTransform: 'none' }}>Sign Up</Button>
        </Typography>
      </Paper>
    </Box>
  )
}

// ---------- Pages ----------
const HomePage = ({ markets }) => (
  <Box sx={{ bgcolor: darkBg, minHeight: '100vh' }}>
    <Box sx={{ py: 10 }}>
      <Container>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Chip label="🚀 Trusted by 12,000+ Traders Worldwide"
              sx={{ bgcolor:'rgba(79,195,247,0.1)', color:accent, mb:2, borderRadius:2 }} />
            <Typography variant="h2" fontWeight="bold" sx={{ color:'white', mb:2 }}>
              Elevate your <Box component="span" sx={{ color:accent }}>trading edge</Box>
            </Typography>
            <Typography variant="h6" sx={{ color:'#8892b0', mb:4 }}>
              Institutional-grade signals, real-time analytics, and expert mentorship.
            </Typography>
            <Box sx={{ display:'flex', gap:2 }}>
              <Button variant="contained" size="large" href="/register"
                sx={{
                  background:'linear-gradient(135deg, #4fc3f7, #7c4dff)',
                  px:5, py:1.8, borderRadius:2, fontSize:'1.1rem'
                }} endIcon={<ArrowForward />}>
                Start Trading
              </Button>
              <Button variant="outlined" size="large" href="/demo"
                sx={{
                  color:'white', borderColor:'rgba(255,255,255,0.3)',
                  px:5, py:1.8, borderRadius:2
                }}>
                View Demo
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:4 }}>
              <Typography sx={{ color:accent, mb:2 }} fontWeight="bold">📈 Live Market</Typography>
              {markets.slice(0,5).map((m,i) => (
                <Box key={i} sx={{
                  display:'flex', justifyContent:'space-between', py:1.5,
                  borderBottom: i<4 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                  <Typography sx={{ color:'white', fontWeight:'bold' }}>{m.pair}</Typography>
                  <Typography sx={{ color:'white' }}>{m.price}</Typography>
                  <Typography sx={{ color:m.up?green:red, fontSize:'0.85rem' }}>{m.change}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Container sx={{ pb:8 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color:'white', mb:4, textAlign:'center' }}>
        Trading Platform Preview
      </Typography>
      <Grid container spacing={3}>
        {tradingImages.map((img, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{
              bgcolor:cardBg, borderRadius:3, overflow:'hidden',
              border:'1px solid rgba(255,255,255,0.05)'
            }}>
              <CardMedia component="img" height="200" image={img} />
              <CardContent>
                <Typography variant="body2" sx={{ color:'white', textAlign:'center' }}>
                  {['Advanced Charts','Real-time Analytics','Mobile Trading','AI Signals'][i]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
)

const RegisterPage = () => {
  const [accountType, setAccountType] = useState('individual')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0])
  const [showCountryList, setShowCountryList] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <Box sx={{ bgcolor:darkBg, minHeight:'100vh', pt:8 }}>
      <Container maxWidth="lg" sx={{ py:4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Logo />
            <Typography variant="h3" fontWeight="bold" sx={{ color:'white', mt:4, mb:2 }}>
              Elevate your <Box component="span" sx={{ color:accent }}>trading edge</Box>
            </Typography>
            <Grid container spacing={2}>
              {[{ value:'12K+', label:'ACTIVE TRADERS' },{ value:'84%', label:'WIN RATE' },{ value:'$2.4B', label:'MANAGED VOLUME' }].map((s,i) => (
                <Grid item xs={4} key={i}>
                  <Box sx={{ textAlign:'center', p:2, bgcolor:cardBg, borderRadius:2 }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color:'white' }}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ color:'#8892b0' }}>{s.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ bgcolor:cardBg, p:4, borderRadius:4 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color:'white', mb:2 }}>Create Account</Typography>
              <Box sx={{ display:'flex', gap:1, mb:4 }}>
                {[{ type:'individual', label:'Individual', icon:<Person /> },{ type:'corporate', label:'Corporate', icon:<AccountBalanceWallet /> },{ type:'affiliate', label:'Affiliate', icon:<Star /> }].map((item) => (
                  <Button key={item.type} fullWidth
                    variant={accountType===item.type ? 'contained' : 'outlined'}
                    onClick={() => setAccountType(item.type)}
                    sx={{
                      py:1.5, borderRadius:2,
                      bgcolor: accountType===item.type ? accent : 'transparent',
                      color: accountType===item.type ? 'white' : '#8892b0',
                      borderColor:'rgba(255,255,255,0.1)',
                      flexDirection:'column', gap:0.5
                    }}>
                    {item.icon}<Typography variant="caption">{item.label}</Typography>
                  </Button>
                ))}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}><TextField fullWidth placeholder="First Name" InputProps={{ startAdornment:<InputAdornment position="start"><Person /></InputAdornment> }} sx={fieldStyle} /></Grid>
                <Grid item xs={6}><TextField fullWidth placeholder="Last Name" InputProps={{ startAdornment:<InputAdornment position="start"><Person /></InputAdornment> }} sx={fieldStyle} /></Grid>
                <Grid item xs={12}><TextField fullWidth placeholder="Email" type="email" InputProps={{ startAdornment:<InputAdornment position="start"><Email /></InputAdornment> }} sx={fieldStyle} /></Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="outlined" onClick={() => setShowCountryList(!showCountryList)}
                    sx={{
                      color:'white', borderColor:'rgba(255,255,255,0.1)',
                      mb:1, justifyContent:'flex-start', py:1.5, textTransform:'none'
                    }}>
                    <span style={{ fontSize:24, marginRight:8 }}>{selectedCountry.flag}</span>
                    {selectedCountry.name} ({selectedCountry.code})
                  </Button>
                  {showCountryList && (
                    <Paper sx={{ maxHeight:200, overflow:'auto', bgcolor:'#1a1f4e', mb:1 }}>
                      {allCountries.map((c,i) => (
                        <Button key={i} fullWidth
                          onClick={() => { setSelectedCountry(c); setShowCountryList(false) }}
                          sx={{ color:'white', justifyContent:'flex-start', py:1 }}>
                          <span style={{ fontSize:20, marginRight:8 }}>{c.flag}</span>{c.name} ({c.code})
                        </Button>
                      ))}
                    </Paper>
                  )}
                  <TextField fullWidth placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    InputProps={{
                      startAdornment:<InputAdornment position="start">
                        <Typography sx={{ color:accent, fontWeight:'bold' }}>{selectedCountry.code}</Typography>
                      </InputAdornment>
                    }} sx={fieldStyle} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth placeholder="Password" type={showPassword?'text':'password'}
                    InputProps={{
                      startAdornment:<InputAdornment position="start"><Lock /></InputAdornment>,
                      endAdornment:<InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }} sx={fieldStyle} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth select defaultValue="" sx={fieldStyle}>
                    <MenuItem value="">Trading Experience</MenuItem>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} sx={{ color:accent }} />}
                    label={<Typography variant="body2" sx={{ color:'#8892b0' }}>I agree to Terms. I am 18+.</Typography>} />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" size="large" disabled={!agreeTerms}
                    sx={{
                      background:'linear-gradient(135deg, #4fc3f7, #7c4dff)',
                      py:1.8, borderRadius:2, fontSize:'1rem'
                    }}>
                    Create Account
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

const MarketsPage = ({ markets }) => (
  <Box sx={{ bgcolor:darkBg, minHeight:'100vh', pt:10 }}>
    <Container maxWidth="xl" sx={{ py:4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color:'white', mb:4 }}>🌍 Global Markets</Typography>
      <Grid container spacing={3} sx={{ mb:4 }}>
        {markets.map((m,i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper sx={{ bgcolor:cardBg, p:2.5, borderRadius:3, border:'1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="body2" sx={{ color:'#8892b0' }}>{m.pair}</Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color:'white', my:1 }}>{m.price}</Typography>
              <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                {m.up ? <ArrowUpward sx={{ color:green, fontSize:16 }} /> : <ArrowDownward sx={{ color:red, fontSize:16 }} />}
                <Typography sx={{ color:m.up?green:red, fontWeight:'bold' }}>{m.change}</Typography>
              </Box>
              <Chip label={m.up?"BUY":"SELL"} size="small"
                sx={{ mt:1, bgcolor:m.up?"rgba(0,212,170,0.2)":"rgba(255,71,87,0.2)", color:m.up?green:red }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3, mb:4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>📰 Latest Trading News</Typography>
        <List>
          {newsItems.map((n,i) => (
            <ListItem key={i}>
              <ListItemAvatar><Avatar sx={{ bgcolor:'rgba(79,195,247,0.1)' }}><Article /></Avatar></ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ color:'white' }}>{n.title}</Typography>}
                secondary={
                  <Box sx={{ display:'flex', gap:1 }}>
                    <Chip label={n.cat} size="small" sx={{ bgcolor:'rgba(79,195,247,0.1)', color:accent, fontSize:'0.6rem', height:18 }} />
                    <Typography variant="caption" sx={{ color:'#8892b0' }}>{n.time}</Typography>
                  </Box>
                } />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Typography variant="h5" fontWeight="bold" sx={{ color:'white', mb:3 }}>⭐ Global Trader Reviews</Typography>
      <Grid container spacing={3}>
        {reviews.map((r,i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
                <Typography fontSize={24}>{r.flag}</Typography>
                <Typography variant="h6" sx={{ color:'white' }}>{r.name}</Typography>
                <Box sx={{ color:gold }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</Box>
              </Box>
              <Typography variant="body2" sx={{ color:'#8892b0' }}>"{r.comment}"</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3, mt:3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>👥 Live Join Activity</Typography>
        <Box sx={{ display:'flex', gap:2, flexWrap:'wrap' }}>
          {liveJoins.map((j,i) => (
            <Chip key={i}
              avatar={<Avatar sx={{ bgcolor:green, width:24, height:24 }}><Person sx={{ fontSize:14 }} /></Avatar>}
              label={<Typography variant="caption" sx={{ color:'white' }}>{j.name} {j.country} joined {j.time}</Typography>}
              sx={{ bgcolor:'rgba(0,212,170,0.1)', border:'1px solid rgba(0,212,170,0.2)' }} />
          ))}
        </Box>
      </Paper>
    </Container>
  </Box>
)

const TradingPage = ({ markets }) => {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [volume, setVolume] = useState('0.01')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)

  const getTVSymbol = (pair) => {
    if (pair === 'XAU/USD') return 'XAUUSD'
    if (pair === 'XAG/USD') return 'XAGUSD'
    if (pair === 'OIL/USD') return 'USOIL'
    if (pair.includes('/')) return 'FX:' + pair.replace('/', '')
    return pair
  }

  const currentMarket = markets?.find(m => m.pair === selectedPair)
  const currentPrice = currentMarket?.price || '---'
  const priceChange = currentMarket?.change || ''
  const isUp = currentMarket?.up ?? false

  const handleTrade = async (type) => {
    const token = localStorage.getItem('easypayforex_token')
    if (!token) {
      alert('Please login or create an account to trade.')
      window.location.href = '/register'
      return
    }
    if (!volume || parseFloat(volume) <= 0) {
      alert('Please enter a valid volume')
      return
    }
    setOrderLoading(true)
    try {
      const res = await tradingAPI.openTrade({
        symbol: selectedPair,
        type: type,
        volume: parseFloat(volume),
        stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
        takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
      })
      alert(`✅ ${type.toUpperCase()} order placed!\nID: ${res.data.data.id}`)
      setStopLoss('')
      setTakeProfit('')
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      alert(`❌ Order failed: ${msg}`)
    } finally {
      setOrderLoading(false)
    }
  }

  const forexPairs = ["EUR/USD","GBP/USD","USD/JPY","USD/CHF","AUD/USD","USD/CAD","NZD/USD","EUR/GBP","EUR/JPY","GBP/JPY"]
  const commodities = ["XAU/USD","XAG/USD","OIL/USD","GAS/USD","COPPER/USD","COTTON/USD","COFFEE/USD"]
  const indices = ["US30","SPX500","NAS100","UK100","GER30","JPN225","AUS200","EU50","FRA40"]
  const cryptoPairs = ["BTC/USD","ETH/USD","XRP/USD","LTC/USD","ADA/USD","SOL/USD","DOT/USD","BNB/USD"]
  const stocks = ["AAPL","MSFT","GOOGL","AMZN","TSLA","META","NVDA","NFLX"]

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Paper sx={{ bgcolor: cardBg, p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: accent, mb: 2 }}>📊 Markets</Typography>
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb: 1 }}>FOREX</Typography>
              {forexPairs.map(p => (
                <Button key={p} fullWidth onClick={() => setSelectedPair(p)}
                  sx={{ color: selectedPair===p ? 'white' : '#8892b0', justifyContent:'flex-start', py:0.3, fontSize:'0.75rem', bgcolor: selectedPair===p ? 'rgba(79,195,247,0.1)' : 'transparent', mb:0.2, textTransform:'none' }}>
                  {p}
                </Button>
              ))}
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb: 1, mt: 2 }}>COMMODITIES</Typography>
              {commodities.map(p => (
                <Button key={p} fullWidth onClick={() => setSelectedPair(p)}
                  sx={{ color: selectedPair===p ? 'white' : '#8892b0', justifyContent:'flex-start', py:0.3, fontSize:'0.75rem', bgcolor: selectedPair===p ? 'rgba(79,195,247,0.1)' : 'transparent', mb:0.2, textTransform:'none' }}>
                  {p}
                </Button>
              ))}
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb: 1, mt: 2 }}>INDICES</Typography>
              {indices.map(p => (
                <Button key={p} fullWidth onClick={() => setSelectedPair(p)}
                  sx={{ color: selectedPair===p ? 'white' : '#8892b0', justifyContent:'flex-start', py:0.3, fontSize:'0.75rem', bgcolor: selectedPair===p ? 'rgba(79,195,247,0.1)' : 'transparent', mb:0.2, textTransform:'none' }}>
                  {p}
                </Button>
              ))}
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb: 1, mt: 2 }}>CRYPTO</Typography>
              {cryptoPairs.map(p => (
                <Button key={p} fullWidth onClick={() => setSelectedPair(p)}
                  sx={{ color: selectedPair===p ? 'white' : '#8892b0', justifyContent:'flex-start', py:0.3, fontSize:'0.75rem', bgcolor: selectedPair===p ? 'rgba(79,195,247,0.1)' : 'transparent', mb:0.2, textTransform:'none' }}>
                  {p}
                </Button>
              ))}
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb: 1, mt: 2 }}>STOCKS</Typography>
              {stocks.map(p => (
                <Button key={p} fullWidth onClick={() => setSelectedPair(p)}
                  sx={{ color: selectedPair===p ? 'white' : '#8892b0', justifyContent:'flex-start', py:0.3, fontSize:'0.75rem', bgcolor: selectedPair===p ? 'rgba(79,195,247,0.1)' : 'transparent', mb:0.2, textTransform:'none' }}>
                  {p}
                </Button>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ bgcolor: cardBg, p:3, borderRadius:3, mb:2 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', mb:2 }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color:'white' }}>{selectedPair}</Typography>
                  <Chip label="LIVE" size="small" sx={{ bgcolor:'rgba(0,212,170,0.2)', color:green, mt:0.5 }} />
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5" sx={{ color:'white' }}>{currentPrice}</Typography>
                  {currentMarket && (
                    <Typography variant="body2" sx={{ color: isUp ? green : red }}>
                      {priceChange}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ height: 500, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                <iframe
                  title="TradingView Chart"
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${getTVSymbol(selectedPair)}&interval=15&theme=dark&style=1&timezone=Etc/UTC&studies=MASimple@tv-basicstudies,RSI@tv-basicstudies,MACD@tv-basicstudies&locale=en`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  scrolling="no"
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ bgcolor: cardBg, p:3, borderRadius:3, mb:2 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color:'white', mb:2 }}>New Order</Typography>
              <Box sx={{ display:'flex', gap:1, mb:2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ bgcolor:green, py:1.5, fontWeight:'bold' }}
                  onClick={() => handleTrade('buy')}
                  disabled={orderLoading}
                >
                  {orderLoading ? '...' : 'BUY'}
                </Button>
                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ bgcolor:red, py:1.5, fontWeight:'bold' }}
                  onClick={() => handleTrade('sell')}
                  disabled={orderLoading}
                >
                  {orderLoading ? '...' : 'SELL'}
                </Button>
              </Box>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                label="Volume (Lots)"
                sx={{ mb:2, '& .MuiOutlinedInput-root':{color:'white'}, '& .MuiInputLabel-root':{color:'#8892b0'} }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Stop Loss"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                sx={{ mb:1, '& .MuiOutlinedInput-root':{color:'white'} }} 
              />
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Take Profit"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                sx={{ mb:2, '& .MuiOutlinedInput-root':{color:'white'} }} 
              />
              <Box sx={{ p:2, bgcolor:'rgba(79,195,247,0.05)', borderRadius:2, mb:2 }}>
                <Typography variant="caption" sx={{ color:'#8892b0' }}>
                  Margin Required: ${volume ? (volume * 100000 / 50).toFixed(2) : '0.00'}
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ bgcolor: cardBg, p:3, borderRadius:3 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color:'white', mb:2 }}>📊 Market Stats</Typography>
              {[{ l:'24h High', v:'1.0930' },{ l:'24h Low', v:'1.0810' },{ l:'Spread', v:'0.2 pips' },{ l:'Volume', v:'2.5B' }].map((s,i) => (
                <Box key={i} sx={{ display:'flex', justifyContent:'space-between', py:0.5 }}>
                  <Typography variant="caption" sx={{ color:'#8892b0' }}>{s.l}</Typography>
                  <Typography variant="caption" sx={{ color:'white', fontWeight:'bold' }}>{s.v}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

const PortfolioPage = () => {
  const data = [
    { name: 'Forex', value: 45, color: '#4fc3f7' },
    { name: 'Commodities', value: 25, color: '#7c4dff' },
    { name: 'Indices', value: 20, color: '#00d4aa' },
    { name: 'Crypto', value: 10, color: '#ff6b6b' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Paper sx={{ bgcolor: '#1a1f4e', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              {item.name}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: item.color, fontWeight: 'bold' }}>
            {item.value}%
          </Typography>
          <Typography variant="caption" sx={{ color: '#8892b0' }}>
            of total portfolio
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 4 }}>
          Portfolio Allocation
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>
                📈 Performance Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { date: 'Jan', value: 10000 },
                  { date: 'Feb', value: 10200 },
                  { date: 'Mar', value: 9900 },
                  { date: 'Apr', value: 10800 },
                  { date: 'May', value: 10500 },
                  { date: 'Jun', value: 11200 },
                  { date: 'Jul', value: 11800 },
                  { date: 'Aug', value: 11500 },
                  { date: 'Sep', value: 12200 },
                  { date: 'Oct', value: 12800 },
                  { date: 'Nov', value: 13500 },
                  { date: 'Dec', value: 14200 }
                ]}>
                  <defs>
                    <linearGradient id="pf1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#8892b0" />
                  <YAxis stroke="#8892b0" />
                  <Tooltip contentStyle={{ backgroundColor: '#13152a', borderRadius: 8, color: 'white' }} />
                  <Area type="monotone" dataKey="value" stroke="#4fc3f7" fill="url(#pf1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>
                🍩 Asset Allocation
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    activeIndex={[0, 1, 2, 3]}
                    activeShape={renderActiveShape}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
                {data.map((item, i) => (
                  <Chip
                    key={i}
                    label={`${item.name} ${item.value}%`}
                    size="small"
                    sx={{ bgcolor: item.color, color: 'white' }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill={fill} fontSize={16} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill={fill} fontSize={14}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Pie
        data={[payload]}
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={5}
      />
    </g>
  );
};

const DashboardPage = ({ markets }) => {
  const [positions] = useState([
    { id: 1, pair: 'EUR/USD', type: 'BUY', lots: 0.10, open: 1.0850 },
    { id: 2, pair: 'GBP/USD', type: 'SELL', lots: 0.05, open: 1.2650 },
    { id: 3, pair: 'XAU/USD', type: 'BUY', lots: 0.02, open: 2025.50 }
  ])
  const balance = 21450.80
  const profitLoss = positions.reduce((s, p) => {
    const currentPrice = markets?.find(m => m.pair === p.pair)?.price || p.open
    const profit = p.type === 'BUY' ? (currentPrice - p.open) * p.lots * 100000 : (p.open - currentPrice) * p.lots * 100000
    return s + profit
  }, 0)
  const equity = balance + profitLoss
  const margin = 4230.00
  const freeMargin = equity - margin

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', mb:3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color:'white' }}>Trading Dashboard</Typography>
          <Box sx={{ display:'flex', gap:1 }}>
            <Button variant="outlined" size="small" href="/wallet/deposit" sx={{ color:accent, borderColor:accent, borderRadius:2 }}>Deposit</Button>
            <Button variant="contained" size="small" href="/trading" sx={{ background:accent, borderRadius:2 }}>New Trade</Button>
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ mb:4 }}>
          {[
            { label: 'Balance', value: `$${balance.toFixed(2)}`, change: '+12.5%', up: true },
            { label: 'Equity', value: `$${equity.toFixed(2)}`, change: (profitLoss >= 0 ? '+' : '') + profitLoss.toFixed(2), up: profitLoss >= 0 },
            { label: 'Free Margin', value: `$${freeMargin.toFixed(2)}`, change: 'Available', up: true },
            { label: 'Margin Used', value: `$${margin.toFixed(2)}`, change: '32.5%', up: false }
          ].map((s,i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
                <Typography variant="caption" sx={{ color:'#8892b0' }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color:'white', my:1 }}>{s.value}</Typography>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                  {s.up ? <ArrowUpward sx={{ color:green, fontSize:16 }} /> : <ArrowDownward sx={{ color:red, fontSize:16 }} />}
                  <Typography variant="caption" sx={{ color:s.up?green:red }}>{s.change}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} sx={{ mb:4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>📈 Portfolio Growth</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={[
                  { date: 'Jan', value: 18000 },
                  { date: 'Feb', value: 17600 },
                  { date: 'Mar', value: 19200 },
                  { date: 'Apr', value: 18800 },
                  { date: 'May', value: 20500 },
                  { date: 'Jun', value: 21200 },
                  { date: 'Jul', value: 21800 },
                  { date: 'Aug', value: 21500 },
                  { date: 'Sep', value: 22500 },
                  { date: 'Oct', value: 23000 },
                  { date: 'Nov', value: 24000 },
                  { date: 'Dec', value: 25500 }
                ]}>
                  <defs><linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.4} /><stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#8892b0" />
                  <YAxis stroke="#8892b0" />
                  <Tooltip contentStyle={{ backgroundColor:'#13152a', borderRadius:8, color:'white' }} />
                  <Area type="monotone" dataKey="value" stroke="#4fc3f7" fill="url(#dashGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3, height:'100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>🏆 Performance</Typography>
              {[{ m:'Sharpe Ratio', v:'2.4', d:'Excellent' },{ m:'Max Drawdown', v:'-8.2%', d:'Within limits' },{ m:'Profit Factor', v:'2.8', d:'Strong strategy' },{ m:'Avg Duration', v:'4.5 hrs', d:'Intraday' }].map((item,i) => (
                <Box key={i} sx={{ p:2, bgcolor:'rgba(79,195,247,0.05)', borderRadius:2, mb:1 }}>
                  <Typography variant="body2" sx={{ color:'#8892b0' }}>{item.m}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color:accent }}>{item.v}</Typography>
                  <Typography variant="caption" sx={{ color:'#8892b0' }}>{item.d}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>Open Positions</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Pair','Type','Lots','Open Price','Current','Profit/Loss'].map(h => <TableCell key={h} sx={{ color:'#8892b0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map(pos => {
                  const currentPrice = markets?.find(m => m.pair === pos.pair)?.price || pos.open
                  const profit = pos.type === 'BUY' ? (parseFloat(currentPrice) - pos.open) * pos.lots * 100000 : (pos.open - parseFloat(currentPrice)) * pos.lots * 100000
                  return (
                    <TableRow key={pos.id}>
                      <TableCell sx={{ color:'white', fontWeight:'bold', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.pair}</TableCell>
                      <TableCell sx={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                        <Chip label={pos.type} size="small" sx={{ bgcolor:pos.type==='BUY'?'rgba(0,212,170,0.2)':'rgba(255,71,87,0.2)', color:pos.type==='BUY'?green:red }} />
                      </TableCell>
                      <TableCell sx={{ color:'#8892b0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.lots.toFixed(2)}</TableCell>
                      <TableCell sx={{ color:'#8892b0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.open.toFixed(5)}</TableCell>
                      <TableCell sx={{ color:'white', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{currentPrice}</TableCell>
                      <TableCell sx={{ fontWeight:'bold', color:profit>=0?green:red, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                        ${profit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  )
}

const DemoDashboard = () => {
  const [demoBalance] = useState(10000)
  const [positions, setPositions] = useState([
    { id: 1, pair: 'EUR/USD', type: 'BUY', lots: 0.10, openPrice: 1.0850, currentPrice: 1.0850, profit: 0 },
    { id: 2, pair: 'GBP/USD', type: 'SELL', lots: 0.05, openPrice: 1.2650, currentPrice: 1.2650, profit: 0 }
  ])
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const change = (Math.random() - 0.5) * 0.002
        const newPrice = pos.currentPrice + change
        const profit = pos.type === 'BUY' ? (newPrice - pos.openPrice) * pos.lots * 100000 : (pos.openPrice - newPrice) * pos.lots * 100000
        return { ...pos, currentPrice: newPrice, profit }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  const totalProfit = positions.reduce((s, p) => s + p.profit, 0)
  const equity = demoBalance + totalProfit

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color:'white', mb:3 }}>Demo Trading Dashboard</Typography>
        <Grid container spacing={3} sx={{ mb:4 }}>
          {[
            { label: 'Demo Balance', value: `$${demoBalance.toFixed(2)}`, change: '+0.00%', up: true },
            { label: 'Equity', value: `$${equity.toFixed(2)}`, change: (totalProfit >= 0 ? '+' : '') + totalProfit.toFixed(2), up: totalProfit >= 0 },
            { label: 'Open Positions', value: positions.length, change: 'Real‑time simulation', up: true },
            { label: 'Margin Used', value: '$200.00', up: false }
          ].map((s,i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
                <Typography variant="caption" sx={{ color:'#8892b0' }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color:'white', my:1 }}>{s.value}</Typography>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                  {s.up ? <ArrowUpward sx={{ color:green, fontSize:16 }} /> : <ArrowDownward sx={{ color:red, fontSize:16 }} />}
                  <Typography variant="caption" sx={{ color:s.up?green:red }}>{s.change}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>Open Positions</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Pair','Type','Lots','Open Price','Current','Profit/Loss'].map(h => <TableCell key={h} sx={{ color:'#8892b0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map(pos => (
                  <TableRow key={pos.id}>
                    <TableCell sx={{ color:'white', fontWeight:'bold', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.pair}</TableCell>
                    <TableCell sx={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <Chip label={pos.type} size="small" sx={{ bgcolor:pos.type==='BUY'?'rgba(0,212,170,0.2)':'rgba(255,71,87,0.2)', color:pos.type==='BUY'?green:red }} />
                    </TableCell>
                    <TableCell sx={{ color:'#8892b0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.lots.toFixed(2)}</TableCell>
                    <TableCell sx={{ color:'#8892b0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.openPrice.toFixed(5)}</TableCell>
                    <TableCell sx={{ color:'white', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{pos.currentPrice.toFixed(5)}</TableCell>
                    <TableCell sx={{ fontWeight:'bold', color:pos.profit>=0?green:red, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      ${pos.profit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  )
}

const WalletDepositPage = () => {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const paymentMethods = [
    { id: 'visa', name: 'Visa', icon: '💳', description: 'Instant, low‑cost funding', badge: 'Popular', badgeColor: accent },
    { id: 'mastercard', name: 'Mastercard', icon: '💳', description: 'Instant, low‑cost funding', badge: 'Secure', badgeColor: green },
    { id: 'stripe', name: 'Stripe', icon: '💳', description: 'Credit/Debit cards via Stripe', badge: 'Fast', badgeColor: green },
    { id: 'paypal', name: 'PayPal', icon: '🅿️', description: 'Instant e‑wallet transfer', badge: 'Global', badgeColor: '#003087' },
    { id: 'skrill', name: 'Skrill', icon: '💼', description: 'Instant, low‑cost e‑wallet', badge: 'Low Fee', badgeColor: green },
    { id: 'neteller', name: 'Neteller', icon: '🏦', description: 'Secure e‑wallet funding', badge: 'Trusted', badgeColor: gold },
    { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏛️', description: 'Direct wire transfer', badge: 'No Fee', badgeColor: '#8892b0' },
  ]

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 50) {
      alert('Minimum deposit is $50')
      return
    }
    if (!selectedMethod) {
      alert('Please select a payment method')
      return
    }
    const token = localStorage.getItem('easypayforex_token')
    if (!token) {
      alert('Please log in to deposit funds')
      window.location.href = '/login'
      return
    }
    setLoading(true)
    try {
      const res = await walletAPI.deposit({
        amount: parseFloat(amount),
        method: selectedMethod,
      })
      alert(`✅ Deposit of $${amount} via ${selectedMethod} successful!`)
      setAmount('')
      setSelectedMethod('')
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      alert(`❌ Deposit failed: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 10 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ bgcolor: cardBg, p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
            💰 Deposit Funds
          </Typography>
          <Typography variant="body2" sx={{ color: '#8892b0', mb: 4 }}>
            Choose your preferred payment method – instant, low‑cost funding available. Minimum deposit $50.
          </Typography>
          <TextField
            fullWidth type="number" placeholder="Enter amount (min $50)" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: accent, fontWeight: 'bold' }}>$</Typography></InputAdornment> }}
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>Payment Methods</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} key={method.id}>
                <Paper
                  sx={{
                    p: 2, bgcolor: selectedMethod === method.id ? 'rgba(79,195,247,0.15)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid', borderColor: selectedMethod === method.id ? accent : 'rgba(255,255,255,0.1)',
                    borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { borderColor: accent, bgcolor: 'rgba(79,195,247,0.1)' },
                  }}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: 28 }}>{method.icon}</Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'white' }}>{method.name}</Typography>
                        {method.badge && <Chip label={method.badge} size="small" sx={{ bgcolor: method.badgeColor, color: 'white', fontSize: '0.6rem', height: 18 }} />}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8892b0' }}>{method.description}</Typography>
                    </Box>
                    {selectedMethod === method.id && <CheckCircle sx={{ color: accent, fontSize: 20 }} />}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button fullWidth variant="contained" size="large" onClick={handleDeposit}
            disabled={loading || !amount || !selectedMethod}
            sx={{ background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)', py: 1.8, borderRadius: 2, fontSize: '1.1rem', fontWeight: 'bold' }}>
            {loading ? 'Processing...' : `Deposit $${amount || '0'} via ${selectedMethod ? paymentMethods.find(m => m.id === selectedMethod)?.name : '...'}`}
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

// ---------- App ----------
function App() {
  const [liveMarkets, setLiveMarkets] = useState([])

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await marketAPI.getAll()
        const data = res.data.data
        const formatted = Object.keys(data).map(key => ({
          pair: key,
          price: data[key].price.toFixed(2),
          change: data[key].change,
          up: data[key].up
        }))
        setLiveMarkets(formatted)
      } catch (err) {
        console.error("Failed to fetch markets", err)
      }
    }
    fetchMarkets()
    const interval = setInterval(fetchMarkets, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ bgcolor: darkBg }}>
      <Navbar />
      <LiveTicker markets={liveMarkets} />
      <TradePopups />
      <Routes>
        <Route path="/" element={<HomePage markets={liveMarkets} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/markets" element={<MarketsPage markets={liveMarkets} />} />
        <Route path="/trading" element={<TradingPage markets={liveMarkets} />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/dashboard" element={<DashboardPage markets={liveMarkets} />} />
        <Route path="/demo" element={<DemoDashboard />} />
        <Route path="/wallet/deposit" element={<WalletDepositPage />} />
      </Routes>
      <AIChatbot />
    </Box>
  )
}

export default App