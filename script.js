class PlacesApp {
    constructor() {
        this.places = [];
        this.placeForm = document.getElementById('placeForm');
        this.statsGrid = document.getElementById('statsGrid');
        this.placesList = document.getElementById('placesList');
        this.clearAllBtn = document.getElementById('clearAll');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.placeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addPlace();
        });

        this.clearAllBtn.addEventListener('click', () => {
            if (confirm('Clear all places?')) {
                this.places = [];
                this.render();
            }
        });
    }

    addPlace() {
        const location = document.getElementById('location').value.trim();
        const landmark = document.getElementById('landmark').value.trim();
        const season = document.getElementById('season').value;
        const rating = parseInt(document.getElementById('rating').value) || 0;
        const notes = document.getElementById('notes').value.trim();

        if (!location || !landmark || !season) {
            alert('Please fill location, landmark, and season');
            return;
        }

        const place = {
            id: Date.now(),
            location,
            landmark,
            season,
            rating: Math.max(0, Math.min(5, rating)),
            notes,
            dateAdded: new Date().toLocaleDateString()
        };

        this.places.unshift(place);
        this.placeForm.reset();
        this.render();
    }

    deletePlace(id) {
        this.places = this.places.filter(place => place.id !== id);
        this.render();
    }

    toggleDetails(id) {
        const details = document.getElementById(`details-${id}`);
        if (details) details.classList.toggle('expanded');
    }

    render() {
        this.renderStats();
        this.renderPlaces();
    }

    renderStats() {
        const total = this.places.length;
        const avgRating = total ? (this.places.reduce((sum, p) => sum + p.rating, 0) / total).toFixed(1) : 0;
        
        this.statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div>Total Places</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${avgRating}⭐</div>
                <div>Avg Rating</div>
            </div>
        `;
    }

    renderPlaces() {
        const sortedPlaces = [...this.places].sort((a, b) => b.rating - a.rating);
        const container = this.placesList;

        if (sortedPlaces.length === 0) {
            container.innerHTML = '<div class="empty-state">No places yet! Add your first adventure ✨</div>';
            return;
        }

        container.innerHTML = sortedPlaces.map(place => {
            const stars = '⭐'.repeat(place.rating) + '☆'.repeat(5 - place.rating);
            return `
                <div class="place-card">
                    <div class="place-header" onclick="app.toggleDetails(${place.id})">
                        <div class="place-title">${place.location} - ${place.landmark}</div>
                        <div class="place-season">${place.season}</div>
                    </div>
                    <div class="place-stars">${stars}</div>
                    <div class="place-details" id="details-${place.id}">
                        <div class="detail-item">
                            <div class="detail-label">📝 Notes</div>
                            ${place.notes || 'No notes'}
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">📅 Added</div>
                            ${place.dateAdded}
                        </div>
                        <div class="actions">
                            <button class="btn-delete" onclick="app.deletePlace(${place.id}); event.stopPropagation();">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new PlacesApp();
});