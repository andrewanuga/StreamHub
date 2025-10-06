// Music Player Controller
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.isPlaying = false;
        this.currentTrack = null;
        this.tracks = [];
        
        this.initializePlayer();
    }

    initializePlayer() {
        this.setupEventListeners();
        this.loadTracks();
    }

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlay();
        });

        // Next button
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextTrack();
        });

        // Previous button
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousTrack();
        });

        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTimeDisplay();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });

        // Progress bar click
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            this.seek(e);
        });
    }

    async loadTracks() {
        const musicAPI = new MusicAPI();
        this.tracks = await musicAPI.getTracks();
    }

    playTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;

        this.currentTrack = track;
        this.audio.src = track.preview_url;
        
        this.updateNowPlaying();
        this.play();
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    togglePlay() {
        if (!this.currentTrack) {
            // If no track is selected, play the first one
            if (this.tracks.length > 0) {
                this.playTrack(this.tracks[0].id);
            }
            return;
        }

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    nextTrack() {
        if (this.tracks.length === 0) return;

        const musicAPI = new MusicAPI();
        const nextTrack = musicAPI.getNextTrack();
        this.playTrack(nextTrack.id);
    }

    previousTrack() {
        if (this.tracks.length === 0) return;

        const musicAPI = new MusicAPI();
        const prevTrack = musicAPI.getPreviousTrack();
        this.playTrack(prevTrack.id);
    }

    updateNowPlaying() {
        if (!this.currentTrack) return;

        document.getElementById('currentTrackArt').src = this.currentTrack.image;
        document.getElementById('currentTrackName').textContent = this.currentTrack.name;
        document.getElementById('currentArtistName').textContent = this.currentTrack.artist;
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const icon = playPauseBtn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    updateProgress() {
        const progress = document.getElementById('musicProgress');
        const currentTime = document.getElementById('currentTime');
        const totalTime = document.getElementById('totalTime');

        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            progress.style.width = `${percent}%`;
        }

        currentTime.textContent = this.formatTime(this.audio.currentTime);
        totalTime.textContent = this.formatTime(this.audio.duration);
    }

    updateTimeDisplay() {
        const totalTime = document.getElementById('totalTime');
        totalTime.textContent = this.formatTime(this.audio.duration);
    }

    seek(e) {
        if (!this.audio.duration) return;

        const progressBar = e.currentTarget;
        const clickPosition = e.offsetX;
        const progressBarWidth = progressBar.offsetWidth;
        const seekTime = (clickPosition / progressBarWidth) * this.audio.duration;

        this.audio.currentTime = seekTime;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize music player
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});