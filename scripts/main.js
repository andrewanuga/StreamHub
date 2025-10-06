// Main Application Controller
class MediaApp {
    constructor() {
        this.movieAPI = new MovieAPI();
        this.musicAPI = new MusicAPI();
        this.currentTab = 'music';
        this.currentView = 'grid';
        this.currentMovieCategory = 'popular';
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.loadInitialContent();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.switchTab(e.currentTarget.dataset.tab);
            });
        });

        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.currentTarget.dataset.view);
            });
        });

        // Movie category filter
        document.getElementById('movieCategory').addEventListener('change', (e) => {
            this.currentMovieCategory = e.target.value;
            this.loadMovies();
        });

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeMovieModal();
        });

        // Close modal when clicking outside
        document.getElementById('movieModal').addEventListener('click', (e) => {
            if (e.target.id === 'movieModal') {
                this.closeMovieModal();
            }
        });
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });

        this.currentTab = tabName;

        // Load content for the tab if not already loaded
        if (tabName === 'music') {
            this.loadMusic();
        } else if (tabName === 'movies') {
            this.loadMovies();
        }
    }

    switchView(viewType) {
        this.currentView = viewType;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewType);
        });

        // Update grid view
        const grid = document.getElementById(`${this.currentTab}Grid`);
        if (grid) {
            grid.className = `content-grid ${viewType}-view`;
        }
    }

    async handleSearch() {
        const query = document.getElementById('searchInput').value.trim();
        
        if (!query) {
            // If search is empty, reload default content
            if (this.currentTab === 'music') {
                this.loadMusic();
            } else {
                this.loadMovies();
            }
            return;
        }

        if (this.currentTab === 'music') {
            await this.searchMusic(query);
        } else {
            await this.searchMovies(query);
        }
    }

    async loadInitialContent() {
        await this.loadMusic();
    }

    async loadMusic() {
        const grid = document.getElementById('musicGrid');
        grid.innerHTML = '<div class="loading">Loading music...</div>';

        try {
            const tracks = await this.musicAPI.getTracks();
            this.displayMusic(tracks);
        } catch (error) {
            grid.innerHTML = '<div class="loading">Error loading music</div>';
            console.error('Error loading music:', error);
        }
    }

    async searchMusic(query) {
        const grid = document.getElementById('musicGrid');
        grid.innerHTML = '<div class="loading">Searching music...</div>';

        try {
            const tracks = await this.musicAPI.searchTracks(query);
            this.displayMusic(tracks);
        } catch (error) {
            grid.innerHTML = '<div class="loading">Error searching music</div>';
            console.error('Error searching music:', error);
        }
    }

    displayMusic(tracks) {
        const grid = document.getElementById('musicGrid');
        grid.className = `content-grid ${this.currentView}-view`;

        if (tracks.length === 0) {
            grid.innerHTML = '<div class="loading">No tracks found</div>';
            return;
        }

        grid.innerHTML = tracks.map(track => `
            <div class="card music-card" data-track-id="${track.id}">
                <div class="card-img-container">
                    <img src="${track.image}" alt="${track.name}" class="card-img">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-title">${track.name}</div>
                    <div class="card-subtitle">${track.artist}</div>
                    <div class="card-subtitle">${track.album}</div>
                </div>
            </div>
        `).join('');

        // Add click event listeners to music cards
        grid.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('click', () => {
                const trackId = parseInt(card.dataset.trackId);
                musicPlayer.playTrack(trackId);
            });
        });
    }

    async loadMovies() {
        const grid = document.getElementById('moviesGrid');
        grid.innerHTML = '<div class="loading">Loading movies...</div>';

        try {
            const movies = await this.movieAPI.getMovies(this.currentMovieCategory);
            this.displayMovies(movies);
        } catch (error) {
            grid.innerHTML = '<div class="loading">Error loading movies</div>';
            console.error('Error loading movies:', error);
        }
    }

    async searchMovies(query) {
        const grid = document.getElementById('moviesGrid');
        grid.innerHTML = '<div class="loading">Searching movies...</div>';

        try {
            const movies = await this.movieAPI.searchMovies(query);
            this.displayMovies(movies);
        } catch (error) {
            grid.innerHTML = '<div class="loading">Error searching movies</div>';
            console.error('Error searching movies:', error);
        }
    }

    displayMovies(movies) {
        const grid = document.getElementById('moviesGrid');
        grid.className = `content-grid ${this.currentView}-view movies-grid`;

        if (movies.length === 0) {
            grid.innerHTML = '<div class="loading">No movies found</div>';
            return;
        }

        grid.innerHTML = movies.map(movie => `
            <div class="card movie-card" data-movie-id="${movie.id}">
                <div class="card-img-container">
                    <img src="${movie.poster_path ? API_CONFIG.TMDB_IMAGE_BASE + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" 
                         alt="${movie.title}" class="card-img">
                    <div class="movie-rating">
                        <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-title">${movie.title}</div>
                    <div class="card-subtitle">${new Date(movie.release_date).getFullYear()}</div>
                </div>
            </div>
        `).join('');

        // Add click event listeners to movie cards
        grid.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', () => {
                const movieId = parseInt(card.dataset.movieId);
                this.showMovieDetails(movieId);
            });
        });
    }

    async showMovieDetails(movieId) {
        try {
            const movie = await this.movieAPI.getMovieDetails(movieId);
            this.displayMovieDetails(movie);
        } catch (error) {
            console.error('Error loading movie details:', error);
        }
    }

    displayMovieDetails(movie) {
        const modal = document.getElementById('movieModal');
        const detailsContainer = document.getElementById('movieDetails');

        detailsContainer.innerHTML = `
            <div class="movie-details">
                <div class="movie-poster-container">
                    <img src="${movie.poster_path ? API_CONFIG.TMDB_IMAGE_BASE + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" 
                         alt="${movie.title}" class="movie-poster">
                </div>
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <div class="movie-meta">
                        <span class="movie-rating-badge">
                            <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                        </span>
                        <span>${new Date(movie.release_date).getFullYear()}</span>
                        <span>${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m</span>
                    </div>
                    <p class="movie-overview">${movie.overview}</p>
                    
                    <div class="movie-details-grid">
                        <div class="detail-item">
                            <span class="detail-label">Genre</span>
                            <span class="detail-value">${movie.genres.map(g => g.name).join(', ')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Release Date</span>
                            <span class="detail-value">${new Date(movie.release_date).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Budget</span>
                            <span class="detail-value">$${(movie.budget / 1000000).toFixed(1)}M</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Revenue</span>
                            <span class="detail-value">$${(movie.revenue / 1000000).toFixed(1)}M</span>
                        </div>
                    </div>

                    <div class="movie-trailer">
                        <button class="trailer-btn">
                            <i class="fab fa-youtube"></i>
                            Watch Trailer
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    closeMovieModal() {
        document.getElementById('movieModal').style.display = 'none';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mediaApp = new MediaApp();
});