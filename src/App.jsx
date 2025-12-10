import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// IMPORT THE NEW ICONS
import { Settings, X, Flame, Play, Pause, CloudRain, Trash2, Plus, Battery, Check, Trophy, Wind, Calendar, Download, Upload, MessageCircle } from 'lucide-react'

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Toggle Helpers (Now with Haptics)
  const openSettings = () => { triggerHaptic(); setIsVoidOpen(false); setIsBreathingOpen(false); setIsHistoryOpen(false); setIsSettingsOpen(!isSettingsOpen); };
  const openVoid = () => { triggerHaptic(); setIsSettingsOpen(false); setIsBreathingOpen(false); setIsHistoryOpen(false); setIsVoidOpen(!isVoidOpen); };
  const openBreathing = () => { triggerHaptic(); setIsSettingsOpen(false); setIsVoidOpen(false); setIsHistoryOpen(false); setIsBreathingOpen(!isBreathingOpen); };
  const openHistory = () => { triggerHaptic(); setIsSettingsOpen(false); setIsVoidOpen(false); setIsBreathingOpen(false); setIsHistoryOpen(!isHistoryOpen); };

  // --- DATA: HISTORY LOG ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("gentle_history");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("gentle_history", JSON.stringify(history));
  }, [history]);

  // VOID LOGIC
  const [voidText, setVoidText] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = () => {
    if (!voidText) return;
    
    // Pattern: Vibrate, wait, vibrate again (Rumblestrip effect)
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]); 
    
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

  // --- LIFELINE DATA ---
  const [lifeline, setLifeline] = useState(() => {
    const saved = localStorage.getItem("gentle_lifeline");
    return saved ? JSON.parse(saved) : { number: "", message: "I'm having a low energy day. Send me a meme?" };
  });

  useEffect(() => {
    localStorage.setItem("gentle_lifeline", JSON.stringify(lifeline));
  }, [lifeline]);

  const triggerLifeline = () => {
    triggerHaptic();
    if (!lifeline.number) {
      alert("Please set a phone number in Settings first!");
      openSettings();
      return;
    }
    // Format for WhatsApp: https://wa.me/1234567890?text=Hello
    const url = `https://wa.me/${lifeline.number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lifeline.message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    localStorage.setItem("gentle_tasks", JSON.stringify(allTasks));
  }, [allTasks]);

  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("gentle_wins");
    const today = new Date().toLocaleDateString(); // Gets "12/9/2025"
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if the saved data is from TODAY
        if (parsed.date === today) {
          return parsed.count;
        }
      } catch (e) {
        // If old format (just a number), reset to 0 to be safe
        return 0;
      }
    }
    return 0; // New day? Start at 0.
  });
  
  // Save both the count AND the date
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem("gentle_wins", JSON.stringify({ date: today, count: wins }));
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

  // --- HAPTIC FEEDBACK ---
  const triggerHaptic = () => {
    // Only works on supported devices (mostly Android)
    if (navigator.vibrate) {
      navigator.vibrate(10); // Tiny 10ms vibration
    }
  };

  // --- BACKUP & RESTORE LOGIC ---
  const handleBackup = () => {
    triggerHaptic();
    // 1. Gather all data
    const data = {
      tasks: localStorage.getItem("gentle_tasks"),
      history: localStorage.getItem("gentle_history"),
      wins: localStorage.getItem("gentle_wins")
    };
    
    // 2. Create a downloadable file
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nudge-backup-${new Date().toISOString().split('T')[0]}.json`; // e.g. nudge-backup-2023-12-09.json
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // 3. Safety Check & Restore
        if (data.tasks) localStorage.setItem("gentle_tasks", data.tasks);
        if (data.history) localStorage.setItem("gentle_history", data.history);
        if (data.wins) localStorage.setItem("gentle_wins", data.wins);
        
        alert("Restore successful! App will reload.");
        window.location.reload(); // Reload to apply changes
      } catch (err) {
        alert("Error: Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleSelect = (level) => {
    triggerHaptic();
    setEnergy(level);
    getTask(level);

    // NEW: Save today's mood to history
    const today = new Date().toLocaleDateString();
    setHistory(prev => ({
      ...prev,
      [today]: level // Overwrites if you change your mind today
    }));
  };

  const handleComplete = () => {
    triggerHaptic();
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
            {/* HISTORY BUTTON */}
            <motion.button 
            whileTap={{ scale: 0.9 }} onClick={openHistory}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: isHistoryOpen ? 1 : 0.5 }}
            >
            {isHistoryOpen ? <X size={28} /> : <Calendar size={28} />}
            </motion.button>

            {/* SETTINGS BUTTON */}
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
            <h2 style={{ margin: 0 }}>Settings</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            {allTasks.map((task, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#333', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>{task.text}</div>
                <button onClick={() => {triggerHaptic(); setAllTasks(allTasks.filter((_, i) => i !== index))}} style={{ background: '#552222', color: '#ffaaaa', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex' }}>
                   <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => {
               e.preventDefault();
               triggerHaptic();
               const text = e.target.elements.taskText.value;
               const tier = parseInt(e.target.elements.tierSelect.value);
               if(!text) return;
               setAllTasks([...allTasks, { text, tier, type: 'custom' }]);
               e.target.reset();
             }} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444' }}>
               <input name="taskText" placeholder="New task..." style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', backgroundColor: '#333', color: 'white' }} />
               <div style={{ display: 'flex', gap: '10px' }}>
                 <select name="tierSelect" style={{ padding: '10px', borderRadius: '5px', flex: 1, backgroundColor: '#333', color: 'white', border: 'none' }}><option value="1">Survival Task</option><option value="2">Low Power Task</option><option value="3">Rebooting Task</option><option value="4">Online Task</option></select>
                 <button type="submit" style={{ padding: '10px 15px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} />
                 </button>
               </div>
          </form>

          {/* LIFELINE SETUP */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <MessageCircle size={16} /> Lifeline Contact
            </h3>
            
            <input 
              placeholder="Number (e.g. 393331234567)" 
              value={lifeline.number}
              onChange={(e) => setLifeline({ ...lifeline, number: e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white' }} 
            />
            <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '10px' }}>Include Country Code (e.g., 39 for Italy). No + symbol.</p>

            <textarea 
              placeholder="Message..." 
              value={lifeline.message}
              onChange={(e) => setLifeline({ ...lifeline, message: e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box', height: '60px', padding: '12px', borderRadius: '5px', border: 'none', backgroundColor: '#333', color: 'white', fontFamily: 'inherit', resize: 'none' }} 
            />
          </div>

          {/* DATA MANAGEMENT SECTION */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#aaa' }}>Data Backup</h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              
              {/* BACKUP BUTTON */}
              <button 
                onClick={handleBackup}
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '10px', 
                  background: '#334155', color: '#e2e8f0', border: '1px solid #475569',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <Download size={18} /> Save
              </button>

              {/* RESTORE BUTTON (Hidden Input Trick) */}
              <label 
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '10px', 
                  background: '#334155', color: '#e2e8f0', border: '1px solid #475569',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                }}
              >
                <Upload size={18} /> Load
                <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
              </label>

            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>
              Save your file to keep your history safe.
            </p>
          </div>
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
        
      ) : isHistoryOpen ? (

        /* --- VIEW 4: JOURNEY GRID (Dynamic Months) --- */
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ 
                backgroundColor: 'rgba(30,30,30,0.9)', 
                padding: '20px', 
                borderRadius: '15px', 
                border: '1px solid #333',
                boxSizing: 'border-box',
                width: '100%'
            }}
        >
          {/* DYNAMIC HEADER LOGIC */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Calendar size={20} />
            <h2 style={{ margin: 0 }}>
              {(() => {
                const today = new Date();
                const past = new Date();
                past.setDate(today.getDate() - 29);
                
                const startMonth = past.toLocaleString('default', { month: 'long' });
                const endMonth = today.toLocaleString('default', { month: 'long' });
                
                return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
              })()}
            </h2>
          </div>

          {/* THE GRID */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '5px', 
            marginBottom: '20px'
          }}>
            {/* Logic to generate last 30 days */}
            {Array.from({ length: 30 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (29 - i)); 
                const dateKey = d.toLocaleDateString();
                const dayNumber = d.getDate();
                const tier = history[dateKey];
                const isToday = i === 29; 

                // Color Logic
                let bg = 'rgba(255,255,255,0.01)'; 
                let textColor = '#666'; 
                let borderColor = 'rgba(255,255,255,0.1)';
                
                if (tier) {
                    textColor = 'white';
                    borderColor = 'transparent';
                    if (tier === 1) bg = '#555';       
                    if (tier === 2) bg = '#d97706';    
                    if (tier === 3) bg = '#2563eb';    
                    if (tier === 4) bg = '#16a34a';    
                }
                
                if (isToday) borderColor = 'white';

                return (
                  <div 
                    key={i} 
                    style={{ 
                        position: 'relative',
                        width: '100%', aspectRatio: '1/1',
                        backgroundColor: bg,
                        borderRadius: '6px',
                        border: `1px solid ${borderColor}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 'bold', color: textColor
                    }}
                  >
                    {dayNumber}
                  </div>
                );
            })}
          </div>

          {/* LEGEND */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #444', paddingTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#555' }}></div> Survival</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#d97706' }}></div> Low</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2563eb' }}></div> Reboot</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#16a34a' }}></div> Online</div>
          </div>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '15px', fontStyle: 'italic' }}>
            "Progress is not a straight line."
          </p>

        </motion.div> 
        
      )  : (

        /* MAIN APP VIEW */
        <>
          {energy === null ? (
            /* Dashboard */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               <h2 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                 <Battery size={28} /> Battery Check
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
              <button onClick={() => {triggerHaptic(); setEnergy(null)}} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
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
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => {triggerHaptic(); getTask(energy)}} style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', backgroundColor: '#333', color: '#aaa', fontWeight: 'bold', cursor: 'pointer' }}>Skip</motion.button>
                <motion.button whileTap={{ scale: 0.9 }} onClick={handleComplete} style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={20} /> I Did It
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* --- COMFORT DOCK (Perfect Alignment) --- */}
      <div style={{
        position: 'fixed', 
        bottom: '30px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        
        // WIDTH CALCULATIONS
        width: 'calc(100% - 40px)', // Matches the main container margin
        maxWidth: '410px',          // Exactly matches the max-width of the buttons above
        boxSizing: 'border-box',    // <--- THIS IS THE FIX (Keeps padding inside)
        
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        
        backgroundColor: 'rgba(15, 23, 42, 0.85)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        
        padding: '12px 25px',       // Comfortable spacing
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        zIndex: 100
      }}>
        
        {/* 1. SOUND CONTROLLER */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', userSelect: 'none' }}>
            <AnimatePresence>
                {isSoundMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        style={{
                            position: 'absolute', bottom: '100%', marginBottom: '20px', 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '12px 8px',
                            display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', alignItems: 'center'
                        }}
                    >
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => playSound('fire.mp3', 'fire')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', backgroundColor: currentSound === 'fire' ? 'rgba(255, 100, 100, 0.2)' : 'transparent', color: currentSound === 'fire' ? '#ff8787' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flame size={20} /></motion.div>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => playSound('rain.mp3', 'rain')} style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', backgroundColor: currentSound === 'rain' ? 'rgba(77, 171, 247, 0.2)' : 'transparent', color: currentSound === 'rain' ? '#4dabf7' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CloudRain size={20} /></motion.div>
                        <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsSoundMenuOpen(false)} style={{ cursor: 'pointer', color: '#64748b', padding: '5px' }}><X size={16} /></motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: currentSound ? '#4CAF50' : '#e2e8f0', transition: 'color 0.3s' }}>
                <div style={{ marginBottom: '4px' }}>{currentSound ? <Pause size={28} /> : <Play size={28} />}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>{currentSound === 'rain' ? 'Rain' : currentSound === 'fire' ? 'Fire' : 'Sound'}</span>
            </motion.div>
        </div>

        {/* 2. BREATHE BUTTON */}
        <motion.div 
           whileTap={{ scale: 0.9 }}
           onClick={openBreathing}
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isBreathingOpen ? '#4dabf7' : '#e2e8f0', width: '60px', userSelect: 'none' }}
        >
           <div style={{ marginBottom: '4px' }}><Wind size={28} /></div>
           <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>Breathe</span>
        </motion.div>

        {/* 3. VOID BUTTON */}
        <motion.div 
           whileTap={{ scale: 0.9 }}
           onClick={openVoid}
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isVoidOpen ? '#ff8787' : '#e2e8f0', width: '60px', userSelect:'none' }}
        >
           <div style={{ marginBottom: '4px' }}><Flame size={28} /></div>
           <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>Void</span>
        </motion.div>

        {/* 4. HELP BUTTON */}
        <motion.div 
           whileTap={{ scale: 0.9 }}
           onClick={triggerLifeline}
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#e2e8f0', width: '60px', userSelect:'none' }}
        >
           <div style={{ marginBottom: '4px' }}><MessageCircle size={28} /></div>
           <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>Help</span>
        </motion.div>

      </div>

    </div>
  )
}

export default App