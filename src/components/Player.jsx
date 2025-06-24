import { useEffect, useState } from 'react';
import { MoreHorizontal, SkipForward, VolumeOff } from 'lucide-react';
import { SkipBack, Volume2, Pause, Play } from 'lucide-react';
import { formatTime } from '../utils/helper';
import { API_URL } from '../API';

const Player = ({ song, audioRef, onNext, onPrev }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (song && audioRef?.current) {
            const audio = audioRef?.current;
            audio.src = song.url;

            const tryPlay = async () => {
                try {
                    await audio.play();
                    setIsPlaying(true);
                } catch (err) {
                    setIsPlaying(false);
                }
            };

            tryPlay();
        }
    }, [song]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
        };

        if (audio) {
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, []);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.warn('Playback failed:', err.name);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleBarClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const percent = duration ? (progress / duration) * 100 : 0;

    return (
        <div className="h-full flex flex-col justify-center items-center text-white
            lg:mt-0 md:mt-0 sm:mt-0"
        >
            {song ? (
                <div className='lg:w-82 md:w-72 sm:w-82 w-72 lg:ml-5 md:ml-5 ml-0'>
                    <h2 className="text-3xl font-semibold">{song?.name}</h2>
                    <p className="text-gray-300 mb-4">{song?.artist}</p>

                    <img data-aos="zoom-in" src={`${API_URL}/assets/${song?.cover}`} alt={song?.name}
                        className="lg:w-82 lg:h-82 md:w-72 md:h-72 sm:h-82 rounded-lg 
                        object-cover shadow-lg mb-3 sm:w-82 w-72 h-72"
                    />

                    <div className="lg:w-82 md:w-72 sm:w-82 w-72 flex flex-col items-center gap-2">
                        <div onClick={handleBarClick} className="w-full h-1.5 bg-white/20 
                            rounded-full overflow-hidden cursor-pointer"
                        >
                            <div className="h-full bg-white transition-all duration-300"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between w-full 
                            text-xs text-gray-400 px-1"
                        >
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>


                        <div className="flex items-center justify-center gap-8 text-white mt-2">
                            <button className="p-2 bg-white/10 rounded-full">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            <button onClick={onPrev} className="hover:scale-110 transition">
                                <SkipBack className="w-6 h-6" />
                            </button>

                            <button onClick={togglePlay} className="bg-white text-black 
                                rounded-full p-3 hover:scale-110 transition"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4" fill="#000" />
                                ) : (
                                    <Play className="w-4 h-4" fill="#000" />
                                )}
                            </button>

                            <button onClick={onNext} className="hover:scale-110 transition">
                                <SkipForward className="w-6 h-6" />
                            </button>

                            <button onClick={toggleMute} className="p-2 bg-white/10 rounded-full
                                hover:scale-110 transition"
                            >
                                {isMuted ? (
                                    <VolumeOff className="w-5 h-5 text-white/50" />
                                ) : (
                                    <Volume2 className="w-5 h-5 text-white" />
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[100px]">
                    <div className="w-10 h-10 border-2 border-white border-t-transparent 
                        rounded-full animate-spin"
                    />
                </div>
            )}

            <audio ref={audioRef} />
        </div>
    );
}

export default Player;