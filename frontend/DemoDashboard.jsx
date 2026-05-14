const DemoDashboard = () => {
  const [demoBalance, setDemoBalance] = useState(10000)
  const [equity, setEquity] = useState(10000)
  const [positions, setPositions] = useState([
    { id: 1, pair: 'EUR/USD', type: 'BUY', lots: 0.10, openPrice: 1.0850, currentPrice: 1.0850, profit: 0 },
    { id: 2, pair: 'GBP/USD', type: 'SELL', lots: 0.05, openPrice: 1.2650, currentPrice: 1.2650, profit: 0 }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const change = (Math.random() - 0.5) * 0.002
        const newPrice = pos.currentPrice + change
        const profit = pos.type === 'BUY'
          ? (newPrice - pos.openPrice) * pos.lots * 100000
          : (pos.openPrice - newPrice) * pos.lots * 100000
        return { ...pos, currentPrice: newPrice, profit }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0)
    setEquity(demoBalance + totalProfit)
  }, [positions, demoBalance])

  const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0)

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display:'flex', justifyContent:'space-between', mb:3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color:'white' }}>Demo Trading Dashboard</Typography>
          <Box sx={{ display:'flex', gap:1 }}>
            <Button variant="outlined" size="small" sx={{ color:accent, borderColor:accent, borderRadius:2 }}>Deposit</Button>
            <Button variant="contained" size="small" sx={{ background:accent, borderRadius:2 }}>New Trade</Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb:4 }}>
          {[
            { label: 'Demo Balance', value: `$${demoBalance.toFixed(2)}`, change: '+0.00%', up: true },
            { label: 'Equity', value: `$${equity.toFixed(2)}`, change: (totalProfit >= 0 ? '+' : '') + totalProfit.toFixed(2), up: totalProfit >= 0 },
            { label: 'Open Positions', value: positions.length, change: 'Real‑time simulation', up: true },
            { label: 'Margin Used', value: '$200.00', change: '2.0%', up: false }
          ].map((s,i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3 }}>
                <Typography variant="caption" sx={{ color:'#8892b0' }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color:'white', my:1 }}>{s.value}</Typography>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                  {s.up ? <ArrowUpward sx={{ color:green, fontSize:16 }} /> : <ArrowDownward sx={{ color:red, fontSize:16 }} />}
                  <Typography variant="caption" sx={{ color: s.up ? green : red }}>{s.change}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ bgcolor:cardBg, p:3, borderRadius:3, mb:4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color:'white', mb:3 }}>📈 Portfolio Performance (Simulated)</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={[
              { time: '09:30', value: 10000 },{ time: '10:30', value: 10200 },{ time: '11:30', value: 10100 },
              { time: '12:30', value: 10350 },{ time: '13:30', value: 10400 },{ time: '14:30', value: equity }
            ]}>
              <defs><linearGradient id="demoGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.4} /><stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#8892b0" />
              <YAxis stroke="#8892b0" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor:'#13152a', borderRadius:8, color:'white' }} />
              <Area type="monotone" dataKey="value" stroke="#4fc3f7" fill="url(#demoGrad)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

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
