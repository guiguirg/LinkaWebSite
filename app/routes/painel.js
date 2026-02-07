const express = require('express');
const router = express.Router();
const { isAuthenticated, isPrestador, isCliente } = require('../middlewares/auth');

// Painel do Prestador
router.get('/painel/prestador', isAuthenticated, isPrestador, (req, res) => {
  const userData = req.cookies.user_data ? JSON.parse(req.cookies.user_data) : {};
  
  res.render('painel/prestador', {
    title: 'Painel do Prestador - Linka',
    page: 'painel-prestador',
    description: 'Gerencie seus serviços e pedidos',
    keywords: 'linka, painel, prestador',
    user: userData
  });
});

// Painel do Cliente
router.get('/painel/cliente', isAuthenticated, isCliente, (req, res) => {
  const userData = req.cookies.user_data ? JSON.parse(req.cookies.user_data) : {};
  
  res.render('painel/cliente', {
    title: 'Painel do Cliente - Linka',
    page: 'painel-cliente',
    description: 'Gerencie suas solicitações de serviços',
    keywords: 'linka, painel, cliente',
    user: userData
  });
});

// Logout
router.get('/sair', (req, res) => {
  res.clearCookie('auth_token');
  res.clearCookie('user_type');
  res.clearCookie('user_data');
  res.redirect('/');
});

module.exports = router;
