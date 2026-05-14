const TradingPage = ({ markets }) => {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [chartData, setChartData] = useState([])
  const [currentPrice, setCurrentPrice] = useState(null)

  useEffect(() => {
    const pair = markets.find(m => m.pair === selectedPair)
    if (pair) {
      setCurrentPrice(pair.price)
      const now = Date.now()
      const points = Array.from({ length: 20 }, (_, i) => {
        const change = (Math.random() - 0.5) * 0.002
        return {
          time: now - (20 - i) * 60000,
          price: (parseFloat(pair.price) + change).toFixed(5)
        }
      })
      setChartData(points)
    }
  }, [markets, selectedPair])

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('marketUpdate', (data) => {
      const pairData = data[selectedPair]
      if (pairData) {
        setCurrentPrice(pairData.price)
        setChartData(prev => {
          const updated = [...prev]
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              price: pairData.price.toFixed(5)
            }
          }
          return updated
        })
      }
    })
    return () => socket.disconnect()
  }, [selectedPair])

  const forexPairs = ["EUR/USD","GBP/USD","USD/JPY","AUD/USD","USD/CAD"]
  const commodities = ["XAU/USD","XAG/USD","OIL/USD"]
  const indices = ["US30","SPX500","NAS100"]

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
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb:1, mt:2 }}>COMMODITIES</Typography>
              {commodities.map(p => (
                <Button key={p} fullWidth onClick={() => setSelectedPair(p)}
                  sx={{ color: selectedPair===p ? 'white' : '#8892b0', justifyContent:'flex-start', py:0.3, fontSize:'0.75rem', bgcolor: selectedPair===p ? 'rgba(79,195,247,0.1)' : 'transparent', mb:0.2, textTransform:'none' }}>
                  {p}
                </Button>
              ))}
              <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mb:1, mt:2 }}>INDICES</Typography>
              {indices.map(p => (
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
                  <Typography variant="h5" sx={{ color:'white' }}>{currentPrice || '---'}</Typography>
                  {markets.find(m => m.pair === selectedPair) && (
                    <Typography variant="body2" sx={{ color: markets.find(m => m.pair === selectedPair).up ? green : red }}>
                      {markets.find(m => m.pair === selectedPair).change}
                    </Typography>
                  )}
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString()} stroke="#8892b0" fontSize={10} />
                  <YAxis stroke="#8892b0" fontSize={10} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor:'#13152a', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', color:'white' }} labelFormatter={(t) => new Date(t).toLocaleString()} />
                  <Area type="monotone" dataKey="price" stroke="#4fc3f7" fill="url(#chartGrad)" strokeWidth={2} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ bgcolor: cardBg, p:3, borderRadius:3, mb:2 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ color:'white', mb:2 }}>New Order</Typography>
              <Box sx={{ display:'flex', gap:1, mb:2 }}>
                <Button fullWidth variant="contained" sx={{ bgcolor:green, py:1.5, fontWeight:'bold' }}>BUY</Button>
                <Button fullWidth variant="contained" sx={{ bgcolor:red, py:1.5, fontWeight:'bold' }}>SELL</Button>
              </Box>
              <TextField fullWidth size="small" type="number" defaultValue="0.01" label="Volume (Lots)"
                sx={{ mb:2, '& .MuiOutlinedInput-root':{color:'white'}, '& .MuiInputLabel-root':{color:'#8892b0'} }} />
              <TextField fullWidth size="small" placeholder="Stop Loss"
                sx={{ mb:1, '& .MuiOutlinedInput-root':{color:'white'} }} />
              <TextField fullWidth size="small" placeholder="Take Profit"
                sx={{ mb:2, '& .MuiOutlinedInput-root':{color:'white'} }} />
              <Box sx={{ p:2, bgcolor:'rgba(79,195,247,0.05)', borderRadius:2, mb:2 }}>
                <Typography variant="caption" sx={{ color:'#8892b0' }}>Margin Required: $212.50</Typography>
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
