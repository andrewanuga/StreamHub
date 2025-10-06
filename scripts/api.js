// API Configuration
const API_CONFIG = {
    // TMDB API (Free - you need to get your own API key)
    TMDB_API_KEY: 'YOUR_TMDB_API_KEY', // Replace with your TMDB API key
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
    
    // Spotify API (We'll use a mock since Spotify requires authentication)
    SPOTIFY_BASE_URL: 'https://api.spotify.com/v1',
    
    // Mock data for demo (since we can't use real Spotify API without authentication)
    MOCK_MUSIC_DATA: [
        {
            id: 1,
            name: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            duration: 200,
            preview_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
        },
        {
            id: 2,
            name: "Save Your Tears",
            artist: "The Weeknd",
            album: "After Hours",
            duration: 215,
            preview_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"
        },
        {
            id: 3,
            name: "Levitating",
            artist: "Dua Lipa",
            album: "Future Nostalgia",
            duration: 203,
            preview_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=500"
        },
        {
            id: 4,
            name: "Don't Start Now",
            artist: "Dua Lipa",
            album: "Future Nostalgia",
            duration: 183,
            preview_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            image: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=500"
        },
        {
            id: 5,
            name: "Watermelon Sugar",
            artist: "Harry Styles",
            album: "Fine Line",
            duration: 174,
            preview_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500"
        },
        {
            id: 6,
            name: "Adore You",
            artist: "Harry Styles",
            album: "Fine Line",
            duration: 207,
            preview_url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
            image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500"
        }
    ]
};

// TMDB API Functions
class MovieAPI {
    constructor() {
        this.apiKey = API_CONFIG.TMDB_API_KEY;
        this.baseUrl = API_CONFIG.TMDB_BASE_URL;
        this.imageBase = API_CONFIG.TMDB_IMAGE_BASE;
    }

    async getMovies(category = 'popular', page = 1) {
        try {
            // If no API key, use mock data
            if (this.apiKey === 'YOUR_TMDB_API_KEY') {
                return this.getMockMovies();
            }

            const response = await fetch(
                `${this.baseUrl}/movie/${category}?api_key=${this.apiKey}&page=${page}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return this.getMockMovies();
        }
    }

    async getMovieDetails(movieId) {
        try {
            // If no API key, use mock data
            if (this.apiKey === 'YOUR_TMDB_API_KEY') {
                return this.getMockMovieDetails(movieId);
            }

            const response = await fetch(
                `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return this.getMockMovieDetails(movieId);
        }
    }

    async searchMovies(query) {
        try {
            // If no API key, use mock data
            if (this.apiKey === 'YOUR_TMDB_API_KEY') {
                return this.getMockMovies().filter(movie => 
                    movie.title.toLowerCase().includes(query.toLowerCase())
                );
            }

            const response = await fetch(
                `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to search movies');
            }
            
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            return this.getMockMovies().filter(movie => 
                movie.title.toLowerCase().includes(query.toLowerCase())
            );
        }
    }

    getMockMovies() {
        return [
            {
                id: 1,
                title: "The Matrix",
                poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                vote_average: 8.7,
                release_date: "1999-03-31",
                overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
            },
            {
                id: 2,
                title: "Inception",
                poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                vote_average: 8.8,
                release_date: "2010-07-16",
                overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
            },
            {
                id: 3,
                title: "Interstellar",
                poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                vote_average: 8.6,
                release_date: "2014-11-07",
                overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
            },
            {
                id: 4,
                title: "The Dark Knight",
                poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                vote_average: 9.0,
                release_date: "2008-07-18",
                overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
            },
            {
                id: 5,
                title: "Pulp Fiction",
                poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                vote_average: 8.9,
                release_date: "1994-10-14",
                overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
            },
            {
                id: 6,
                title: "Fight Club",
                poster_path: "/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
                vote_average: 8.8,
                release_date: "1999-10-15",
                overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more."
            }
        ];
    }

    getMockMovieDetails(movieId) {
        const movies = {
            1: {
                id: 1,
                title: "The Matrix",
                overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
                poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
                release_date: "1999-03-31",
                runtime: 136,
                vote_average: 8.7,
                vote_count: 18965,
                genres: [{id: 28, name: "Action"}, {id: 878, name: "Science Fiction"}],
                production_companies: [{name: "Warner Bros."}],
                budget: 63000000,
                revenue: 463517383
            }
        };
        return movies[movieId] || movies[1];
    }
}

// Music API Functions (Mock implementation)
class MusicAPI {
    constructor() {
        this.tracks = API_CONFIG.MOCK_MUSIC_DATA;
        this.currentTrackIndex = 0;
    }

    async getTracks() {
        // Simulate API delay
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.tracks);
            }, 1000);
        });
    }

    async searchTracks(query) {
        return new Promise(resolve => {
            setTimeout(() => {
                const results = this.tracks.filter(track =>
                    track.name.toLowerCase().includes(query.toLowerCase()) ||
                    track.artist.toLowerCase().includes(query.toLowerCase())
                );
                resolve(results);
            }, 500);
        });
    }

    getTrackById(id) {
        return this.tracks.find(track => track.id === id);
    }

    getNextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        return this.tracks[this.currentTrackIndex];
    }

    getPreviousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        return this.tracks[this.currentTrackIndex];
    }
}

// Export APIs
window.MovieAPI = MovieAPI;
window.MusicAPI = MusicAPI;