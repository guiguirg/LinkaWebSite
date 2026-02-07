const express = require('express');
const router = express.Router();
const { getStats } = require('../utils/analytics');

// Página sobre
router.get('/', (req, res) => {
  const analyticsData = getStats();
  
  res.render('about', {
    title: 'Sobre o Linka - Nossa História',
    page: 'about',
    description: 'Conheça a história do Linka e nossa missão de conectar pessoas aos melhores serviços.',
    keywords: 'linka, sobre, história, missão, equipe',
    analytics: analyticsData
  });
});

module.exports = router;