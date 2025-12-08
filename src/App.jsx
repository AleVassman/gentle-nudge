import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// IMPORT THE NEW ICONS
import { Settings, X, Flame, Play, Pause, CloudRain, Tv, Trash2, Plus, Battery, Check, Trophy } from 'lucide-react'

// THE DEFAULT TASKS
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
  const [isVoidOpen, setIsVoidOpen] = useState(false);

  const openSettings = () => { setIsVoidOpen(false); setIsSettingsOpen(!isSettingsOpen); };
  const openVoid = () => { setIsSettingsOpen(false); setIsVoidOpen(!isVoidOpen); };

  // VOID LOGIC
  const [voidText, setVoidText] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = () => {
    if (!voidText) return;
    setIsBurning(true);
    setTimeout(() => {
      setVoidText("");
      setIsBurning(false);
    }, 1000);
  };

  // DATA
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

  // AUDIO ENGINE
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
      
      /* FIXES: Force width to fill the screen, but stop at 450px */
      width: '100%', 
      maxWidth: '450px', 
      
      /* Add padding so it doesn't touch the phone edges */
      padding: '20px', 
      paddingBottom: '120px', // Extra space for the Dock
      boxSizing: 'border-box',
      
      margin: '0 auto', 
      minHeight: '100vh', 
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
        <span style={{ 
          fontSize: '1rem', fontWeight: 'bold', color: '#4CAF50',
          border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '20px',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Trophy size={16} /> Wins: {wins}
        </span>

        <div style={{ display: 'flex', gap: '15px' }}>
            <motion.button 
            whileTap={{ scale: 0.9 }} onClick={openVoid}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: isVoidOpen ? 1 : 0.5 }}
            >
            {isVoidOpen ? <X size={28} /> : <Flame size={28} />}
            </motion.button>

            <motion.button 
            whileTap={{ scale: 0.9 }} onClick={openSettings}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: isSettingsOpen ? 1 : 0.5 }}
            >
            {isSettingsOpen ? <X size={28} /> : <Settings size={28} />}
            </motion.button>
        </div>
      </div>

      {/* VIEW SWITCHER */}
      {isSettingsOpen ? (
        
        /* SETTINGS VIEW */
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: 'rgba(30,30,30,0.9)', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Settings size={20} />
            <h2 style={{ margin: 0 }}>Task Editor</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            {allTasks.map((task, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#333', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>{task.text}</div>
                <button onClick={() => setAllTasks(allTasks.filter((_, i) => i !== index))} style={{ background: '#552222', color: '#ffaaaa', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex' }}>
                   <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => {
               e.preventDefault();
               const text = e.target.elements.taskText.value;
               const tier = parseInt(e.target.elements.tierSelect.value);
               if(!text) return;
               setAllTasks([...allTasks, { text, tier, type: 'custom' }]);
               e.target.reset();
             }} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444' }}>
               <input name="taskText" placeholder="New task..." style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white' }} />
               <div style={{ display: 'flex', gap: '10px' }}>
                 <select name="tierSelect" style={{ padding: '10px', borderRadius: '5px', flex: 1, backgroundColor: '#333', color: 'white', border: 'none' }}><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option><option value="4">Tier 4</option></select>
                 <button type="submit" style={{ padding: '10px 15px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} />
                 </button>
               </div>
          </form>
        </motion.div>

      ) : isVoidOpen ? (

        /* VOID VIEW */
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
                backgroundColor: 'rgba(20, 0, 0, 0.8)', backdropFilter: 'blur(10px)',
                padding: '30px', borderRadius: '25px', textAlign: 'center',
                border: '1px solid rgba(255, 50, 50, 0.2)', boxShadow: '0 0 50px rgba(255, 0, 0, 0.1)'
            }}
        >
            <h2 style={{ color: '#ffaaaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Flame /> The Void
            </h2>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Type what is bothering you. Then burn it.</p>
            
            <textarea 
                value={voidText} onChange={(e) => setVoidText(e.target.value)} placeholder="I feel..."
                style={{
                    width: '100%', height: '150px', boxSizing: 'border-box',
                    backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '15px',
                    padding: '15px', color: 'white', fontSize: '1rem', marginTop: '20px',
                    resize: 'none', outline: 'none', fontFamily: 'inherit',
                    transition: 'all 1s ease', opacity: isBurning ? 0 : 1,
                    transform: isBurning ? 'scale(0.9) translateY(-20px)' : 'scale(1)',
                    filter: isBurning ? 'blur(10px) brightness(2)' : 'none',
                }}
            />
            <motion.button 
                whileTap={{ scale: 0.9 }} onClick={handleBurn}
                style={{ 
                    marginTop: '20px', padding: '15px 40px', borderRadius: '50px', border: 'none', 
                    background: 'linear-gradient(135deg, #D32F2F 0%, #8b0000 100%)', 
                    color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(200, 0, 0, 0.4)',
                    display: 'flex', alignItems: 'center', gap: '10px', margin: '20px auto'
                }}
            >
                <Flame size={20} /> {isBurning ? 'Burning...' : 'Release'}
            </motion.button>
        </motion.div>

      ) : (

        /* MAIN APP VIEW */
        <>
          {energy === null ? (
            /* Dashboard */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               <h2 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                 <Battery size={28} /> Check Battery
               </h2>
               {tiers.map((tier) => (
                 <motion.button 
                   key={tier.level}
                   whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                   onClick={() => handleSelect(tier.level)}
                   style={{
                     padding: '20px', fontSize: '1.2rem', borderRadius: '16px',
                     border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(5px)',
                     color: 'white', textAlign: 'left', cursor: 'pointer', marginBottom: '10px', width: '100%'
                   }}
                 >
                   <strong>{tier.label}</strong><br/>
                   <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{tier.desc}</span>
                 </motion.button>
               ))}
            </div>
          ) : (
            /* Action Card */
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.8)', backdropFilter: 'blur(15px)',
                  padding: '30px', borderRadius: '25px', textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', position: 'relative'
              }}
            >
              <button onClick={() => setEnergy(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
                <X size={28} />
              </button>
              
              <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatePresence mode='wait'>
                  <motion.h2 key={currentTask ? currentTask.text : "loading"} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} style={{ fontSize: '1.8rem', lineHeight: '1.4', margin: 0 }}>
                    {currentTask ? currentTask.text : "Loading..."}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => getTask(energy)} style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', backgroundColor: '#333', color: '#aaa', fontWeight: 'bold', cursor: 'pointer' }}>Skip</motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleComplete} style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={20} /> I Did It
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* COMFORT DOCK */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '20px', backgroundColor: '#2a2a2a', padding: '10px 20px',
        borderRadius: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', border: '1px solid #444', zIndex: 100
      }}>
        <div 
           onClick={toggleRain} 
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isPlaying ? '#4CAF50' : '#fff', transition: 'color 0.3s' }}
        >
           <div style={{ marginBottom: '2px' }}>{isPlaying ? <Pause size={24} /> : <Play size={24} />}</div>
           <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CloudRain size={12} /> Rain</span>
        </div>

        <a 
           href="https://www.tiktok.com/" 
           target="_blank" 
           rel="noreferrer"
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#fff' }}
        >
           <div style={{ marginBottom: '2px' }}><Tv size={24} /></div>
           <span style={{ fontSize: '0.7rem' }}>TikTok</span>
        </a>
      </div>

    </div>
  )
}

export default App