const express = require('express');
const router = express.Router();

// Página inicial
router.get('/', (req, res) => {
  res.render('home', {
    title: 'Linka - Conectando você aos melhores serviços',
    page: 'home',
    description: 'Encontre os melhores profissionais e serviços na sua região. Conecte-se facilmente e com segurança.',
    keywords: 'linka, serviços, profissionais, plataforma'
  });
});

module.exports = router;