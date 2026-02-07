const express = require('express');
const router = express.Router();

// Página de contato
router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Contato - Linka',
    page: 'contact',
    description: 'Entre em contato conosco. Estamos aqui para ajudar.',
    keywords: 'linka, contato, suporte, ajuda'
  });
});

// Processar formulário de contato
router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Aqui você implementaria o envio do email ou salvamento no banco
  console.log('Novo contato recebido:', { name, email, phone, subject, message });
  
  res.render('contact', {
    title: 'Contato - Linka',
    page: 'contact',
    description: 'Entre em contato conosco. Estamos aqui para ajudar.',
    keywords: 'linka, contato, suporte, ajuda',
    success: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
  });
});

module.exports = router;