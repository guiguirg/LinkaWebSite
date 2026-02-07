// Dashboard JavaScript - Gráficos e Interatividade

document.addEventListener('DOMContentLoaded', function() {
    // Configuração global do Chart.js
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.display = false;
    
    // Dados globais
    const data = window.dashboardData;
    let currentPeriod = 'hour';
    let charts = {};
    
    // Cores para os gráficos
    const colors = {
        primary: '#3b82f6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        purple: '#8b5cf6',
        gray: '#64748b'
    };

    // Inicializar todos os gráficos
    initializeCharts();
    
    // Event listeners
    setupEventListeners();
    
    // Auto-refresh
    setupAutoRefresh();
    
    // Real-time updates
    startRealtimeUpdates();

    function initializeCharts() {
        createTransactionsChart();
        createUsersChart();
        createCategoriesChart();
        createStatusChart();
        createPaymentChart();
    }

    function createTransactionsChart() {
        const ctx = document.getElementById('transactionsChart');
        if (!ctx) return;

        const chartData = data[currentPeriod === 'hour' ? 'hourlyData' : 'dailyData'];
        
        charts.transactions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(item => 
                    currentPeriod === 'hour' ? `${item.hour}:00` : item.date
                ),
                datasets: [
                    {
                        label: 'Transações',
                        data: chartData.map(item => item.transactions),
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + '20',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    },
                    {
                        label: 'Receita (R$)',
                        data: chartData.map(item => item.revenue),
                        borderColor: colors.success,
                        backgroundColor: colors.success + '20',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: colors.success,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: colors.primary,
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 1) {
                                    return `Receita: R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
                                }
                                return `Transações: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    function createUsersChart() {
        const ctx = document.getElementById('usersChart');
        if (!ctx) return;

        const chartData = data.monthlyData;
        
        charts.users = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(item => item.month),
                datasets: [{
                    label: 'Novos Usuários',
                    data: chartData.map(item => item.users),
                    backgroundColor: colors.primary + '80',
                    borderColor: colors.primary,
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                return `Usuários: ${context.parsed.y.toLocaleString('pt-BR')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    function createCategoriesChart() {
        const ctx = document.getElementById('categoriesChart');
        if (!ctx) return;

        const chartData = data.topCategories;
        
        charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.map(item => item.name),
                datasets: [{
                    data: chartData.map(item => item.count),
                    backgroundColor: [
                        colors.primary,
                        colors.success,
                        colors.warning,
                        colors.purple,
                        colors.danger,
                        colors.gray
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed.toLocaleString('pt-BR')} (${percentage}%)`;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const dataset = data.datasets[0];
                                        const total = dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((dataset.data[i] / total) * 100).toFixed(1);
                                        return {
                                            text: `${label} (${percentage}%)`,
                                            fillStyle: dataset.backgroundColor[i],
                                            strokeStyle: dataset.backgroundColor[i],
                                            lineWidth: 0,
                                            pointStyle: 'circle',
                                            hidden: false,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    }
                }
            }
        });
    }

    function createStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const chartData = data.transactionStatus;
        
        charts.status = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.map(item => item.status),
                datasets: [{
                    data: chartData.map(item => item.count),
                    backgroundColor: [
                        colors.success,
                        colors.warning,
                        colors.gray,
                        colors.danger
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.toLocaleString('pt-BR')}`;
                            }
                        }
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    function createPaymentChart() {
        const ctx = document.getElementById('paymentChart');
        if (!ctx) return;

        const chartData = data.paymentMethods;
        
        charts.payment = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(item => item.method),
                datasets: [{
                    label: 'Transações',
                    data: chartData.map(item => item.count),
                    backgroundColor: [
                        colors.primary,
                        colors.success,
                        colors.warning,
                        colors.purple,
                        colors.gray
                    ],
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed.x / total) * 100).toFixed(1);
                                return `${context.parsed.x.toLocaleString('pt-BR')} (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('pt-BR');
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function setupEventListeners() {
        // Filtros de tempo
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
            button.addEventListener('click', function() {
                timeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentPeriod = this.dataset.period;
                updateCharts();
            });
        });

        // Botão de refresh
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                this.classList.add('loading');
                refreshData().finally(() => {
                    this.classList.remove('loading');
                });
            });
        }
    }

    function setupAutoRefresh() {
        const autoRefreshCheckbox = document.getElementById('autoRefresh');
        if (autoRefreshCheckbox) {
            setInterval(() => {
                if (autoRefreshCheckbox.checked) {
                    refreshData();
                }
            }, 30000); // Refresh a cada 30 segundos
        }
    }

    function startRealtimeUpdates() {
        // Simular atualizações em tempo real
        setInterval(() => {
            updateRealtimeStats();
        }, 5000); // Atualizar a cada 5 segundos
    }

    function updateRealtimeStats() {
        const elements = {
            users: document.getElementById('realtimeUsers'),
            transactions: document.getElementById('realtimeTransactions'),
            revenue: document.getElementById('realtimeRevenue')
        };

        if (elements.users) {
            const newUsers = Math.floor(Math.random() * 500) + 1000;
            animateNumber(elements.users, newUsers);
        }

        if (elements.transactions) {
            const newTransactions = Math.floor(Math.random() * 50) + 50;
            animateNumber(elements.transactions, newTransactions);
        }

        if (elements.revenue) {
            const newRevenue = Math.floor(Math.random() * 10000) + 10000;
            animateNumber(elements.revenue, newRevenue, true);
        }
    }

    function animateNumber(element, newValue, isCurrency = false) {
        const currentValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const difference = newValue - currentValue;
        const steps = 20;
        const stepSize = difference / steps;
        let currentStep = 0;

        const animation = setInterval(() => {
            currentStep++;
            const value = Math.round(currentValue + (stepSize * currentStep));
            
            if (isCurrency) {
                element.textContent = `R$ ${value.toLocaleString('pt-BR')}`;
            } else {
                element.textContent = value.toLocaleString('pt-BR');
            }

            if (currentStep >= steps) {
                clearInterval(animation);
            }
        }, 50);
    }

    async function refreshData() {
        try {
            const response = await fetch(`/dados/api/metrics`);
            const result = await response.json();
            
            if (result.success) {
                // Atualizar métricas na tela
                updateMetrics(result.metrics);
                
                // Atualizar gráficos com novos dados
                const chartResponse = await fetch(`/dados/api/realtime?period=${currentPeriod}`);
                const chartResult = await chartResponse.json();
                
                if (chartResult.success) {
                    updateChartsWithNewData(chartResult.data);
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            showNotification('Erro ao atualizar dados', 'error');
        }
    }

    function updateMetrics(metrics) {
        const elements = document.querySelectorAll('.metric-number');
        elements.forEach(element => {
            const card = element.closest('.metric-card');
            if (card.classList.contains('users')) {
                animateNumber(element, metrics.totalUsers);
            } else if (card.classList.contains('active-users')) {
                animateNumber(element, metrics.activeUsers);
            } else if (card.classList.contains('transactions')) {
                animateNumber(element, metrics.totalTransactions);
            } else if (card.classList.contains('revenue')) {
                element.textContent = `R$ ${metrics.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            }
        });
    }

    function updateCharts() {
        // Simular carregamento
        Object.values(charts).forEach(chart => {
            if (chart) {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = dataset.data.map(() => Math.random() * 100);
                });
                chart.update('none');
            }
        });
    }

    function updateChartsWithNewData(newData) {
        if (charts.transactions) {
            charts.transactions.data.labels = newData.map(item => 
                currentPeriod === 'hour' ? `${item.hour}:00` : item.date
            );
            charts.transactions.data.datasets[0].data = newData.map(item => item.transactions);
            charts.transactions.data.datasets[1].data = newData.map(item => item.revenue);
            charts.transactions.update();
        }
    }

    function showNotification(message, type = 'info') {
        // Função já existe no main.js, mas pode ser chamada aqui
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Tornar funções disponíveis globalmente se necessário
    window.dashboardUtils = {
        refreshData,
        updateCharts,
        currentPeriod: () => currentPeriod
    };
});