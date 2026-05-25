import React from 'react'
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

function Home() {
  const navigator = useNavigate();
  const { user } = useStore();

  return (
    <div className="flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen flex-col items-center text-white p-6 relative overflow-hidden">
      {/* Blue Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-float-delayed"></div>

      <div className="max-w-6xl w-full flex flex-col items-center relative z-10 py-16">
        {/* Eye-catching premium typography header */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center leading-tight tracking-tight text-white">
          Modern Real-Time <br className="hidden md:inline" />
          Polling Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300">Everyone</span>
        </h1>

        <p className="text-lg md:text-xl text-center text-gray-300 max-w-3xl mb-12 leading-relaxed">
          Create, vote, bookmark, and visualize poll trends instantly. Engage your audience or classmates effortlessly with ultra-smooth real-time charts and live Socket.io connectivity.
        </p>

        {/* Call to Actions with beautiful micro-interactions */}
        <div className="flex flex-wrap justify-center gap-4 mb-24">
          {user ? (
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg glass-btn-primary shadow-lg shadow-blue-500/20"
              onClick={() => navigator("/dashboard")}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg glass-btn-primary shadow-lg shadow-blue-500/20"
                onClick={() => navigator("/register")}
              >
                Get Started Free
              </button>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg glass-btn-secondary"
                onClick={() => navigator("/login")}
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Dynamic Heading for Features */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Packed with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Powerful Features</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to gather instant audience opinions, analyze stats, and share beautiful live charts.</p>
        </div>

        {/* Feature Cards Grid (Showing ALL platform features at a glance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {/* Card 1: WebSocket Live Sync */}
          <div className="glass-panel p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-blue-400/40 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">WebSocket Live Sync</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No manual refreshing required. Votes are captured via secure WebSockets and pushed instantly to all viewing clients for live updates.
            </p>
          </div>

          {/* Card 2: Interactive Chart.js Graphs */}
          <div className="glass-panel p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-blue-400/40 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Dynamic Animated Charts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Beautiful animated bar charts render vote distributions in real-time, built with responsive layouts and smooth transition animations.
            </p>
          </div>

          {/* Card 3: Dynamic Forms */}
          <div className="glass-panel p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-blue-400/40 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Quick Poll Customizer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Add questions, dynamic input options, full descriptive bios, and manage choices seamlessly with rapid item add/delete configurations.
            </p>
          </div>

          {/* Card 4: Bookmark Organizer */}
          <div className="glass-panel p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-blue-400/40 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Bookmark Organizer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Easily save trending or crucial polls to your private account list to follow ongoing statistical distribution changes efficiently.
            </p>
          </div>

          {/* Card 5: Smart Security */}
          <div className="glass-panel p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-blue-400/40 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Double-Vote Prevention</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform-level security features prevent double-voting. Active user selection tracking highlights and saves your choices reliably.
            </p>
          </div>

          {/* Card 6: Feed Discovery */}
          <div className="glass-panel p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-blue-400/40 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Paginated Discovery</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore public polls through a clean grid with full page pagination support, ensuring super-fast loading and light bandwidth consumption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
