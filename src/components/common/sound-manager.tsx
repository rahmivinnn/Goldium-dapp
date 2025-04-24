import React, { createContext, useContext, useState, useEffect } from 'react';

// Define sound types
type SoundType =
  | 'click'
  | 'hover'
  | 'success'
  | 'error'
  | 'battle'
  | 'win'
  | 'lose'
  | 'card'
  | 'egg'
  | 'buy'
  | 'sell'
  | 'notification'
  | 'levelup'
  | 'reward'
  | 'flip'
  | 'shuffle'
  | 'coin';

// Define sound files
const soundFiles: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  battle: '/sounds/battle.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  card: '/sounds/card.mp3',
  egg: '/sounds/egg.mp3',
  buy: '/sounds/buy.mp3',
  sell: '/sounds/sell.mp3',
  notification: '/sounds/notification.mp3',
  levelup: '/sounds/levelup.mp3',
  reward: '/sounds/reward.mp3',
  flip: '/sounds/flip.mp3',
  shuffle: '/sounds/shuffle.mp3',
  coin: '/sounds/coin.mp3',
};

// Create context
interface SoundContextType {
  playSound: (type: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Sound provider component
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioElements, setAudioElements] = useState<Record<SoundType, HTMLAudioElement | null>>({
    click: null,
    hover: null,
    success: null,
    error: null,
    battle: null,
    win: null,
    lose: null,
    card: null,
    egg: null,
    buy: null,
    sell: null,
    notification: null,
    levelup: null,
    reward: null,
    flip: null,
    shuffle: null,
    coin: null,
  });

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newAudioElements: Record<SoundType, HTMLAudioElement> = {} as Record<SoundType, HTMLAudioElement>;

      Object.entries(soundFiles).forEach(([type, file]) => {
        const audio = new Audio(file);
        audio.volume = volume;
        newAudioElements[type as SoundType] = audio;
      });

      setAudioElements(newAudioElements);

      // Load user preferences from localStorage
      const savedMute = localStorage.getItem('goldium-muted');
      const savedVolume = localStorage.getItem('goldium-volume');

      if (savedMute) {
        setIsMuted(savedMute === 'true');
      }

      if (savedVolume) {
        setVolume(parseFloat(savedVolume));
      }
    }
    // We only want this to run once on mount, volume is set within this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update audio volume when volume changes
  useEffect(() => {
    Object.values(audioElements).forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });

    // Save to localStorage
    localStorage.setItem('goldium-volume', volume.toString());
  }, [volume, audioElements]);

  // Update mute state in localStorage
  useEffect(() => {
    localStorage.setItem('goldium-muted', isMuted.toString());
  }, [isMuted]);

  // Play sound function
  const playSound = (type: SoundType) => {
    if (isMuted || !audioElements[type]) return;

    // Stop the sound if it's already playing
    audioElements[type]!.pause();
    audioElements[type]!.currentTime = 0;

    // Play the sound
    audioElements[type]!.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  // Toggle mute function
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook to use sound
export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

// Sound button component
export const SoundButton: React.FC = () => {
  const { isMuted, toggleMute, playSound } = useSound();

  return (
    <button
      className="btn btn-circle btn-ghost transition-all duration-300 hover:bg-base-200 active:scale-95"
      onClick={() => {
        toggleMute();
        if (!isMuted) {
          playSound('click');
        }
      }}
      onMouseEnter={() => !isMuted && playSound('hover')}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      <div className="relative">
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 transform hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
      </div>
    </button>
  );
};

// Volume control component
export const VolumeControl: React.FC = () => {
  const { volume, setVolume, playSound, isMuted } = useSound();

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      );
    } else if (volume < 0.4) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    } else if (volume < 0.7) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      );
    }
  };

  return (
    <div className="flex items-center gap-2 bg-base-200 p-2 rounded-lg shadow-inner">
      <button
        className="btn btn-xs btn-circle btn-ghost"
        onClick={() => {
          if (!isMuted) {
            playSound('click');
            setVolume(0);
          }
        }}
        title="Mute"
      >
        {getVolumeIcon()}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => {
          const newVolume = parseFloat(e.target.value);
          setVolume(newVolume);
          if (!isMuted && newVolume > 0) {
            playSound('hover');
          }
        }}
        className="range range-xs range-primary"
        title={`Volume: ${Math.round(volume * 100)}%`}
      />

      <div className="badge badge-sm">{Math.round(volume * 100)}%</div>
    </div>
  );
};
