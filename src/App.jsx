import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// IMPORT THE NEW ICONS
import { Settings, X, Flame, Play, Pause, CloudRain, Tv, Trash2, Plus, Battery, Check, Trophy, Wind } from 'lucide-react'

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
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  const openSettings = () => { setIsVoidOpen(false); setIsBreathingOpen(false); setIsSettingsOpen(!isSettingsOpen); };
  const openVoid = () => { setIsSettingsOpen(false); setIsBreathingOpen(false); setIsVoidOpen(!isVoidOpen); };
  const openBreathing = () => { setIsSettingsOpen(false); setIsVoidOpen(false); setIsBreathingOpen(!isBreathingOpen); };
  

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

  // --- MULTI-TRACK AUDIO ENGINE ---
  const [currentSound, setCurrentSound] = useState(null); 
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);
  
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);

  const playSound = async (filename, soundName) => {
    // 1. Setup Context
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    // 2. Resume if suspended
    if (ctx.state === 'suspended') await ctx.resume();

    // 3. STOP logic (If clicking the same sound)
    if (currentSound === soundName) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setCurrentSound(null);
      return;
    }

    // 4. SWITCH logic (Stop old, start new)
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }

    try {
      const response = await fetch('/' + filename);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      
      source.connect(ctx.destination);
      source.start();
      
      sourceNodeRef.current = source;
      setCurrentSound(soundName); 
    } catch (error) {
      console.error("Error playing audio:", error);
      setCurrentSound(null);
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
            whileTap={{ scale: 0.9 }} onClick={openBreathing}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: isBreathingOpen ? 1 : 0.5 }}
            >
            {isBreathingOpen ? <X size={28} /> : <Wind size={28} />}
            </motion.button>

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
               <input name="taskText" placeholder="New task..." style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', backgroundColor: '#333', color: 'white' }} />
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

      ) : isBreathingOpen ? (

        /* --- VIEW 3: BREATHING CIRCLE --- */
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
                backgroundColor: 'rgba(0, 20, 40, 0.8)', // Deep Blue
                backdropFilter: 'blur(10px)',
                padding: '30px', borderRadius: '25px', textAlign: 'center',
                border: '1px solid rgba(50, 100, 255, 0.2)', 
                boxShadow: '0 0 50px rgba(0, 100, 255, 0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '400px'
            }}
        >
            <h2 style={{ color: '#aaccff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wind /> Breathe
            </h2>
            
            {/* The Breathing Animation */}
            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px 0' }}>
                
                {/* The Outer Ghost Circle (Max Size) */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                {/* The Moving Circle */}
                <motion.div
                    animate={{ 
                        scale: [1, 2, 2, 1], // Small -> Big -> Hold -> Small
                        opacity: [0.5, 1, 1, 0.5]
                    }}
                    transition={{ 
                        duration: 12, // 4s In, 4s Hold, 4s Out
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.33, 0.66, 1] // Timing points
                    }}
                    style={{
                        width: '80px', height: '80px',
                        backgroundColor: '#4dabf7',
                        borderRadius: '50%',
                        boxShadow: '0 0 30px #4dabf7'
                    }}
                />
                
                {/* Text prompts that change with time? For MVP, let's keep it simple text */}
                <div style={{ position: 'absolute', pointerEvents: 'none', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    4-4-4
                </div>
            </div>

            <p style={{ opacity: 0.7, fontSize: '0.9rem', maxWidth: '80%' }}>
                Breathe in as it grows.<br/>Hold.<br/>Breathe out as it shrinks.
            </p>
        </motion.div> 
        
      )  : (

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

      {/* --- COMFORT DOCK (Glass Edition) --- */}
      <div style={{
        position: 'fixed', 
        bottom: '30px', // Lifted slightly higher
        left: '50%', 
        transform: 'translateX(-50%)',
        
        display: 'flex', 
        gap: '40px', // More breathing room between icons
        alignItems: 'center',
        
        // The Glass Look
        backgroundColor: 'rgba(15, 23, 42, 0.7)', // Deep transparent blue
        backdropFilter: 'blur(12px)',            // Blurs the content behind it
        WebkitBackdropFilter: 'blur(12px)',      // For iPhone support
        
        padding: '12px 35px',
        borderRadius: '24px',                    // Smooth squircle shape
        
        border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle top highlight
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', // Deep shadow for depth
        zIndex: 100
      }}>
        
        {/* SOUND CONTROLLER WRAPPER */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* THE POPUP MENU (Vertical Stack) */}
            <AnimatePresence>
                {isSoundMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        style={{
                            position: 'absolute', 
                            bottom: '100%', 
                            marginBottom: '20px', 
                            
                            backgroundColor: 'rgba(30, 30, 40, 0.9)', 
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50px', 
                            padding: '12px 8px',
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            alignItems: 'center'
                        }}
                    >
                        {/* Fire Option */}
                        <motion.div 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playSound('fire.mp3', 'fire')} 
                            style={{ 
                                cursor: 'pointer', padding: '10px', borderRadius: '50%', 
                                backgroundColor: currentSound === 'fire' ? 'rgba(255, 100, 100, 0.2)' : 'transparent',
                                color: currentSound === 'fire' ? '#ff8787' : '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <Flame size={20} />
                        </motion.div>

                        {/* Rain Option */}
                        <motion.div 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playSound('rain.mp3', 'rain')} 
                            style={{ 
                                cursor: 'pointer', padding: '10px', borderRadius: '50%',
                                backgroundColor: currentSound === 'rain' ? 'rgba(77, 171, 247, 0.2)' : 'transparent',
                                color: currentSound === 'rain' ? '#4dabf7' : '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <CloudRain size={20} />
                        </motion.div>

                        {/* Close Option */}
                        <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsSoundMenuOpen(false)} style={{ cursor: 'pointer', color: '#64748b', padding: '5px' }}>
                            <X size={16} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN SOUND BUTTON */}
            <motion.div 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: currentSound ? '#4CAF50' : '#e2e8f0', transition: 'color 0.3s' }}
            >
                <div style={{ marginBottom: '4px' }}>
                    {currentSound ? <Pause size={28} /> : <Play size={28} />}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>
                    {currentSound === 'rain' ? 'Rain' : currentSound === 'fire' ? 'Fire' : 'Sound'}
                </span>
            </motion.div>

        </div>

        {/* TIKTOK LINK */}
        <motion.a 
           whileTap={{ scale: 0.9 }}
           href="https://www.tiktok.com/" 
           target="_blank" 
           rel="noreferrer"
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: '#e2e8f0' }}
        >
           <div style={{ marginBottom: '4px' }}><Tv size={28} /></div>
           <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>TikTok</span>
        </motion.a>

      </div>

    </div>
  )
}

export default App