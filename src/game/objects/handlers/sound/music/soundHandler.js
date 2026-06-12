
export default class SoundHandler {
    constructor(scene) {
        this.scene = scene;

        // 🔊 Volume controls (0 → 1)
        this.masterVolume = 1;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.5;

        // 🎵 Music playlist
        this.playlist = [
            scene.sound.add('music_track_1_90bpm'),
            scene.sound.add('music_track_2_123bpm')
        ];

        this.currentIndex = 0;
        this.currentTrack = null;

        // 🔊 SFX
        this.sfx = {
            waveStart: scene.sound.add('sfx_wave_start'),
            waveEnd: scene.sound.add('sfx_wave_end'),
            gun: scene.sound.add('sfx_gunshot_laser_1')
        };
    }

    // 🎵 Start music
    startPlaylist() {
        this.currentIndex = 0;
        this.playTrack(this.currentIndex);
    }

    playTrack(index) {
        if (this.currentTrack) {
            this.currentTrack.stop();
        }

        this.currentTrack = this.playlist[index];

        // Apply volume
        this.currentTrack.setVolume(this.getMusicFinalVolume());

        this.currentTrack.play();

        this.currentTrack.once('complete', () => {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
            this.playTrack(this.currentIndex);
        });
    }

    // 🔊 Play SFX
    playSFX(key, volume = 1, rate = 1, detune = 0) {
        const finalVolume = volume * this.getSFXFinalVolume();

        this.scene.sound.play(key, {
            volume: finalVolume,
            rate: rate,
            detune: detune
        });
    }

    // 🎚 Combined volume helpers
    getMusicFinalVolume() {
        return this.masterVolume * this.musicVolume;
    }

    getSFXFinalVolume() {
        return this.masterVolume * this.sfxVolume;
    }

    // 🎛 Setters
    setMasterVolume(value) {
        this.masterVolume = Phaser.Math.Clamp(value, 0, 1);
        this.updateMusicVolume();
    }

    setMusicVolume(value) {
        this.musicVolume = Phaser.Math.Clamp(value, 0, 1);
        this.updateMusicVolume();
    }

    setSFXVolume(value) {
        this.sfxVolume = Phaser.Math.Clamp(value, 0, 1);
    }

    // 🔄 Update currently playing music
    updateMusicVolume() {
        if (this.currentTrack) {
            this.currentTrack.setVolume(this.getMusicFinalVolume());
        }
    }
}
