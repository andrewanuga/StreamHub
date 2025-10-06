// Movies Controller (Additional functionality can be added here)
// Most movie functionality is already in main.js

// You can add additional movie-specific features here
// For example: favorites, watchlist, etc.

class MovieManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
        this.watchlist = JSON.parse(localStorage.getItem('movieWatchlist')) || [];
    }

    addToFavorites(movieId) {
        if (!this.favorites.includes(movieId)) {
            this.favorites.push(movieId);
            this.saveFavorites();
        }
    }

    removeFromFavorites(movieId) {
        this.favorites = this.favorites.filter(id => id !== movieId);
        this.saveFavorites();
    }

    addToWatchlist(movieId) {
        if (!this.watchlist.includes(movieId)) {
            this.watchlist.push(movieId);
            this.saveWatchlist();
        }
    }

    removeFromWatchlist(movieId) {
        this.watchlist = this.watchlist.filter(id => id !== movieId);
        this.saveWatchlist();
    }

    saveFavorites() {
        localStorage.setItem('movieFavorites', JSON.stringify(this.favorites));
    }

    saveWatchlist() {
        localStorage.setItem('movieWatchlist', JSON.stringify(this.watchlist));
    }

    isFavorite(movieId) {
        return this.favorites.includes(movieId);
    }

    isInWatchlist(movieId) {
        return this.watchlist.includes(movieId);
    }
}

// Initialize movie manager
document.addEventListener('DOMContentLoaded', () => {
    window.movieManager = new MovieManager();
});