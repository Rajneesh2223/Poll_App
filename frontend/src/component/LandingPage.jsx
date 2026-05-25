import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRoleSelect = (role) => {
    sessionStorage.setItem("userRole", role);
    navigate(`/${role}`);
  };

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Polling",
      desc: "Launch polls and see responses stream in live — zero delay, maximum engagement.",
    },
    {
      icon: "📊",
      title: "Live Analytics",
      desc: "Beautiful animated charts update as students vote. Every insight, instantly.",
    },
    {
      icon: "💬",
      title: "Live Chat",
      desc: "In-session chat keeps discussions flowing between teacher and students.",
    },
    {
      icon: "🔐",
      title: "Session Persistence",
      desc: "Students rejoin seamlessly after disconnect — no re-registration needed.",
    },
    {
      icon: "📜",
      title: "Poll History",
      desc: "Comprehensive history of all polls with response data and correct answers.",
    },
    {
      icon: "🌐",
      title: "Works Anywhere",
      desc: "Cloud-hosted on Render & Vercel. Join from any device, any browser.",
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #0A0E1A 0%, #0E0A2E 40%, #1A0533 100%)",
        fontFamily: "'Inter', 'Sora', sans-serif",
      }}
    >
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-transform duration-700"
          style={{
            background: "radial-gradient(circle, #7B2FF7, transparent)",
            left: mousePos.x * 0.02 + "px",
            top: mousePos.y * 0.02 + "px",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #4F8EF7, transparent)",
            right: "10%",
            bottom: "20%",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-5 blur-2xl"
          style={{
            background: "radial-gradient(circle, #FF6B6B, transparent)",
            left: "60%",
            top: "10%",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #7B2FF7, #4F8EF7)" }}
          >
            P
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Poll<span style={{ color: "#A78BFA" }}>Sync</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-400 hover:text-white transition text-sm">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition text-sm">
            How It Works
          </a>
          <button
            onClick={() => handleRoleSelect("teacher")}
            className="text-sm px-4 py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-200"
          >
            Teacher Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 pt-16 pb-24"
      >
        {/* Badge */}
        <div
          className={`mb-6 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-medium transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            borderColor: "rgba(167, 139, 250, 0.4)",
            background: "rgba(123, 47, 247, 0.1)",
            color: "#A78BFA",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span>Real-Time Classroom Engagement Platform</span>
        </div>

        {/* Headline */}
        <h1
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-5xl transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Engage. Poll. Learn —{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #A78BFA, #60A5FA, #A78BFA)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-shift 3s ease infinite",
            }}
          >
            In Real Time
          </span>
        </h1>

        <p
          className={`mt-6 text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          PollSync transforms classroom interaction with instant live polls,
          real-time results, and seamless student-teacher engagement — all
          powered by WebSockets.
        </p>

        {/* CTA Cards */}
        <div
          className={`mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Student Card */}
          <button
            id="join-as-student"
            onClick={() => handleRoleSelect("student")}
            className="group relative p-px rounded-2xl overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 transition-transform duration-200"
            style={{
              background: "linear-gradient(135deg, #4F8EF7, #2563EB, #7B2FF7)",
            }}
          >
            <div
              className="relative rounded-2xl p-6 h-full"
              style={{ background: "rgba(15, 20, 40, 0.85)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "rgba(79, 142, 247, 0.15)" }}
              >
                🎓
              </div>
              <h2 className="text-white text-xl font-bold mb-2">I'm a Student</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Join live polls, submit answers in real-time, and see how you
                compare with classmates — all in seconds.
              </p>
              <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">
                Join Session
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Teacher Card */}
          <button
            id="join-as-teacher"
            onClick={() => handleRoleSelect("teacher")}
            className="group relative p-px rounded-2xl overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-105 transition-transform duration-200"
            style={{
              background: "linear-gradient(135deg, #7B2FF7, #9333EA, #4F8EF7)",
            }}
          >
            <div
              className="relative rounded-2xl p-6 h-full"
              style={{ background: "rgba(15, 20, 40, 0.85)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "rgba(123, 47, 247, 0.15)" }}
              >
                👩‍🏫
              </div>
              <h2 className="text-white text-xl font-bold mb-2">I'm a Teacher</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Create polls, manage students, monitor live results, and
                review complete poll history — all from your dashboard.
              </p>
              <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
                Go to Dashboard
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { val: "< 100ms", label: "Response Time" },
            { val: "∞", label: "Students / Session" },
            { val: "100%", label: "Real-Time" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #A78BFA, #60A5FA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.val}
              </div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How It Works
            </h2>
            <p className="mt-3 text-gray-400">
              From zero to live poll in under 30 seconds.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Choose Your Role",
                desc: "Select Student or Teacher and enter your name to register instantly.",
                color: "#4F8EF7",
              },
              {
                step: "02",
                title: "Teacher Creates Poll",
                desc: "Write a question, add options, set a timer, and broadcast to all students.",
                color: "#7B2FF7",
              },
              {
                step: "03",
                title: "Live Results",
                desc: "Watch votes animate in real-time. Results saved automatically to history.",
                color: "#A78BFA",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl p-6 border"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-4xl font-black mb-4"
                  style={{ color: item.color, opacity: 0.6 }}
                >
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="mt-3 text-gray-400">
              Packed with features to make your sessions unforgettable.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border hover:border-purple-500 transition-colors duration-300 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(123,47,247,0.2), rgba(79,142,247,0.2))",
            border: "1px solid rgba(167,139,250,0.2)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to PollSync?
          </h2>
          <p className="text-gray-400 mb-8">
            No sign-up needed. Just pick your role and start right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="cta-student"
              onClick={() => handleRoleSelect("student")}
              className="px-8 py-4 rounded-2xl text-white font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
              style={{ background: "linear-gradient(135deg, #4F8EF7, #2563EB)" }}
            >
              Join as Student
            </button>
            <button
              id="cta-teacher"
              onClick={() => handleRoleSelect("teacher")}
              className="px-8 py-4 rounded-2xl text-white font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7B2FF7, #9333EA)" }}
            >
              Join as Teacher
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t px-6 md:px-12 py-8 text-center" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
            style={{ background: "linear-gradient(135deg, #7B2FF7, #4F8EF7)" }}
          >
            P
          </div>
          <span className="text-white font-bold">
            Poll<span style={{ color: "#A78BFA" }}>Sync</span>
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Real-time polling for modern classrooms. Built with Socket.IO + React.
        </p>
      </footer>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
