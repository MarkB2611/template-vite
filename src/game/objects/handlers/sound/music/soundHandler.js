
export default class SoundHandler {
    constructor(scene) {
        this.scene = scene;

        this.playlist = [
            scene.sound.add('music_track_1_90bpm', { loop: false, volume: 0.5 }),
            scene.sound.add('music_track_2_123bpm', { loop: false, volume: 0.5 })
        ];

        this.currentIndex = 0;
        this.currentTrack = null;

        // SFX (same as before)
        this.sfx = {
            waveStart: scene.sound.add('sfx_wave_start'),
            waveEnd: scene.sound.add('sfx_wave_end'),
            gun: scene.sound.add('sfx_gunshot_laser_1')
        };
    }

    startPlaylist() {
        this.currentIndex = 0;
        this.playTrack(this.currentIndex);
    }

    playTrack(index) {
        if (this.currentTrack) {
            this.currentTrack.stop();
        }

        this.currentTrack = this.playlist[index];

        this.currentTrack.play();

        // When track ends → play next
        this.currentTrack.once('complete', () => {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
            this.playTrack(this.currentIndex);
        });
    }

    
    playSFX(key, volume=0.5, rate=1, detune=0) {
        this.scene.sound.play(key, {volume: volume, rate: rate, detune: detune});
    }

}
