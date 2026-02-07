# Linka Website

Site oficial do Linka - Plataforma de conexão de serviços.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **EJS** - Template engine
- **CSS3** - Estilos
- **JavaScript** - Interatividade
- **PM2** - Gerenciador de processos

## 📁 Estrutura do Projeto

```
LinkaWebsite/
├── app/
│   ├── index.js              # Servidor principal
│   ├── routes/               # Rotas da aplicação
│   │   ├── home.js
│   │   ├── about.js
│   │   ├── services.js
│   │   └── contact.js
│   ├── views/                # Templates EJS
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   └── footer.ejs
│   │   ├── errors/
│   │   ├── home.ejs
│   │   ├── about.ejs
│   │   ├── services.ejs
│   │   └── contact.ejs
│   └── public/               # Arquivos estáticos
│       ├── css/
│       ├── js/
│       └── images/
├── package.json
├── ecosystem.config.js       # Configuração PM2
├── .env.example             # Exemplo de variáveis de ambiente
└── README.md
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd LinkaWebsite
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute em desenvolvimento:
```bash
npm run dev
```

5. Execute em produção:
```bash
npm start
```

## 🚀 Deploy com PM2

1. Instale o PM2 globalmente:
```bash
npm install -g pm2
```

2. Inicie a aplicação:
```bash
pm2 start ecosystem.config.js
```

3. Comandos úteis do PM2:
```bash
pm2 status              # Ver status
pm2 logs linka-website  # Ver logs
pm2 restart linka-website # Reiniciar
pm2 stop linka-website  # Parar
pm2 delete linka-website # Remover
```

## 📄 Páginas

- **Home** (`/`) - Página inicial com hero, features e CTA
- **Sobre** (`/sobre`) - História, missão, equipe e estatísticas
- **Serviços** (`/servicos`) - Categorias de serviços e como funciona
- **Contato** (`/contato`) - Formulário de contato e informações

## 🎨 Características

- ✅ Design responsivo
- ✅ Otimizado para SEO
- ✅ Formulário de contato funcional
- ✅ Animações CSS
- ✅ Ícones Lucide
- ✅ Tipografia Google Fonts
- ✅ Tratamento de erros 404/500
- ✅ Estrutura modular

## 🔧 Configuração

### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=3001
APP_NAME=Linka Website
APP_URL=http://localhost:3001
```

### Portas

- **Desenvolvimento**: 3001
- **Produção**: Configurável via ENV

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (<768px)

## 🎯 Funcionalidades

### Página Inicial
- Hero section com call-to-action
- Seção de features/benefícios
- Preview dos serviços
- Seção de CTA final

### Página Sobre
- História da empresa
- Missão, visão e valores
- Estatísticas
- Equipe

### Página Serviços
- Grid de categorias de serviços
- Como funciona (3 passos)
- Benefícios da plataforma

### Página Contato
- Formulário de contato funcional
- Informações de contato
- FAQ
- Links para redes sociais

## 🚀 Performance

- CSS e JS minificados para produção
- Imagens otimizadas
- Compressão gzip habilitada
- Cache de arquivos estáticos

## 🔒 Segurança

- Helmet.js para headers de segurança
- Validação de formulários
- Sanitização de inputs
- CORS configurado

## 📊 SEO

- Meta tags otimizadas
- Open Graph para redes sociais
- Structured data (schema.org)
- URLs amigáveis
- Sitemap XML

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: contato@linka.com.br
- Telefone: (53) 99943-7775

---

Desenvolvido com ❤️ pela equipe Linka