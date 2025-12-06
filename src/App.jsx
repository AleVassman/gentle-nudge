// src/App.jsx
import { useState, useEffect, useRef } from 'react'

// The "Database" of tasks
const TASK_DATA = [
  // TIER 1: Survival (0-10%) - Passive Comfort
  { text: "Open Samsung Music. Play that one song that always helps.", tier: 1, type: "comfort" },
  { text: "Open TikTok. Find 3 funny videos.", tier: 1, type: "distraction" },
  { text: "Close your eyes. Just sleep.", tier: 1, type: "rest" },
  { text: "Unclench your jaw.", tier: 1, type: "physical" },
  
  // TIER 2: Low Power (11-30%) - Minimal Action
  { text: "Go to the window/outside and have a smoke.", tier: 2, type: "break" },
  { text: "Drink a glass of water.", tier: 2, type: "health" },
  { text: "Sit up in bed.", tier: 2, type: "physical" },
  { text: "Splash water on your face.", tier: 2, type: "hygiene" },

  // TIER 3: Rebooting (31-60%) - Small Wins
  { text: "Brush your teeth.", tier: 3, type: "hygiene" },
  { text: "Put the dirty dishes in the sink.", tier: 3, type: "tidying" },
  { text: "Change your shirt.", tier: 3, type: "hygiene" },

  // TIER 4: Online (61%+) - Productivity
  { text: "Take a shower.", tier: 4, type: "hygiene" },
  { text: "Make a simple meal.", tier: 4, type: "health" },
  { text: "Clean one corner of the room.", tier: 4, type: "tidying" }
];

function App() {
  const [energy, setEnergy] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  // Initialize wins from Local Storage (so it remembers you!)
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("gentle_wins");
    return saved ? parseInt(saved, 10) : 0;
  });

  // AUDIO ENGINE
  const [isPlaying, setIsPlaying] = useState(false);
  // This holds the audio file in memory
  const audioRef = useRef(new Audio('/rain.mp3')); 

  useEffect(() => {
    // This simple line makes the 15-second clip last for 10 hours
    audioRef.current.loop = true; 
  }, []);

  const toggleRain = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  // Whenever 'wins' changes, save it to Local Storage
  useEffect(() => {
    localStorage.setItem("gentle_wins", wins);
  }, [wins]);

  const tiers = [
    { level: 1, label: "Survival", desc: "I can barely exist." },
    { level: 2, label: "Low Power", desc: "I can sit up." },
    { level: 3, label: "Rebooting", desc: "I can move a bit." },
    { level: 4, label: "Online", desc: "Ready to do things." }
  ];

  const getTask = (level) => {
    const tierTasks = TASK_DATA.filter(t => t.tier === level);
    let pool = tierTasks;
    if (currentTask && tierTasks.length > 1) {
      pool = tierTasks.filter(t => t.text !== currentTask.text);
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentTask(pool[randomIndex]);
  };

  const handleSelect = (level) => {
    setEnergy(level);
    getTask(level);
  };

  // <--- NEW: Handle the "I Did It" click
  const handleComplete = () => {
    setWins(wins + 1); // Add 1 to score
    getTask(energy);   // Get next card
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      minHeight: '100vh', /* Full height */
      justifyContent: 'center'
    }}>
      
      {/* --- THE GLOBAL SCOREBOARD --- 
          This is now visible on EVERY screen. 
      */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '10px',
        opacity: 0.8 
      }}>
        <span style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold', 
          color: '#4CAF50',
          border: '1px solid #4CAF50',
          padding: '8px 20px',
          borderRadius: '20px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)' 
        }}>
          Wins Today: {wins}
        </span>
      </div>

      {/* --- SCREEN 1: THE DASHBOARD --- */}
      {energy === null ? (
        <>
          <h2 style={{ textAlign: 'center' }}>Where is your battery at?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {tiers.map((tier) => (
              <button 
                key={tier.level}
                onClick={() => handleSelect(tier.level)}
                style={{
                  padding: '20px',
                  fontSize: '1.2rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{tier.label}</strong>
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{tier.desc}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* --- SCREEN 2: THE CARD --- */
        <div style={{ 
            backgroundColor: '#1e1e1e', 
            padding: '30px', 
            borderRadius: '20px', 
            textAlign: 'center',
            border: '1px solid #333',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            position: 'relative'
        }}>
          
          {/* Back/Reset Button (Small, top right) */}
          <button 
             onClick={() => setEnergy(null)} 
             style={{ 
               position: 'absolute', top: '15px', right: '15px',
               background: 'transparent', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer'
             }}
          >
             ×
          </button>

          {/* The Task Text */}
          <h2 style={{ fontSize: '1.8rem', marginBottom: '40px', marginTop: '20px', lineHeight: '1.4' }}>
            {currentTask ? currentTask.text : "Loading..."}
          </h2>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            
            <button 
              onClick={() => getTask(energy)} 
              style={{
                padding: '15px 25px',
                borderRadius: '50px',
                border: 'none',
                backgroundColor: '#333',
                color: '#aaa',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>

            <button 
              onClick={handleComplete} 
              style={{
                padding: '15px 30px',
                borderRadius: '50px',
                border: 'none',
                backgroundColor: '#4CAF50', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              I Did It
            </button>

          </div>
        </div>
      )}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        backgroundColor: '#2a2a2a',
        padding: '10px 20px',
        borderRadius: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
        border: '1px solid #444',
        zIndex: 100
      }}>
        
        {/* RAIN BUTTON (Replaces Music) */}
        <div 
          onClick={toggleRain}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            color: isPlaying ? '#4CAF50' : '#fff', // Turns Green when playing
            transition: 'color 0.3s'
          }}
        >
          <div style={{ fontSize: '1.8rem' }}>
            {isPlaying ? '🌧️' : '☁️'}
          </div>
          <span style={{ fontSize: '0.8rem' }}>Rain</span>
        </div>

        {/* TIKTOK BUTTON */}
        <a 
          href="https://www.tiktok.com/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#fff',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ fontSize: '1.8rem' }}>📺</div>
          <span>TikTok</span>
        </a>

      </div>
    </div>
  )
}

export default App