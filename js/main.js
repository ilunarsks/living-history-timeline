// Living History Timeline - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const timelineContainer = document.getElementById('timeline-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    let allEvents = [];

    // Fetch events from events.json
    fetch('data/events.json')
        .then(response => response.json())
        .then(events => {
            allEvents = events;
            renderTimeline(allEvents);
            updateStats();
        })
        .catch(error => {
            console.error('Error loading events:', error);
            timelineContainer.innerHTML = '<div class="timeline-placeholder"><p><i class="fas fa-exclamation-triangle"></i> Could not load timeline data. Please check the connection.</p></div>';
        });

    // Render timeline events
    function renderTimeline(events) {
        if (events.length === 0) {
            timelineContainer.innerHTML = '<div class="timeline-placeholder"><p><i class="fas fa-search"></i> No events match your filter. Try a different search.</p></div>';
            return;
        }

        timelineContainer.innerHTML = '';
        events.forEach(event => {
            const eventElement = createEventCard(event);
            timelineContainer.appendChild(eventElement);
        });
    }

    // Create HTML for a single event
    function createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'timeline-event';
        card.setAttribute('data-country', event.country.toLowerCase());
        card.setAttribute('data-category', event.category);

        const countryClass = event.country === 'USSR' ? 'country-ussr' : 'country-usa';
        const sourcesHTML = event.sources.map(src => `<a href="${src}" target="_blank" rel="noopener">${new URL(src).hostname}</a>`).join(' ');

        card.innerHTML = `
            <div class="event-header">
                <span class="event-date">${event.date}</span>
                <span class="event-country ${countryClass}">${event.country}</span>
            </div>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
            ${event.image ? `<img src="${event.image}" alt="${event.title}" class="event-image" loading="lazy">` : ''}
            <div class="event-sources">
                <strong>Sources:</strong> ${sourcesHTML}
            </div>
        `;
        return card;
    }

    // Filter events by country/category
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.id.replace('filter-', '');
            filterEvents(filter);
        });
    });

    function filterEvents(filter) {
        let filtered = allEvents;
        if (filter === 'ussr') {
            filtered = allEvents.filter(event => event.country === 'USSR');
        } else if (filter === 'usa') {
            filtered = allEvents.filter(event => event.country === 'USA');
        } else if (filter === 'milestone') {
            filtered = allEvents.filter(event => event.category === 'milestone');
        }
        // 'all' filter keeps all events
        renderTimeline(filtered);
    }

    // Search events by title or description
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length === 0) {
            // If no search, apply current filter
            const activeFilter = document.querySelector('.filter-btn.active').id.replace('filter-', '');
            filterEvents(activeFilter);
            return;
        }

        let filtered = allEvents.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.date.toLowerCase().includes(query)
        );
        renderTimeline(filtered);
    });

    // Update GitHub stats (placeholder - could be replaced with real API calls)
    function updateStats() {
        // In a real scenario, you could fetch from GitHub API:
        // https://api.github.com/repos/ilunarsks/living-history-timeline
        // For now, we'll set static numbers or leave as placeholders.
        document.getElementById('commit-count').textContent = allEvents.length * 3; // example
        document.getElementById('issue-count').textContent = allEvents.length + 2;
        document.getElementById('contributor-count').textContent = Math.max(1, allEvents.length - 1);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Update active nav link
                    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
});