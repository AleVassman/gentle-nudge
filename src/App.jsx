import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Import Components
import Header from './components/Header';
import Settings from './components/Settings';
import TheVoid from './components/TheVoid';
import BreathingCircle from './components/BreathingCircle';
import HistoryGrid from './components/HistoryGrid';
import EnergyDashboard from './components/EnergyDashboard';
import ActiveCard from './components/ActiveCard';
import ComfortDock from './components/ComfortDock';
import HelpGuide from './components/HelpGuide';

// Import Data
import { DEFAULT_TASKS } from './constants';


function App() {
  // --- STATE MANAGEMENT ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoidOpen, setIsVoidOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toggle Helpers (Now with Haptics)
  const openSettings = () => { triggerHaptic(); setIsVoidOpen(false); setIsBreathingOpen(false); setIsHistoryOpen(false); setIsSettingsOpen(!isSettingsOpen); };
  const openVoid = () => { triggerHaptic(); setIsSettingsOpen(false); setIsBreathingOpen(false); setIsHistoryOpen(false); setIsVoidOpen(!isVoidOpen); };
  const openBreathing = () => { triggerHaptic(); setIsSettingsOpen(false); setIsVoidOpen(false); setIsHistoryOpen(false); setIsBreathingOpen(!isBreathingOpen); };
  const openHistory = () => { triggerHaptic(); setIsSettingsOpen(false); setIsVoidOpen(false); setIsBreathingOpen(false); setIsHistoryOpen(!isHistoryOpen); };
  const openHelp = () => { setIsHelpOpen(true); };

  // --- DATA: HISTORY LOG ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("gentle_history");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("gentle_history", JSON.stringify(history));
  }, [history]);

  // DATA
  const [allTasks, setAllTasks] = useState(() => {
    const saved = localStorage.getItem("gentle_tasks");
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  // --- LIFELINE DATA ---
  const [isLifelineMenuOpen, setIsLifelineMenuOpen] = useState(false);

  const [lifeline, setLifeline] = useState(() => {
    const saved = localStorage.getItem("gentle_lifeline");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // MIGRATION 1: Convert old single-contact format to new format
        if (parsed.number) {
          return {
            includeLocation: parsed.includeLocation || false,
            contacts: [{ id: 1, name: "Contact 1", number: parsed.number, message: parsed.message }]
          };
        }

        // MIGRATION 2: Safety Check (The Fix)
        // If 'contacts' is missing for any reason, force it to be an empty array
        if (!Array.isArray(parsed.contacts)) {
             return { ...parsed, contacts: [] };
        }

        return parsed;
      } catch (e) {
        // If data is totally corrupted, reset
        return { includeLocation: false, contacts: [] };
      }
    }
    // Default start
    return { includeLocation: false, contacts: [] };
  });

  useEffect(() => {
    localStorage.setItem("gentle_lifeline", JSON.stringify(lifeline));
  }, [lifeline]);

  // 1. The Decision Maker
  const handleLifelineClick = () => {
    triggerHaptic();
    
    if (lifeline.contacts.length === 0) {
      alert("Please add a contact in Settings first!");
      openSettings();
    } else if (lifeline.contacts.length === 1) {
      // Only 1 contact? Send immediately (No menu needed)
      sendWhatsapp(lifeline.contacts[0]);
    } else {
      // Multiple contacts? Toggle the menu
      setIsLifelineMenuOpen(!isLifelineMenuOpen);
    }
  };

  // 2. The Sender
  const sendWhatsapp = (contact) => {
    triggerHaptic();
    
    const doSend = (locationString = "") => {
      const fullText = contact.message + locationString;
      const cleanNumber = contact.number.replace(/[^0-9]/g, '');
      const url = `intent://send?phone=${cleanNumber}&text=${encodeURIComponent(fullText)}#Intent;package=com.whatsapp;scheme=whatsapp;end`;
      window.location.href = url;
      setIsLifelineMenuOpen(false); // Close menu if open
    };

    if (lifeline.includeLocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const link = `\n\n📍 My Location: https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`;
          doSend(link);
        },
        () => doSend("") // Fail silently
      );
    } else {
      doSend("");
    }
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
      <Header 
        wins={wins}
        openHistory={openHistory}
        isHistoryOpen={isHistoryOpen}
        openSettings={openSettings}
        isSettingsOpen={isSettingsOpen}
        openHelp={openHelp}
        triggerHaptic={triggerHaptic}
      />

      {/* VIEW SWITCHER */}
      {isSettingsOpen ? (
        
        /* SETTINGS VIEW */
        <Settings 
          allTasks={allTasks} 
          setAllTasks={setAllTasks}
          lifeline={lifeline}
          setLifeline={setLifeline}
          triggerHaptic={triggerHaptic}
        />

      ) : isVoidOpen ? (

        /* VOID VIEW */
        <TheVoid />

      ) : isBreathingOpen ? (

        /* --- VIEW 3: BREATHING CIRCLE --- */
        <BreathingCircle /> 
        
      ) : isHistoryOpen ? (

        /* --- VIEW 4: JOURNEY GRID (Dynamic Months) --- */
        <HistoryGrid history={history} /> 
        
      )  : (

        /* MAIN APP VIEW */
        <>
          {energy === null ? (
            /* Dashboard */
            <EnergyDashboard tiers={tiers} handleSelect={handleSelect} />
          ) : (
            /* Action Card */
            <ActiveCard 
              currentTask={currentTask}
              setEnergy={setEnergy}
              getTask={getTask}
              energy={energy}
              handleComplete={handleComplete}
              triggerHaptic={triggerHaptic}
            />
          )}
        </>
      )}

      {/* --- COMFORT DOCK (Perfect Alignment) --- */}
      <ComfortDock 
        currentSound={currentSound}
        playSound={playSound}
        isSoundMenuOpen={isSoundMenuOpen}
        setIsSoundMenuOpen={setIsSoundMenuOpen}
        openBreathing={openBreathing}
        isBreathingOpen={isBreathingOpen}
        openVoid={openVoid}
        isVoidOpen={isVoidOpen}
        handleLifelineClick={handleLifelineClick}
        isLifelineMenuOpen={isLifelineMenuOpen}
        setIsLifelineMenuOpen={setIsLifelineMenuOpen}
        lifeline={lifeline}
        sendWhatsapp={sendWhatsapp}
        triggerHaptic={triggerHaptic}
      />

      <AnimatePresence>
        {isHelpOpen && (
          <HelpGuide 
            onClose={() => setIsHelpOpen(false)} 
            triggerHaptic={triggerHaptic}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

export default App