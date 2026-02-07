require('dotenv').config({ quiet: true });
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { trackingMiddleware } = require('./utils/analytics');

// Routes
const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const servicesRoutes = require('./routes/services');
const contactRoutes = require('./routes/contact');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const painelRoutes = require('./routes/painel');
const adminRoutes = require('./routes/admin');
const legalRoutes = require('./routes/legal');

const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

console.log('[BOOT] Linka Website iniciando...');
console.log('[BOOT] Porta:', PORT);
console.log('[BOOT] Ambiente:', process.env.NODE_ENV || 'development');

// ===== App =====
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Analytics tracking
app.use(trackingMiddleware);

// Request logging
app.use((req, _res, next) => {
  console.log('[REQ]', req.method, req.originalUrl);
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/sobre', aboutRoutes);
app.use('/servicos', servicesRoutes);
app.use('/contato', contactRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/', authRoutes);
app.use('/', painelRoutes);
app.use('/', adminRoutes);
app.use('/', legalRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'Linka Website'
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).render('errors/404', {
    title: 'Página não encontrada - Linka',
    message: 'A página que você procura não existe.',
    page: 'error'
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('ERR:', err);
  res.status(err.statusCode || err.status || 500).render('errors/500', {
    title: 'Erro interno - Linka',
    message: isProd ? 'Algo deu errado. Tente novamente.' : err.message,
    page: 'error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Linka Website rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});