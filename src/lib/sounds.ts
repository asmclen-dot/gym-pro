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

// Using Base64 encoded Data URIs to ensure sounds are always available.
const soundMap = {
    click: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAAABkYXRhAAAAAA==',
    complete: 'data:audio/wav;base64,UklGRlpoAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAAABkYXRhVFlgAAAv/T/V/vf+2f6D/sf+c/6a/pv+w/7Y/uX/Bf9S/5P/cv9m/2b/ef91/3L/e/9p/1b/TP8V/zb/P/9y/4P/rP/X/4z/zv/j/8z/wv+6/6v/rv+0/7j/tv+z/7H/sP+w/7D/sv+3/7n/wP/G/9L/3P/g/+H/4//j/+X/5f/o/+n/6v/r/+z/7f/u/+7/7v/u/+3/7f/s/+v/6v/q/+r/6f/p/+n/6f/q/+r/7P/t/+7/8P/z//f/AgAVAC4AIQAnACwAKwArACgAJwAmACYAJwAnACgAKQAqACoAKwAsAC0ALgAvADAAMgA0ADcAOAA6ADwAPwBCAD8APQA+AD4APwA+AD8APwA+AD8APwA8ADoAOAAtACEAGwAZABkAGQAZABcAFgAUABIAEQAQAA8ADgANAA0ADQANAA0ADQAMAAwACwALAAoACQAIABEADgASABMAFwAWAAMAFgAJABUADwAMABEACwATAAgAEwAKABMACQATAAkAFQAHABMACQATAAUAFQAJABQABgAUAAgADwAGAAoACgAGAAQACAAHAAQABwAFAAIABQADAAAAAgACAAAAAgAEAAIAAgACAAIAAAADAAAAAwAAAAEAAAACAAAAAQAAAAAAAAABAAAAAQAAAAAAAQAAAAAAAAABAAAAAAAAAAEAAAABAAAAAAAAAAAAAAEAAAABAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAAAAAEAAAAAAAAAAQAAAAAAAQAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAQAAAAAAAQAAAAAAAQAAAAEAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAQAAAAAAAQAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAAAAAABAAEAAQAAAAAAAgABAAIAAAACAAIAAgACAAQABAAEAAQABAAFAAYABgAGAAUABQAFAAUABgAFAAYABgAFAAYABwAGAAcABgAHAAcABgAHAAYABwAFAAYABQAFAAYABQAGAAQABAAEAAMAAwACAAIAAgAAAAEAAAAAAAAAAAAA',
    success: 'data:audio/wav;base64,UklGRtBlAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAAABkYXRhg1lAABH/Q/9z/1L/ev9D/2z/Y/8X/0X/Zv9v/0b/PP8M/x7/FP8V/yz/GP8g/zP/IP81/yL/IP8x/zD/GP8y/zP/D/8s/zz/L/88/zD/Av89/0X/F/9T/2X/S/9T/3P/e/9j/5L/uv+q/9D/mv+2/8L/sP/Q/5z/wv+k/9f/pP/O/7L/uP/G/9L/2f/e/+L/5//u//D/8v/3//z/AwARACQALgAvADMAOAA7AD4AQgBEAEYARgBGAEYARwBIAEgASQBIAEgASABIAEgARwBGAEQAQgA/ADsAOAAvACEAGwAYABUADwALAAcABQADAAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQACAAQABgAIAAkACwAMAA0ADgAQABEAEgATABMAFAAUABQAEwATABIAEgARABAADwAOAA0ADAALAAkACAAHAAUAAwACAAEAAAAAAAAAAAAAAAIAAwAFAAcACAAKAAoACgAJAAgABwAFAAMAAgABAAAAAAAAAAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIA'
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
