import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CloudRain, X, Pause, Play, Wind, MessageCircle, User, Tv } from 'lucide-react';

export default function ComfortDock({
  currentSound,
  playSound,
  isSoundMenuOpen,
  setIsSoundMenuOpen,
  openBreathing,
  isBreathingOpen,
  openVoid,
  isVoidOpen,
  handleLifelineClick,
  isLifelineMenuOpen,
  setIsLifelineMenuOpen,
  lifeline,
  sendWhatsapp,
  triggerHaptic
}) {
  return (
    <div style={{
        position: 'fixed', 
        bottom: '30px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)', 
        maxWidth: '410px',          
        boxSizing: 'border-box',    
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(15, 23, 42, 0.85)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '12px 25px',       
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        zIndex: 100
      }}>
        
        {/* 1. SOUND CONTROLLER */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
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
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => { triggerHaptic(); playSound('fire.mp3', 'fire'); }} style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', backgroundColor: currentSound === 'fire' ? 'rgba(255, 100, 100, 0.2)' : 'transparent', color: currentSound === 'fire' ? '#ff8787' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flame size={20} /></motion.div>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => { triggerHaptic(); playSound('rain.mp3', 'rain'); }} style={{ cursor: 'pointer', padding: '10px', borderRadius: '50%', backgroundColor: currentSound === 'rain' ? 'rgba(77, 171, 247, 0.2)' : 'transparent', color: currentSound === 'rain' ? '#4dabf7' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CloudRain size={20} /></motion.div>
                        <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => { triggerHaptic(); setIsSoundMenuOpen(false); }} style={{ cursor: 'pointer', color: '#64748b', padding: '5px' }}><X size={16} /></motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div whileTap={{ scale: 0.9 }} onClick={() => { triggerHaptic(); setIsSoundMenuOpen(!isSoundMenuOpen); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: currentSound ? '#4CAF50' : '#e2e8f0', transition: 'color 0.3s' }}>
                <div style={{ marginBottom: '4px' }}>{currentSound ? <Pause size={28} /> : <Play size={28} />}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>{currentSound === 'rain' ? 'Rain' : currentSound === 'fire' ? 'Fire' : 'Sound'}</span>
            </motion.div>
        </div>

        {/* 2. BREATHE BUTTON */}
        <motion.div 
           whileTap={{ scale: 0.9 }}
           onClick={openBreathing}
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isBreathingOpen ? '#4dabf7' : '#e2e8f0', width: '60px' }}
        >
           <div style={{ marginBottom: '4px' }}><Wind size={28} /></div>
           <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>Breathe</span>
        </motion.div>

        {/* 3. VOID BUTTON */}
        <motion.div 
           whileTap={{ scale: 0.9 }}
           onClick={openVoid}
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isVoidOpen ? '#ff8787' : '#e2e8f0', width: '60px' }}
        >
           <div style={{ marginBottom: '4px' }}><Flame size={28} /></div>
           <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>Void</span>
        </motion.div>

        {/* 4. HELP BUTTON (With Popup) */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
            <AnimatePresence>
                {isLifelineMenuOpen && lifeline.contacts.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        style={{
                            position: 'absolute', bottom: '100%', marginBottom: '20px', 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '10px',
                            display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                            alignItems: 'stretch', minWidth: '120px'
                        }}
                    >
                        {lifeline.contacts.map(contact => (
                           <motion.div 
                             key={contact.id}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => sendWhatsapp(contact)}
                             style={{ 
                               cursor: 'pointer', padding: '10px 15px', borderRadius: '10px', 
                               backgroundColor: 'rgba(255,255,255,0.05)', color: 'white',
                               display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem'
                             }}
                           >
                              <User size={16} color="#4CAF50"/> {contact.name || "Contact"}
                           </motion.div>
                        ))}
                        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2px 0' }}></div>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => { triggerHaptic(); setIsLifelineMenuOpen(false); }} style={{ cursor: 'pointer', color: '#64748b', padding: '5px', display: 'flex', justifyContent: 'center' }}><X size={16} /></motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div 
               whileTap={{ scale: 0.9 }}
               onClick={handleLifelineClick}
               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: isLifelineMenuOpen ? '#4CAF50' : '#e2e8f0', width: '60px' }}
            >
               <div style={{ marginBottom: '4px' }}><MessageCircle size={28} /></div>
               <span style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.5px' }}>Help</span>
            </motion.div>
        </div>

      </div>
  );
}