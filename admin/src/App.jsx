import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Trades from './pages/Trades'
import Transactions from './pages/Transactions'
import Wallet from './pages/Wallet'
import Notifications from './pages/Notifications'
import Layout from './components/Layout'

function App() {
  const token = localStorage.getItem('admin_token')
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        token ? (
          <Layout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="trades" element={<Trades />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        ) : <Navigate to="/login" replace />
      } />
    </Routes>
  )
}
export default App
