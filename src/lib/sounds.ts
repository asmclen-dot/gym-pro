"use client";

// A simple sound utility for playing audio in the browser.

// We keep a cache of Audio objects to avoid creating them repeatedly.
const audioCache: { [key: string]: HTMLAudioElement } = {};

const getAudio = (src: string): HTMLAudioElement => {
    if (audioCache[src]) {
        return audioCache[src];
    }
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioCache[src] = audio;
    return audio;
};

// A map of sound types to their audio file URLs.
// These are short, royalty-free sounds from Pixabay.
const soundMap = {
    click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2491f84561.mp3', // Simple soft click
    complete: 'https://cdn.pixabay.com/audio/2022/11/17/audio_88f14f6c37.mp3', // A 'pop' sound for completion
    success: 'https://cdn.pixabay.com/audio/2022/08/23/audio_86fba9c47f.mp3', // A more triumphant success sound
};

type SoundType = keyof typeof soundMap;

/**
 * Plays a sound from the sound map.
 * @param type The type of sound to play ('click', 'complete', 'success').
 */
export const playSound = (type: SoundType) => {
    try {
        const audioSrc = soundMap[type];
        if (!audioSrc) {
            console.warn(`Sound type "${type}" not found.`);
            return;
        }

        const audio = getAudio(audioSrc);
        
        // If the audio is already playing, we stop it and restart from the beginning.
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }

        audio.play().catch(error => {
            // Autoplay can be blocked by the browser, so we log the error
            // instead of throwing it to avoid crashing the app.
            console.error(`Could not play sound: ${error.message}`);
        });

    } catch (error) {
        console.error('An error occurred while trying to play sound:', error);
    }
};
