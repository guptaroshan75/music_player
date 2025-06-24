import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import { Menu, X } from 'lucide-react';
import './App.css';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { API_URL } from './API';

const App = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [search, setSearch] = useState('');
    const [songs, setSongs] = useState([]);
    const [activeSong, setActiveSong] = useState(null);
    const [activeTab, setActiveTab] = useState('for-you');
    const audioRef = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 1500,
            easing: 'ease-in-out',
            once: true, mirror: false
        });
    }, []);

    const fetchSongs = async () => {
        try {
            const res = await axios.get(`${API_URL}/items/songs`);
            setSongs(res?.data?.data);
            setActiveSong(res?.data?.data[1]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSongs()
    }, []);

    const filteredSongs = songs?.filter(song =>
        song.name.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase())
    ).filter(song => activeTab === 'top-tracks' ? song.top_track : true);

    const onNext = () => {
        const currentIndex = songs.findIndex(song => song?.id === activeSong.id);
        const next = (currentIndex + 1) % songs.length;
        setActiveSong(songs[next]);
    };

    const onPrev = () => {
        const currentIndex = songs.findIndex(song => song?.id === activeSong.id);
        const prev = (currentIndex - 1 + songs.length) % songs.length;
        setActiveSong(songs[prev]);
    };

    return (
        <div className="relative grid grid-cols-12 min-h-screen text-white overflow-x-hidden
            lg:px-6 md:px-6 sm:px-6 px-4 pt-5"
        >
            <div className="fixed inset-0 -z-10 transition-all duration-700 ease-in-out" style={{
                background: `linear-gradient(108.18deg, ${activeSong?.accent || 'rgba(51,66,94,0.6)'}
                2.46%, rgba(0, 0, 0, 0.6) 99.84%)`
            }} />

            {!showSidebar && (
                <button onClick={() => setShowSidebar(true)} className="absolute top-4 left-4
                    md:hidden z-50 p-2 bg-white/10 rounded-md"
                >
                    <Menu className="text-white w-6 h-6" />
                </button>
            )}

            {showSidebar && (
                <div className="fixed top-0 left-0 md:w-2/4 sm:w-2/3 w-3/4 h-full bg-black 
                    z-50 flex flex-col md:hidden"
                >
                    <div className="p-4 flex items-center justify-between border-b 
                        border-r border-white/10 bg-black" style={{
                            background: `linear-gradient(108.18deg, ${activeSong?.accent ||
                                'rgba(51,66,94,0.6)'} 2.46%, rgba(0, 0, 0, 0.6) 99.84%)`
                        }}
                    >
                        <img className="h-8 w-auto" src="/assets/logo.png" alt="logo" />

                        <div className="flex items-center gap-4">
                            <img className="h-9 w-9" src="/assets/profile.png" alt="avatar" />

                            <button onClick={() => setShowSidebar(false)} className="md:hidden 
                                z-50 p-2 bg-white/10 rounded-md"
                            >
                                <X className="text-white w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 border-white/10 border-r"
                        style={{
                            background: `linear-gradient(108.18deg, ${activeSong?.accent ||
                                'rgba(51,66,94,0.6)'} 2.46%, rgba(0, 0, 0, 0.6) 99.84%)`
                        }}
                    >
                        <Sidebar songs={filteredSongs} setSearch={setSearch}
                            activeSong={activeSong} setActiveSong={setActiveSong}
                        />
                    </div>
                </div>
            )}

            <div className="hidden md:block md:col-span-7 lg:col-span-7">
                <Sidebar songs={filteredSongs} setSearch={setSearch}
                    activeSong={activeSong} setActiveSong={setActiveSong}
                />
            </div>

            <div data-aos="slide-left" className="col-span-12 md:col-span-5 lg:col-span-5">
                <Player song={activeSong} audioRef={audioRef}
                    onNext={onNext} onPrev={onPrev}
                />
            </div>
        </div>
    );
}

export default App