/**
 * Sistema de Analytics - Tracking de Acessos
 */

const fs = require('fs');
const path = require('path');

const ANALYTICS_FILE = path.join(__dirname, '../data/analytics.json');

// Garantir que o diretório existe
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Estrutura de dados
let analytics = {
  uniqueVisitors: new Set(),
  totalPageViews: 0,
  visitsByDate: {},
  visitsByHour: {},
  lastUpdate: new Date().toISOString()
};

// Carregar dados salvos
function loadAnalytics() {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
      analytics.uniqueVisitors = new Set(data.uniqueVisitors || []);
      analytics.totalPageViews = data.totalPageViews || 0;
      analytics.visitsByDate = data.visitsByDate || {};
      analytics.visitsByHour = data.visitsByHour || {};
      analytics.lastUpdate = data.lastUpdate;
    }
  } catch (error) {
    console.error('[ANALYTICS] Erro ao carregar dados:', error.message);
  }
}

// Salvar dados
function saveAnalytics() {
  try {
    const data = {
      uniqueVisitors: Array.from(analytics.uniqueVisitors),
      totalPageViews: analytics.totalPageViews,
      visitsByDate: analytics.visitsByDate,
      visitsByHour: analytics.visitsByHour,
      lastUpdate: new Date().toISOString()
    };
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('[ANALYTICS] Erro ao salvar dados:', error.message);
  }
}

// Registrar acesso
function trackVisit(ip, url) {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.includes('::ffff:127.0.0.1')) {
    return; // Ignorar localhost
  }

  // Adicionar IP único
  analytics.uniqueVisitors.add(ip);

  // Incrementar total de page views
  analytics.totalPageViews++;

  // Registrar por data
  const today = new Date().toISOString().split('T')[0];
  analytics.visitsByDate[today] = (analytics.visitsByDate[today] || 0) + 1;

  // Registrar por hora
  const hour = new Date().getHours();
  analytics.visitsByHour[hour] = (analytics.visitsByHour[hour] || 0) + 1;

  // Salvar periodicamente (a cada 10 acessos)
  if (analytics.totalPageViews % 10 === 0) {
    saveAnalytics();
  }
}

// Obter estatísticas
function getStats() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return {
    uniqueVisitors: analytics.uniqueVisitors.size,
    totalPageViews: analytics.totalPageViews,
    visitsToday: analytics.visitsByDate[today] || 0,
    visitsYesterday: analytics.visitsByDate[yesterday] || 0,
    visitsByDate: analytics.visitsByDate,
    visitsByHour: analytics.visitsByHour,
    lastUpdate: analytics.lastUpdate
  };
}

// Resetar estatísticas (opcional, para manutenção)
function resetStats() {
  analytics = {
    uniqueVisitors: new Set(),
    totalPageViews: 0,
    visitsByDate: {},
    visitsByHour: {},
    lastUpdate: new Date().toISOString()
  };
  saveAnalytics();
}

// Middleware para tracking automático
function trackingMiddleware(req, res, next) {
  // Pegar IP real (considerando proxies)
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress;
  
  const url = req.originalUrl || req.url;
  
  // Rastrear apenas páginas HTML (ignorar assets)
  if (!url.startsWith('/public/') && !url.startsWith('/api/')) {
    trackVisit(ip, url);
  }
  
  next();
}

// Carregar dados ao iniciar
loadAnalytics();

// Salvar dados ao encerrar
process.on('SIGINT', () => {
  saveAnalytics();
  process.exit();
});

process.on('SIGTERM', () => {
  saveAnalytics();
  process.exit();
});

module.exports = {
  trackingMiddleware,
  getStats,
  resetStats,
  saveAnalytics
};
