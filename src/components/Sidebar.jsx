import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_URL } from '../API';

const Sidebar = ({ songs, setSearch, activeSong, setActiveSong }) => {
    const [activeTab, setActiveTab] = useState('for-you');
    const [durations, setDurations] = useState({});
    const filteredSongs = activeTab === 'top-tracks' ? songs?.filter((song) => song?.top_track) : songs;

    useEffect(() => {
        filteredSongs?.forEach((song) => {
            if (!durations[song.id]) {
                const audio = new Audio(song?.url);
                audio.addEventListener('loadedmetadata', () => {
                    const mins = Math.floor(audio.duration / 60);
                    const secs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
                    const formatted = `${mins}:${secs}`;
                    setDurations((prev) => ({ ...prev, [song.id]: formatted }));
                });
            }
        });
    }, [filteredSongs]);

    return (
        <div className="w-full h-full backdrop-blur-md text-white
            overflow-y-auto bg-gradient-to-b"
        >
            <div className="grid grid-cols-12 items-center gap-4" data-aos="zoom-in">
                <div className="col-span-12 md:col-span-3 lg:col-span-4 hidden md:flex 
                    lg:flex items-center"
                >
                    <img className="lg:h-8 md:h-6 h-8 w-auto"
                        src={`/assets/logo.png`} alt="logo"
                    />
                </div>

                <div className="col-span-12 md:col-span-9 lg:col-span-8 flex lg:gap-6 gap-4">
                    <h1 onClick={() => setActiveTab('for-you')} className={`lg:text-xl md:text-lg
                        text-xl cursor-pointer ${activeTab === 'for-you' ?
                            'text-white' : 'text-gray-400'
                        }`
                    }>
                        For You
                    </h1>

                    <h1 onClick={() => setActiveTab('top-tracks')} className={`lg:text-xl md:text-lg
                        text-xl cursor-pointer ${activeTab === 'top-tracks' ?
                            'text-white' : 'text-gray-400'
                        }`
                    }>
                        Top Tracks
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4 pt-3">
                <div className="col-span-12 md:col-span-3 lg:col-span-4 hidden md:flex lg:flex 
                    h-full items-end"
                >
                    <img className="h-8 w-auto absolute bottom-6"
                        src={`/assets/profile.png`} alt="logo"
                    />
                </div>

                <div className="col-span-12 md:col-span-9 lg:col-span-8 flex gap-6 w-full">
                    <div className="space-y-2 w-full" data-aos="slide-right">
                        <div className="w-full mb-4">
                            <div className="relative w-full">
                                <input type="text" placeholder="Search Song, Artist"
                                    onChange={(e) => setSearch(e.target.value)} className="w-full 
                                    py-2.5 px-3.5 rounded-md text-white bg-[#FFFFFF14]
                                    placeholder:text-white/50  focus:outline-none focus:ring-0 
                                    focus:border-transparent"

                                />

                                <Search className="absolute right-3 top-1/2 w-5 h-5 text-white/60 
                                    transform -translate-y-1/2 pointer-events-none"
                                />
                            </div>
                        </div>

                        {filteredSongs?.map((song, index) => (
                            <div key={index} onClick={() => setActiveSong(song)} className={`flex 
                                px-3 py-2 justify-between items-center rounded-lg cursor-pointer
                                transition-colors duration-200 ${activeSong?.id === song?.id ?
                                    'bg-[#FFFFFF14]' : 'hover:bg-[#FFFFFF14]'}`
                            }>
                                <div className="flex items-center gap-4">
                                    <img src={`${API_URL}/assets/${song?.cover}`}
                                        alt={song.name} className="w-10 h-10 rounded-full object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold text-sm">{song?.name}</p>
                                        <p className="text-xs text-gray-400">{song?.artist}</p>
                                    </div>
                                </div>

                                <span className="text-sm text-gray-400">
                                    {durations[song?.id] || '--:--'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;