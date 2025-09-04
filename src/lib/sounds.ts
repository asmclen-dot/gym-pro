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
// Using more reliable sources for the audio files.
const soundMap = {
    click: 'https://cdn.freesound.org/previews/476/476148_6424652-lq.mp3', // Simple soft click
    complete: 'https://cdn.freesound.org/previews/264/264835_4486188-lq.mp3', // A 'pop' sound for completion
    success: 'https://cdn.freesound.org/previews/391/391539_5121236-lq.mp3', // A more triumphant success sound
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
