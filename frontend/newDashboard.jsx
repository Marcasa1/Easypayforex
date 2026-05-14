const DashboardPage = ({ markets }) => {
  const [positions, setPositions] = useState([
    { id: 1, pair: 'EUR/USD', type: 'BUY', lots: 0.10, open: 1.0850, profit: 125.50 },
    { id: 2, pair: 'GBP/USD', type: 'SELL', lots: 0.05, open: 1.2650, profit: -45.20 },
    { id: 3, pair: 'XAU/USD', type: 'BUY', lots: 0.02, open: 2025.50, profit: 230.00 }
  ])
  const balance = 21450.80
  const equity = balance + positions.reduce((s, p) => s + p.profit, 0)
  const margin = 4230.00
  const freeMargin = equity - margin
  const profitLoss = positions.reduce((s, p) => s + p.profit, 0)

  // Chart data (static for now, can be extended)
  const chartData = [
    { date: 'Jan', value: 18000 }, { date: 'Feb', value: 19200 }, { date: 'Mar', value: 20500 },
    { date: 'Apr', value: 21000 }, { date: 'May', value: 21450 }
  ]

  return (
    <Box sx={{ bgcolor: darkBg, minHeight: '100vh', pt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>Trading Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" href="/wallet/deposit" sx={{ color: accent, borderColor: accent, borderRadius: 2 }}>Deposit</Button>
            <Button variant="contained" size="small" href="/trading" sx={{ background: accent, borderRadius: 2 }}>New Trade</Button>
          </Box>
        </Box>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Balance', value: `$${balance.toFixed(2)}`, change: '+12.5%', up: true },
            { label: 'Equity', value: `$${equity.toFixed(2)}`, change: profitLoss >= 0 ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`, up: profitLoss >= 0 },
            { label: 'Free Margin', value: `$${freeMargin.toFixed(2)}`, change: 'Available', up: true },
            { label: 'Margin Used', value: `$${margin.toFixed(2)}`, change: '32.5%', up: false }
          ].map((s, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3 }}>
                <Typography variant="caption" sx={{ color: '#8892b0' }}>{s.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', my: 1 }}>{s.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {s.up ? <ArrowUpward sx={{ color: green, fontSize: 16 }} /> : <ArrowDownward sx={{ color: red, fontSize: 16 }} />}
                  <Typography variant="caption" sx={{ color: s.up ? green : red }}>{s.change}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>📈 Portfolio Growth</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs><linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.4} /><stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#8892b0" />
                  <YAxis stroke="#8892b0" />
                  <Tooltip contentStyle={{ backgroundColor: '#13152a', borderRadius: 8, color: 'white' }} />
                  <Area type="monotone" dataKey="value" stroke="#4fc3f7" fill="url(#dashGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>🏆 Performance</Typography>
              {[{ m: 'Sharpe Ratio', v: '2.4', d: 'Excellent' }, { m: 'Max Drawdown', v: '-8.2%', d: 'Within limits' }, { m: 'Profit Factor', v: '2.8', d: 'Strong strategy' }, { m: 'Avg Duration', v: '4.5 hrs', d: 'Intraday' }].map((item, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: 'rgba(79,195,247,0.05)', borderRadius: 2, mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#8892b0' }}>{item.m}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: accent }}>{item.v}</Typography>
                  <Typography variant="caption" sx={{ color: '#8892b0' }}>{item.d}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>

        {/* Open Positions */}
        <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>Open Positions</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Pair', 'Type', 'Lots', 'Open Price', 'Current', 'Profit/Loss'].map(h => <TableCell key={h} sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.map(pos => {
                  const currentPrice = markets?.find(m => m.pair === pos.pair)?.price || pos.open
                  const profit = pos.type === 'BUY' 
                    ? (parseFloat(currentPrice) - pos.open) * pos.lots * 100000 
                    : (pos.open - parseFloat(currentPrice)) * pos.lots * 100000
                  return (
                    <TableRow key={pos.id}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{pos.pair}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip label={pos.type} size="small" sx={{ bgcolor: pos.type === 'BUY' ? 'rgba(0,212,170,0.2)' : 'rgba(255,71,87,0.2)', color: pos.type === 'BUY' ? green : red }} />
                      </TableCell>
                      <TableCell sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{pos.lots.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{pos.open.toFixed(5)}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{currentPrice}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: profit >= 0 ? green : red, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        ${profit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Recent trades (static) */}
        <Paper sx={{ bgcolor: cardBg, p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>Recent Trades</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Pair', 'Type', 'Amount', 'Entry', 'Exit', 'Profit/Loss'].map(h => <TableCell key={h} sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { pair: 'EUR/USD', type: 'BUY', amount: '0.10', entry: '1.0830', exit: '1.0855', profit: '+$125.50', pc: green },
                  { pair: 'GBP/USD', type: 'SELL', amount: '0.05', entry: '1.2670', exit: '1.2650', profit: '-$45.20', pc: red },
                  { pair: 'XAU/USD', type: 'BUY', amount: '0.02', entry: '2020.50', exit: '2032.00', profit: '+$230.00', pc: green },
                  { pair: 'USD/JPY', type: 'SELL', amount: '0.10', entry: '148.80', exit: '148.35', profit: '+$89.30', pc: green }
                ].map((t, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{t.pair}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip label={t.type} size="small" sx={{ bgcolor: t.type === 'BUY' ? 'rgba(0,212,170,0.2)' : 'rgba(255,71,87,0.2)', color: t.type === 'BUY' ? green : red }} />
                    </TableCell>
                    <TableCell sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{t.amount}</TableCell>
                    <TableCell sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{t.entry}</TableCell>
                    <TableCell sx={{ color: '#8892b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{t.exit}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: t.pc, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{t.profit}</TableCell>
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
