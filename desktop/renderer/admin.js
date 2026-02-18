// Admin dashboard renderer script for Electron

// IPC communication setup
const ipcRenderer = typeof window !== 'undefined' && window.require ? window.require('electron').ipcRenderer : null;

// Load dashboard stats
async function loadStats() {
    if (ipcRenderer) {
        try {
            const stats = await ipcRenderer.invoke('get-admin-stats');
            updateStatsDisplay(stats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    } else {
        // Mock data for development
        const mockStats = {
            totalUsers: 1234,
            totalTransactions: 5678,
            totalTokens: 89,
            totalValue: 3500000,
        };
        updateStatsDisplay(mockStats);
    }
}

// Update stats display
function updateStatsDisplay(stats) {
    document.getElementById('totalUsers').textContent = stats.totalUsers.toLocaleString();
    document.getElementById('totalTransactions').textContent = stats.totalTransactions.toLocaleString();
    document.getElementById('totalTokens').textContent = stats.totalTokens;
    document.getElementById('totalValue').textContent = `$${(stats.totalValue / 1000000).toFixed(2)}M`;
}

// Load recent activity
async function loadActivity() {
    if (ipcRenderer) {
        try {
            const activities = await ipcRenderer.invoke('get-recent-activity');
            displayActivity(activities);
        } catch (error) {
            console.error('Failed to load activity:', error);
        }
    } else {
        // Mock data
        const mockActivities = [
            { action: 'New user registration', user: 'john@example.com', time: '2 minutes ago' },
            { action: 'Token transfer', user: 'alice@example.com', time: '5 minutes ago' },
            { action: 'NFT minted', user: 'bob@example.com', time: '10 minutes ago' },
        ];
        displayActivity(mockActivities);
    }
}

// Display activity list
function displayActivity(activities) {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-content">
                <p class="activity-action">${activity.action}</p>
                <p class="activity-user">${activity.user}</p>
            </div>
            <span class="activity-time">${activity.time}</span>
        `;
        activityList.appendChild(item);
    });
}

// Refresh all data
function refreshData() {
    loadStats();
    loadActivity();
}

// Navigation handling
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        const section = item.getAttribute('href').replace('#', '');
        console.log('Navigate to:', section);
        // Handle navigation here
    });
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    setInterval(refreshData, 30000);
});
