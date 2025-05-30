// Air Fryer Conversion App JavaScript

// Application data
const appData = {
  conversionRules: {
    convectionOven: {
      tempReduction: 20,
      timeMultiplier: 0.8,
      name: "Backofen Umluft"
    },
    conventionalOven: {
      tempReduction: 40,
      timeMultiplier: 0.8,
      name: "Backofen Ober-/Unterhitze"
    },
    deepFryer: {
      tempReduction: 15,
      timeMultiplier: 0.9,
      name: "Fritteuse"
    }
  },
  foodChart: [
    {"food": "Hähnchenbrust", "temp": 200, "time": "16-22", "category": "Fleisch"},
    {"food": "Chicken Wings", "temp": 200, "time": "20-25", "category": "Fleisch"},
    {"food": "Schweinekoteletts", "temp": 180, "time": "12-15", "category": "Fleisch"},
    {"food": "Rindfleisch-Burger", "temp": 190, "time": "10-18", "category": "Fleisch"},
    {"food": "Lachs", "temp": 200, "time": "10-14", "category": "Fisch"},
    {"food": "Garnelen", "temp": 180, "time": "8-10", "category": "Fisch"},
    {"food": "Pommes Frites (TK)", "temp": 180, "time": "14-25", "category": "Tiefkühlkost"},
    {"food": "Mozzarella Sticks", "temp": 200, "time": "6-8", "category": "Tiefkühlkost"},
    {"food": "Brokkoli", "temp": 180, "time": "5-6", "category": "Gemüse"},
    {"food": "Karotten", "temp": 180, "time": "14-16", "category": "Gemüse"},
    {"food": "Süßkartoffeln", "temp": 180, "time": "15-20", "category": "Gemüse"},
    {"food": "Spargel", "temp": 180, "time": "8-12", "category": "Gemüse"},
    {"food": "Ofenkartoffeln", "temp": 200, "time": "30-40", "category": "Gemüse"}
  ],
  safetyTemperatures: [
    {"meat": "Hähnchen/Geflügel", "temp": "74°C", "description": "Vollständig durchgegart"},
    {"meat": "Schweinefleisch", "temp": "71°C", "description": "Sicher gegart"},
    {"meat": "Rindfleisch (Medium)", "temp": "60°C", "description": "Rosa bis medium"},
    {"meat": "Rindfleisch (Well Done)", "temp": "71°C", "description": "Vollständig durch"},
    {"meat": "Fisch", "temp": "63°C", "description": "Durchgegart"},
    {"meat": "Hackfleisch", "temp": "71°C", "description": "Vollständig durch"}
  ],
  tips: [
    "Heißluftfritteusen kochen 20-25% schneller als normale Backöfen",
    "Vorheizen der Heißluftfritteuse für 3-5 Minuten für beste Ergebnisse",
    "Lebensmittel nicht überfüllen - Luft muss zirkulieren können",
    "Bei panierten Lebensmitteln etwas Öl-Spray für extra Knusprigkeit",
    "Regelmäßig kontrollieren - erste Male bei neuen Rezepten",
    "Fleisch mit Fleischthermometer auf Kerntemperatur prüfen"
  ]
};

// DOM elements
const conversionForm = document.getElementById('conversionForm');
const originalTempInput = document.getElementById('originalTemp');
const originalTimeInput = document.getElementById('originalTime');
const resultsSection = document.getElementById('results');
const convertedTempSpan = document.getElementById('convertedTemp');
const convertedTimeSpan = document.getElementById('convertedTime');
const resetBtn = document.getElementById('resetBtn');
const foodTableBody = document.getElementById('foodTableBody');
const safetyTemperaturesDiv = document.getElementById('safetyTemperatures');
const tipsContainer = document.getElementById('tipsContainer');

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    populateFoodTable();
    populateSafetyTemperatures();
    populateTips();
}

function setupEventListeners() {
    conversionForm.addEventListener('submit', handleConversion);
    resetBtn.addEventListener('click', resetForm);
    
    // Add input validation
    originalTempInput.addEventListener('input', validateTemperature);
    originalTimeInput.addEventListener('input', validateTime);
}

function handleConversion(event) {
    event.preventDefault();
    
    const originalTemp = parseInt(originalTempInput.value);
    const originalTime = parseInt(originalTimeInput.value);
    const cookingMethod = document.querySelector('input[name="cookingMethod"]:checked');
    
    // Validate inputs
    if (!validateInputs(originalTemp, originalTime, cookingMethod)) {
        return;
    }
    
    // Perform conversion
    const conversionRule = appData.conversionRules[cookingMethod.value];
    const convertedTemp = Math.round(originalTemp - conversionRule.tempReduction);
    const convertedTime = Math.round(originalTime * conversionRule.timeMultiplier);
    
    // Display results
    displayResults(convertedTemp, convertedTime);
}

function validateInputs(temp, time, method) {
    let isValid = true;
    
    // Remove existing error messages
    removeErrorMessages();
    
    // Validate temperature
    if (!temp || temp < 50 || temp > 250) {
        showError(originalTempInput, 'Temperatur muss zwischen 50°C und 250°C liegen');
        isValid = false;
    }
    
    // Validate time
    if (!time || time < 1 || time > 120) {
        showError(originalTimeInput, 'Zeit muss zwischen 1 und 120 Minuten liegen');
        isValid = false;
    }
    
    // Validate cooking method
    if (!method) {
        showError(document.querySelector('.radio-group'), 'Bitte wählen Sie eine Kochmethode aus');
        isValid = false;
    }
    
    return isValid;
}

function validateTemperature() {
    const temp = parseInt(originalTempInput.value);
    if (originalTempInput.value && (temp < 50 || temp > 250)) {
        originalTempInput.style.borderColor = 'var(--color-error)';
    } else {
        originalTempInput.style.borderColor = '';
    }
}

function validateTime() {
    const time = parseInt(originalTimeInput.value);
    if (originalTimeInput.value && (time < 1 || time > 120)) {
        originalTimeInput.style.borderColor = 'var(--color-error)';
    } else {
        originalTimeInput.style.borderColor = '';
    }
}

function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (element.classList.contains('radio-group')) {
        element.appendChild(errorDiv);
    } else {
        element.parentNode.appendChild(errorDiv);
    }
}

function removeErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    // Reset input border colors
    originalTempInput.style.borderColor = '';
    originalTimeInput.style.borderColor = '';
}

function displayResults(temp, time) {
    convertedTempSpan.textContent = `${temp}°C`;
    convertedTimeSpan.textContent = `${time} Min`;
    
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('show');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetForm() {
    conversionForm.reset();
    resultsSection.classList.add('hidden');
    resultsSection.classList.remove('show');
    removeErrorMessages();
}

function populateFoodTable() {
    const categoryEmojis = {
        'Fleisch': '🥩',
        'Fisch': '🐟',
        'Gemüse': '🥬',
        'Tiefkühlkost': '🧊'
    };
    
    appData.foodChart.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${categoryEmojis[item.category]} ${item.food}</td>
            <td><strong>${item.temp}°C</strong></td>
            <td><strong>${item.time}</strong></td>
            <td><span class="category-${item.category.toLowerCase()}">${item.category}</span></td>
        `;
        
        foodTableBody.appendChild(row);
    });
}

function populateSafetyTemperatures() {
    appData.safetyTemperatures.forEach(item => {
        const safetyItem = document.createElement('div');
        safetyItem.className = 'safety-item';
        
        safetyItem.innerHTML = `
            <div class="safety-meat">🌡️ ${item.meat}</div>
            <div class="safety-temp">${item.temp}</div>
            <div class="safety-description">${item.description}</div>
        `;
        
        safetyTemperaturesDiv.appendChild(safetyItem);
    });
}

function populateTips() {
    appData.tips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'tip-item';
        tipItem.textContent = tip;
        
        tipsContainer.appendChild(tipItem);
    });
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.type === 'radio') {
        event.target.checked = true;
    }
});

// Add smooth animations for better UX
function addLoadingState(element) {
    element.classList.add('loading');
}

function removeLoadingState(element) {
    element.classList.remove('loading');
}

// Handle form submission with loading state
const originalHandleConversion = handleConversion;
handleConversion = function(event) {
    event.preventDefault();
    addLoadingState(conversionForm);
    
    setTimeout(() => {
        originalHandleConversion.call(this, event);
        removeLoadingState(conversionForm);
    }, 300);
};

// Add conversion history (simple implementation)
let conversionHistory = [];

function addToHistory(originalTemp, originalTime, method, convertedTemp, convertedTime) {
    const historyItem = {
        timestamp: new Date().toLocaleString('de-DE'),
        original: { temp: originalTemp, time: originalTime, method },
        converted: { temp: convertedTemp, time: convertedTime }
    };
    
    conversionHistory.unshift(historyItem);
    if (conversionHistory.length > 5) {
        conversionHistory.pop();
    }
}

// Enhanced error handling
window.addEventListener('error', function(event) {
    console.error('App Error:', event.error);
});

// Progressive enhancement for better mobile experience
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Service worker registration for offline functionality (basic)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here for offline functionality
        console.log('App ready for offline enhancements');
    });
}