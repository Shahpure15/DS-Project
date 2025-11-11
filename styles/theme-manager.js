// AlgoSprint - Persistent Theme Manager
// Manages theme state across all pages with localStorage persistence

class ThemeManager {
    constructor() {
        this.storageKey = 'algosprint-theme';
        this.init();
    }

    init() {
        // Get saved theme or default to light
        const savedTheme = localStorage.getItem(this.storageKey) || 'light';
        this.applyTheme(savedTheme, false);
        this.setupToggleButtons();
        this.broadcastThemeChange();
    }

    applyTheme(theme, save = true) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }

        // Update toggle button icons
        this.updateToggleIcons(theme);

        if (save) {
            localStorage.setItem(this.storageKey, theme);
        }
    }

    updateToggleIcons(theme) {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            if (theme === 'dark') {
                toggle.textContent = '☀️';
                toggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                toggle.textContent = '🌙';
                toggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        });
    }

    toggle() {
        const currentTheme = localStorage.getItem(this.storageKey) || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.broadcastThemeChange();
    }

    getCurrentTheme() {
        return localStorage.getItem(this.storageKey) || 'light';
    }

    setupToggleButtons() {
        const toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggle());
        });
    }

    broadcastThemeChange() {
        // Broadcast to other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === this.storageKey) {
                this.applyTheme(e.newValue, false);
            }
        });
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}
