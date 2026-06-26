// Default timezones configuration
const defaultTimezones = [
    { id: 'brasilia', timezone: 'America/Sao_Paulo', label: 'São Paulo' },
    { id: 'newyork', timezone: 'America/New_York', label: 'New York' },
    { id: 'london', timezone: 'Europe/London', label: 'London' },
    { id: 'paris', timezone: 'Europe/Paris', label: 'Paris' },
    { id: 'tokyo', timezone: 'Asia/Tokyo', label: 'Tokyo' },
    { id: 'sydney', timezone: 'Australia/Sydney', label: 'Sydney' },
    { id: 'dubai', timezone: 'Asia/Dubai', label: 'Dubai' },
    { id: 'singapore', timezone: 'Asia/Singapore', label: 'Singapore' }
];

// Store custom timezones in localStorage
let customTimezones = JSON.parse(localStorage.getItem('customTimezones')) || [];

// Initialize the clock
function initClock() {
    updateAllClocks();
    
    // Update clocks every second
    setInterval(updateAllClocks, 1000);
    
    // Setup event listeners
    setupEventListeners();
}

// Update all clock displays
function updateAllClocks() {
    const now = new Date();
    
    // Update default timezones
    defaultTimezones.forEach(tz => {
        updateClock(tz.id, tz.timezone, tz.label);
    });
    
    // Update custom timezones
    customTimezones.forEach((tz, index) => {
        updateClock(`custom-${index}`, tz.timezone, tz.label);
    });
}

// Update individual clock
function updateClock(elementId, timezone, label) {
    try {
        // Get time in specific timezone
        const timeString = new Date().toLocaleString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const dateString = new Date().toLocaleString('en-US', {
            timeZone: timezone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });

        // Update DOM elements
        const timeElement = document.getElementById(`clock-${elementId}`);
        const dateElement = document.getElementById(`date-${elementId}`);

        if (timeElement) {
            timeElement.textContent = timeString;
        }

        if (dateElement) {
            dateElement.textContent = dateString;
        }
    } catch (error) {
        console.error(`Error updating clock for ${elementId}:`, error);
        const timeElement = document.getElementById(`clock-${elementId}`);
        if (timeElement) {
            timeElement.textContent = 'Invalid TZ';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    const modal = document.getElementById('custom-timezone-modal');
    const addBtn = document.getElementById('add-timezone-btn');
    const closeBtn = document.querySelector('.close');
    const addCustomBtn = document.getElementById('add-custom-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Open modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.getElementById('timezone-input').focus();
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add custom timezone
    addCustomBtn.addEventListener('click', addCustomTimezone);

    // Allow pressing Enter in input fields
    document.getElementById('timezone-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomTimezone();
    });

    document.getElementById('timezone-label').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomTimezone();
    });

    // Reset button
    resetBtn.addEventListener('click', resetToDefault);
}

// Add custom timezone
function addCustomTimezone() {
    const timezone = document.getElementById('timezone-input').value.trim();
    const label = document.getElementById('timezone-label').value.trim();

    if (!timezone || !label) {
        alert('Please fill in both timezone and label fields');
        return;
    }

    // Validate timezone
    try {
        new Date().toLocaleString('en-US', { timeZone: timezone });
    } catch (error) {
        alert(`Invalid timezone: "${timezone}". Please use IANA timezone identifiers.`);
        return;
    }

    // Check if timezone already exists
    if (customTimezones.some(tz => tz.timezone === timezone)) {
        alert('This timezone is already added');
        return;
    }

    // Add timezone
    customTimezones.push({
        timezone: timezone,
        label: label
    });

    // Save to localStorage
    localStorage.setItem('customTimezones', JSON.stringify(customTimezones));

    // Add card to UI
    addTimezoneCard(timezone, label, customTimezones.length - 1);

    // Reset form
    document.getElementById('timezone-input').value = '';
    document.getElementById('timezone-label').value = '';
    document.getElementById('custom-timezone-modal').style.display = 'none';

    // Update the new clock
    updateAllClocks();
}

// Add timezone card to UI
function addTimezoneCard(timezone, label, index) {
    const clockGrid = document.querySelector('.clock-grid');
    
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.id = `card-custom-${index}`;
    card.innerHTML = `
        <div class="timezone-name">${label}</div>
        <div class="timezone-code">${timezone}</div>
        <div class="digital-time" id="clock-custom-${index}">00:00:00</div>
        <div class="date" id="date-custom-${index}">Loading...</div>
        <button class="btn btn-delete" onclick="removeTimezone(${index})" style="margin-top: 10px; padding: 8px 15px; font-size: 0.9em;">Remove</button>
    `;
    
    clockGrid.appendChild(card);
}

// Remove timezone
function removeTimezone(index) {
    if (confirm(`Remove "${customTimezones[index].label}" from clocks?`)) {
        const card = document.getElementById(`card-custom-${index}`);
        if (card) {
            card.remove();
        }

        customTimezones.splice(index, 1);
        localStorage.setItem('customTimezones', JSON.stringify(customTimezones));
        updateAllClocks();
    }
}

// Reset to default timezones
function resetToDefault() {
    if (confirm('Remove all custom timezones and reset to defaults?')) {
        customTimezones = [];
        localStorage.setItem('customTimezones', JSON.stringify(customTimezones));

        // Remove custom cards
        document.querySelectorAll('[id^="card-custom-"]').forEach(card => {
            card.remove();
        });

        updateAllClocks();
    }
}

// Load custom timezones on page load
function loadCustomTimezones() {
    customTimezones.forEach((tz, index) => {
        addTimezoneCard(tz.timezone, tz.label, index);
    });
}

// Start clock when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCustomTimezones();
    initClock();
});

// Update clock every time document becomes visible (tab focus)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateAllClocks();
    }
});
