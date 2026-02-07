const express = require('express');
const router = express.Router();

// Página de serviços
router.get('/', (req, res) => {
  const services = [
    {
      id: 1,
      name: 'Serviços Domésticos',
      description: 'Limpeza, organização, jardinagem e muito mais',
      icon: 'home'
    },
    {
      id: 2,
      name: 'Reformas e Reparos',
      description: 'Pedreiros, eletricistas, encanadores e pintores',
      icon: 'tools'
    },
    {
      id: 3,
      name: 'Tecnologia',
      description: 'Desenvolvedores, designers e consultores de TI',
      icon: 'laptop'
    },
    {
      id: 4,
      name: 'Beleza e Bem-estar',
      description: 'Cabeleireiros, esteticistas e personal trainers',
      icon: 'heart'
    },
    {
      id: 5,
      name: 'Educação',
      description: 'Professores particulares e cursos especializados',
      icon: 'book'
    },
    {
      id: 6,
      name: 'Transporte',
      description: 'Motoristas particulares e delivery',
      icon: 'car'
    }
  ];

  res.render('services', {
    title: 'Nossos Serviços - Linka',
    page: 'services',
    description: 'Descubra todos os serviços disponíveis na plataforma Linka.',
    keywords: 'linka, serviços, profissionais, categorias',
    services: services
  });
});

module.exports = router;