// Weather Types con emojis
const weatherTypes = [
    { id: 'EXTRASUNNY', name: 'Extra Soleado', icon: '☀️' },
    { id: 'CLEAR', name: 'Despejado', icon: '🌤️' },
    { id: 'CLOUDS', name: 'Nublado', icon: '☁️' },
    { id: 'OVERCAST', name: 'Muy Nublado', icon: '🌥️' },
    { id: 'RAIN', name: 'Lluvia', icon: '🌧️' },
    { id: 'THUNDER', name: 'Tormenta', icon: '⛈️' },
    { id: 'CLEARING', name: 'Aclarando', icon: '🌦️' },
    { id: 'NEUTRAL', name: 'Neutral', icon: '🌫️' },
    { id: 'SMOG', name: 'Smog', icon: '💨' },
    { id: 'FOGGY', name: 'Niebla', icon: '🌫️' },
    { id: 'XMAS', name: 'Navidad', icon: '🎄' },
    { id: 'SNOW', name: 'Nieve', icon: '❄️' },
    { id: 'SNOWLIGHT', name: 'Nieve Ligera', icon: '🌨️' },
    { id: 'BLIZZARD', name: 'Ventisca', icon: '🌬️' },
    { id: 'HALLOWEEN', name: 'Halloween', icon: '🎃' }
];

// Current state
let currentWeather = 'CLEAR';
let currentHour = 12;
let currentMinute = 0;

// DOM Elements
const container = document.getElementById('mainContainer');
const weatherGrid = document.getElementById('weatherGrid');
const timeSlider = document.getElementById('timeSlider');
const timeDisplay = document.getElementById('timeDisplay');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initWeatherGrid();
    initTabs();
    initTimeSlider();
    initToggles();
    initButtons();
});

// Initialize Weather Grid
function initWeatherGrid() {
    weatherGrid.innerHTML = '';
    weatherTypes.forEach(weather => {
        const item = document.createElement('div');
        item.className = 'weather-item';
        item.dataset.weather = weather.id;
        item.innerHTML = `
            <span class="weather-icon">${weather.icon}</span>
            <span class="weather-name">${weather.name}</span>
        `;
        item.addEventListener('click', () => selectWeather(weather.id));
        weatherGrid.appendChild(item);
    });
    updateWeatherSelection();
}

// Initialize Tabs
function initTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Initialize Time Slider
function initTimeSlider() {
    timeSlider.addEventListener('input', (e) => {
        const totalMinutes = parseInt(e.target.value);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        updateTimeDisplay(hours, minutes);
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const hour = parseInt(btn.dataset.hour);
            const minute = parseInt(btn.dataset.minute);
            const totalMinutes = hour * 60 + minute;
            timeSlider.value = totalMinutes;
            updateTimeDisplay(hour, minute);
        });
    });
}

// Initialize Toggles
function initToggles() {
    document.getElementById('freezeTimeToggle').addEventListener('change', (e) => {
        sendNUI('toggleFreezeTime', { state: e.target.checked });
        showToast(e.target.checked ? '⏸️ Tiempo congelado' : '▶️ Tiempo reanudado');
    });

    document.getElementById('dynamicWeatherToggle').addEventListener('change', (e) => {
        sendNUI('toggleDynamicWeather', { state: e.target.checked });
        showToast(e.target.checked ? '🔄 Clima dinámico activado' : '⏹️ Clima dinámico desactivado');
    });

    document.getElementById('blackoutToggle').addEventListener('change', (e) => {
        sendNUI('toggleBlackout', { state: e.target.checked });
        showToast(e.target.checked ? '🌑 Blackout activado' : '💡 Blackout desactivado');
    });
}

// Initialize Buttons
function initButtons() {
    // Close button
    document.getElementById('closeBtn').addEventListener('click', () => {
        closeMenu();
    });

    // Apply time button
    document.getElementById('applyTimeBtn').addEventListener('click', () => {
        const totalMinutes = parseInt(timeSlider.value);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        sendNUI('setTime', { hour: hours, minute: minutes });
        showToast('🕐 Hora aplicada: ' + formatTime(hours, minutes));
    });

    // Sync button
    document.getElementById('syncBtn').addEventListener('click', () => {
        sendNUI('syncAll', {});
        showToast('🔄 Sincronizado con todos');
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}

// Select Weather
function selectWeather(weatherId) {
    currentWeather = weatherId;
    updateWeatherSelection();
    sendNUI('setWeather', { weather: weatherId });
    
    const weather = weatherTypes.find(w => w.id === weatherId);
    showToast(`${weather.icon} Clima: ${weather.name}`);
}

// Update Weather Selection
function updateWeatherSelection() {
    document.querySelectorAll('.weather-item').forEach(item => {
        item.classList.toggle('active', item.dataset.weather === currentWeather);
    });
    document.getElementById('currentWeatherStatus').textContent = currentWeather;
}

// Update Time Display
function updateTimeDisplay(hours, minutes) {
    currentHour = hours;
    currentMinute = minutes;
    const formattedTime = formatTime(hours, minutes);
    timeDisplay.textContent = formattedTime;
    document.getElementById('currentTimeStatus').textContent = formattedTime;
}

// Format Time
function formatTime(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Show Toast Notification
function showToast(message, isError = false) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Send NUI Message
function sendNUI(action, data) {
    fetch(`https://qb-weathersync/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Close Menu
function closeMenu() {
    container.classList.remove('show');
    sendNUI('close', {});
}

// Open Menu
function openMenu() {
    container.classList.add('show');
}

// NUI Message Handler
window.addEventListener('message', (event) => {
    const data = event.data;

    switch (data.action) {
        case 'open':
            openMenu();
            if (data.states) {
                updateStates(data.states);
            }
            break;

        case 'close':
            closeMenu();
            break;

        case 'updateStates':
            updateStates(data.states);
            break;
    }
});

// Update States from Server
function updateStates(states) {
    if (states.weather) {
        currentWeather = states.weather;
        updateWeatherSelection();
    }

    if (states.hour !== undefined && states.minute !== undefined) {
        const totalMinutes = states.hour * 60 + states.minute;
        timeSlider.value = totalMinutes;
        updateTimeDisplay(states.hour, states.minute);
    }

    if (states.freezeTime !== undefined) {
        document.getElementById('freezeTimeToggle').checked = states.freezeTime;
    }

    if (states.dynamicWeather !== undefined) {
        document.getElementById('dynamicWeatherToggle').checked = states.dynamicWeather;
    }

    if (states.blackout !== undefined) {
        document.getElementById('blackoutToggle').checked = states.blackout;
    }
}
