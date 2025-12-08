import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// THE DEFAULT TASKS (Backup list)
const DEFAULT_TASKS = [
  { text: "Open Samsung Music. Play that one song that always helps.", tier: 1, type: "comfort" },
  { text: "Open TikTok. Find 3 funny videos.", tier: 1, type: "distraction" },
  { text: "Close your eyes. Just sleep.", tier: 1, type: "rest" },
  { text: "Unclench your jaw.", tier: 1, type: "physical" },
  { text: "Go to the window/outside and have a smoke.", tier: 2, type: "break" },
  { text: "Drink a glass of water.", tier: 2, type: "health" },
  { text: "Sit up in bed.", tier: 2, type: "physical" },
  { text: "Splash water on your face.", tier: 2, type: "hygiene" },
  { text: "Brush your teeth.", tier: 3, type: "hygiene" },
  { text: "Put the dirty dishes in the sink.", tier: 3, type: "tidying" },
  { text: "Change your shirt.", tier: 3, type: "hygiene" },
  { text: "Take a shower.", tier: 4, type: "hygiene" },
  { text: "Make a simple meal.", tier: 4, type: "health" },
  { text: "Clean one corner of the room.", tier: 4, type: "tidying" }
];
function App() {
  // --- STATE MANAGEMENT ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [allTasks, setAllTasks] = useState(() => {
    const saved = localStorage.getItem("gentle_tasks");
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  useEffect(() => {
    localStorage.setItem("gentle_tasks", JSON.stringify(allTasks));
  }, [allTasks]);

  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("gentle_wins");
    return saved ? parseInt(saved, 10) : 0;
  });
  
  useEffect(() => {
    localStorage.setItem("gentle_wins", wins);
  }, [wins]);

  const [energy, setEnergy] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);

  const tiers = [
    { level: 1, label: "Survival", desc: "I can barely exist." },
    { level: 2, label: "Low Power", desc: "I can sit up." },
    { level: 3, label: "Rebooting", desc: "I can move a bit." },
    { level: 4, label: "Online", desc: "Ready to do things." }
  ];

  // --- SEAMLESS AUDIO ENGINE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);

  const toggleRain = async () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
    } else {
      if (ctx.state === 'suspended') await ctx.resume();
      try {
        const response = await fetch('/rain.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(ctx.destination);
        source.start();
        sourceNodeRef.current = source;
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  // --- HELPER FUNCTIONS ---
  const getTask = (level) => {
    const tierTasks = allTasks.filter(t => t.tier === level);
    let pool = tierTasks;
    if (currentTask && tierTasks.length > 1) {
      pool = tierTasks.filter(t => t.text !== currentTask.text);
    }
    if (pool.length === 0) {
      setCurrentTask({ text: "No tasks found. Add some in settings!", tier: level });
      return;
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentTask(pool[randomIndex]);
  };

  const handleSelect = (level) => {
    setEnergy(level);
    getTask(level);
  };

  const handleComplete = () => {
    setWins(wins + 1);
    getTask(energy);
  };
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', gap: '20px', 
      maxWidth: '400px', margin: '0 auto', minHeight: '100vh', justifyContent: 'center',
      paddingBottom: '80px', fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
        <span style={{ 
          fontSize: '1rem', fontWeight: 'bold', color: '#4CAF50',
          border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '20px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)'
        }}>
          Wins: {wins}
        </span>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          {isSettingsOpen ? '✖️' : '⚙️'}
        </motion.button>
      </div>

      {/* VIEW SWITCHER */}
      {isSettingsOpen ? (
        
        /* --- SETTINGS VIEW --- */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: 'rgba(30,30,30,0.9)', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}
        >
          <h2>Task Editor</h2>
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Customize your deck here.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            {allTasks.map((task, index) => (
              <div key={index} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#333', padding: '10px', borderRadius: '8px', fontSize: '0.9rem'
              }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                  <span style={{ color: '#888', fontSize: '0.7rem', display: 'block' }}>TIER {task.tier}</span>
                  {task.text}
                </div>
                <button 
                  onClick={() => {
                    const newTasks = allTasks.filter((_, i) => i !== index);
                    setAllTasks(newTasks);
                  }}
                  style={{ background: '#552222', color: '#ffaaaa', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
                >
                  Del
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '20px' }}>
             <h3>Add New</h3>
             <form onSubmit={(e) => {
               e.preventDefault();
               const text = e.target.elements.taskText.value;
               const tier = parseInt(e.target.elements.tierSelect.value);
               if(!text) return;
               setAllTasks([...allTasks, { text, tier, type: 'custom' }]);
               e.target.reset();
             }}>
               <input name="taskText" placeholder="e.g. Pet the cat" style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white' }} />
               <div style={{ display: 'flex', gap: '10px' }}>
                 <select name="tierSelect" style={{ padding: '10px', borderRadius: '5px', flex: 1, backgroundColor: '#333', color: 'white', border: 'none' }}>
                   <option value="1">Tier 1 (Survival)</option>
                   <option value="2">Tier 2 (Low Power)</option>
                   <option value="3">Tier 3 (Reboot)</option>
                   <option value="4">Tier 4 (Online)</option>
                 </select>
                 <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none' }}>Add</button>
               </div>
             </form>
          </div>
        </motion.div>
      ) : (
        /* --- MAIN APP VIEW --- */
        <>
          {energy === null ? (
            /* SCENE 1: Energy Dashboard (Animated Buttons) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               <h2 style={{ textAlign: 'center' }}>Where is your battery at?</h2>
               {tiers.map((tier) => (
                 <motion.button 
                   key={tier.level}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleSelect(tier.level)}
                   style={{
                     padding: '20px', fontSize: '1.2rem', borderRadius: '16px',
                     border: '1px solid rgba(255,255,255,0.05)', 
                     backgroundColor: 'rgba(255,255,255,0.05)',
                     backdropFilter: 'blur(5px)',
                     color: 'white', textAlign: 'left',
                     cursor: 'pointer', marginBottom: '10px', width: '100%'
                   }}
                 >
                   <strong>{tier.label}</strong><br/>
                   <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{tier.desc}</span>
                 </motion.button>
               ))}
            </div>
          ) : (
            /* SCENE 2: The Action Card (Floating Animation) */
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.8)', 
                  backdropFilter: 'blur(15px)',
                  padding: '30px', borderRadius: '25px', textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)', position: 'relative'
              }}
            >
              <button 
                onClick={() => setEnergy(null)} 
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ×
              </button>
              
              {/* ANIMATED TEXT SWITCHER */}
              <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatePresence mode='wait'>
                  <motion.h2 
                    key={currentTask ? currentTask.text : "loading"} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '1.8rem', lineHeight: '1.4', margin: 0 }}
                  >
                    {currentTask ? currentTask.text : "Loading..."}
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => getTask(energy)} 
                  style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', backgroundColor: '#333', color: '#aaa', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Skip
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={handleComplete} 
                  style={{ 
                    padding: '15px 30px', borderRadius: '50px', border: 'none', 
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', 
                    color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)'
                  }}
                >
                  I Did It
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}
      {/* --- COMFORT DOCK --- */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '20px', backgroundColor: '#2a2a2a', padding: '10px 20px',
        borderRadius: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', border: '1px solid #444', zIndex: 100
      }}>
        <div 
           onClick={toggleRain} 
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isPlaying ? '#4CAF50' : '#fff', transition: 'color 0.3s' }}
        >
           <div style={{ fontSize: '1.8rem' }}>{isPlaying ? '⏸️' : '▶️'}</div>
           <span style={{ fontSize: '0.8rem' }}>Rain</span>
        </div>

        <a 
           href="https://www.tiktok.com/" 
           target="_blank" 
           rel="noreferrer"
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#fff' }}
        >
           <div style={{ fontSize: '1.8rem' }}>📺</div>
           <span style={{ fontSize: '0.8rem' }}>TikTok</span>
        </a>
      </div>

    </div>
  )
}

export default App