import React from 'react'
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

function Home() {
  const navigator = useNavigate();
  const { user } = useStore();

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-purple-950 to-slate-950 min-h-screen flex-col items-center text-white p-6 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl w-full flex flex-col items-center relative z-10 py-12">
        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-wide mb-8 animate-pulse">
          <span>✨ Discover Real-time Feedback</span>
        </div>

        {/* Eye-catching premium typography header */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center leading-tight tracking-tight">
          Modern Real-Time <br className="hidden md:inline" />
          Polling Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Everyone</span>
        </h1>

        <p className="text-lg md:text-xl text-center text-gray-300 max-w-3xl mb-12 leading-relaxed">
          Create, vote, bookmark and visualize poll trends instantly. Engage your audience or classmates effortlessly with ultra-smooth real-time charts and live socket connectivity.
        </p>

        {/* Call to Actions with beautiful micro-interactions */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {user ? (
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={() => navigator("/dashboard")}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => navigator("/register")}
              >
                Get Started Free
              </button>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 bg-gray-800/40 hover:bg-gray-800/80 transition-all duration-300"
                onClick={() => navigator("/login")}
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1 */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:border-purple-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Create Custom Polls</h2>
            <p className="text-gray-400 leading-relaxed">
              Design customized polls on any topic with flexible choices, custom limits, and security protocols, and share with your networks instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:border-purple-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Live Visual Charts</h2>
            <p className="text-gray-400 leading-relaxed">
              Cast your votes and witness live animation transitions on Chart.js bar graphs showing real-time distribution immediately as votes roll in.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:border-purple-500/40 group">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-white">Save Bookmarks</h2>
            <p className="text-gray-400 leading-relaxed">
              Bookmark crucial polls to easily follow ongoing changes, analyze complete statistical histories, and organize your feed efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
