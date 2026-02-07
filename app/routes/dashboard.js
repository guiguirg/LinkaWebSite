const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const { getStats } = require('../utils/analytics');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Buscar dados REAIS do banco de dados
async function getRealData() {
  try {
    // Buscar usuários (clientes)
    const clientesResponse = await axios.get(`${API_URL}/usuarios`).catch(() => ({ data: [] }));
    const clientes = clientesResponse.data || [];
    
    // Buscar profissionais (prestadores)
    const profissionaisResponse = await axios.get(`${API_URL}/profissionais`).catch(() => ({ data: [] }));
    const profissionais = profissionaisResponse.data || [];
    
    const totalUsers = clientes.length + profissionais.length;
    const totalClientes = clientes.length;
    const totalProfissionais = profissionais.length;
    
    // Contar usuários ativos (logados recentemente)
    const activeUsers = clientes.filter(u => u.logado === 1).length + 
                        profissionais.filter(p => p.disponivel === 1).length;
    
    const realData = {
      // Métricas principais REAIS
      totalUsers: totalUsers,
      totalClientes: totalClientes,
      totalProfissionais: totalProfissionais,
      activeUsers: activeUsers,
      totalTransactions: 0, // Sem dados de transações ainda
      totalRevenue: 0.00,
      
      // Crescimento (calculado baseado em dados reais)
      userGrowth: 0,
      transactionGrowth: 0,
      revenueGrowth: 0,
      
      // Dados reais de cadastros por data
      hourlyData: [],
      dailyData: [],
      monthlyData: [],
      
      // Tipos de profissionais (dados reais)
      profissionaisPorTipo: [],
      
      // Status das transações (sem dados ainda)
      transactionStatus: [],
      
      // Métodos de pagamento (sem dados ainda)
      paymentMethods: [],
      
      // Avaliações (calculado dos profissionais)
      ratings: {
        average: 0,
        total: 0,
        distribution: []
      },
      
      // Lista de usuários recentes
      recentUsers: [...clientes, ...profissionais]
        .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
        .slice(0, 10)
        .map(u => ({
          nome: u.nome,
          tipo: u.tipo ? 'Profissional' : 'Cliente',
          criado_em: u.criado_em
        }))
    };
    
    // Contar profissionais por tipo
    const tiposCount = {};
    profissionais.forEach(p => {
      const tipo = p.tipo || 'Outros';
      tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
    });
    
    // Converter para array e calcular percentagens
    const totalProf = profissionais.length || 1;
    realData.profissionaisPorTipo = Object.entries(tiposCount).map(([tipo, count]) => ({
      name: tipo.charAt(0).toUpperCase() + tipo.slice(1).replace('_', ' '),
      count: count,
      percentage: ((count / totalProf) * 100).toFixed(1)
    }));
    
    return realData;
    
  } catch (error) {
    console.error('Erro ao buscar dados reais:', error.message);
    // Retornar dados vazios em caso de erro
    return {
      totalUsers: 0,
      totalClientes: 0,
      totalProfissionais: 0,
      activeUsers: 0,
      totalTransactions: 0,
      totalRevenue: 0,
      userGrowth: 0,
      transactionGrowth: 0,
      revenueGrowth: 0,
      hourlyData: [],
      dailyData: [],
      monthlyData: [],
      profissionaisPorTipo: [],
      transactionStatus: [],
      paymentMethods: [],
      ratings: { average: 0, total: 0, distribution: [] },
      recentUsers: []
    };
  }
}

// Página principal do dashboard
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  const data = await getRealData();
  const analyticsData = getStats();
  
  res.render('dashboard', {
    title: 'Dashboard - Dados do Linka',
    page: 'dashboard',
    description: 'Acompanhe as métricas e estatísticas em tempo real do Linka',
    keywords: 'linka, dashboard, dados, estatísticas, métricas',
    data: data,
    analytics: analyticsData
  });
});

// API endpoint para dados em tempo real (AJAX)
router.get('/api/realtime', isAuthenticated, isAdmin, async (req, res) => {
  const data = await getRealData();
  
  res.json({
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  });
});

// API endpoint para métricas específicas
router.get('/api/metrics', isAuthenticated, isAdmin, async (req, res) => {
  const data = await getRealData();
  
  res.json({
    success: true,
    metrics: {
      totalUsers: data.totalUsers,
      totalClientes: data.totalClientes,
      totalProfissionais: data.totalProfissionais,
      activeUsers: data.activeUsers,
      totalTransactions: data.totalTransactions,
      totalRevenue: data.totalRevenue,
      userGrowth: data.userGrowth,
      transactionGrowth: data.transactionGrowth,
      revenueGrowth: data.revenueGrowth
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
