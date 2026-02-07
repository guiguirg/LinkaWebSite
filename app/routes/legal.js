const express = require('express');
const router = express.Router();

// Política de Privacidade
router.get('/politica-de-privacidade', (req, res) => {
  res.render('legal/privacy', {
    title: 'Política de Privacidade - Linka',
    page: 'privacy',
    description: 'Política de Privacidade da plataforma Linka',
    keywords: 'política de privacidade, lgpd, proteção de dados, linka'
  });
});

// Termos de Uso
router.get('/termos-de-uso', (req, res) => {
  res.render('legal/terms', {
    title: 'Termos de Uso - Linka',
    page: 'terms',
    description: 'Termos de Uso da plataforma Linka',
    keywords: 'termos de uso, contrato, condições, linka'
  });
});

module.exports = router;
