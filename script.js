class SPARKSApp {
    constructor() {
        this.currentYear = '2025';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent();
    }

    setupEventListeners() {
        const yearSelect = document.getElementById('yearSelect');
        yearSelect.addEventListener('change', (e) => {
            this.currentYear = e.target.value;
            this.loadContent();
        });
    }

    loadContent() {
        const container = document.getElementById('componentsAccordion');
        const data = websiteData[this.currentYear] || [];
        
        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Tidak ada data untuk tahun ${this.currentYear}</h3>
                    <p>Silakan pilih tahun lain untuk melihat data yang tersedia.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        data.forEach((component, idx) => {
            const item = this.createAccordionItem(component, idx);
            container.appendChild(item);
        });
    }

    createAccordionItem(component, idx) {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        // If component.url exists, wrap name in a link
        const nameHtml = component.url
            ? `<a href="${component.url}" target="_blank" class="text-decoration-underline text-primary">${component.name}</a>`
            : component.name;

        item.innerHTML = `
            <button class="accordion-header" onclick="this.parentElement.querySelector('.accordion-content').classList.toggle('active'); this.classList.toggle('active')">
                <div class="accordion-title">
                    <div class="accordion-icon">
                        <i class="${component.icon}"></i>
                    </div>
                    <div class="accordion-text">
                        <h3>${nameHtml}</h3>
                        ${component.description ? `<p>${component.description}</p>` : ''}
                    </div>
                </div>
                <div class="accordion-toggle">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </button>
            <div class="accordion-content">
                ${component.subComponents.map(sub => this.renderSubComponent(sub)).join('')}
            </div>
        `;
        return item;
    }

    renderSubComponent(sub) {
        // If sub.url exists, wrap name in a link
        const subNameHtml = sub.url
            ? `<a href="${sub.url}" target="_blank" class="text-decoration-underline text-primary">${sub.name}</a>`
            : sub.name;

        return `
            <div class="sub-component">
                <div class="sub-component-header">
                    <div class="sub-component-icon">
                        <i class="${sub.icon}"></i>
                    </div>
                    <div class="sub-component-title">${subNameHtml}</div>
                </div>
                ${sub.description ? `<div class="sub-component-description">${sub.description}</div>` : ''}
                ${sub.links.length > 0 ? `
                    <div class="links-container">
                        ${sub.links.map(link => `
                            <a href="${link.url}" target="_blank" class="link-btn">
                                <i class="fas fa-external-link-alt"></i>
                                ${link.name}
                            </a>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SPARKSApp();
});