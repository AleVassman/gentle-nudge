import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function ActiveCard({ 
  currentTask, 
  setEnergy, 
  getTask, 
  energy, 
  handleComplete, 
  triggerHaptic 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ 
          backgroundColor: 'rgba(30, 30, 30, 0.8)', 
          backdropFilter: 'blur(15px)',
          padding: '30px', 
          borderRadius: '25px', 
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', 
          position: 'relative'
      }}
    >
      {/* CLOSE BUTTON */}
      <button 
        onClick={() => { triggerHaptic(); setEnergy(null); }} 
        style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
      >
        <X size={28} />
      </button>
      
      {/* TASK TEXT ANIMATION */}
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

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
        
        {/* Skip Button */}
        <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => { triggerHaptic(); getTask(energy); }} 
            style={{ padding: '15px 25px', borderRadius: '50px', border: 'none', backgroundColor: '#333', color: '#aaa', fontWeight: 'bold', cursor: 'pointer' }}
        >
            Skip
        </motion.button>
        
        {/* I Did It Button */}
        <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={handleComplete} 
            style={{ padding: '15px 30px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
            <Check size={20} /> I Did It
        </motion.button>
      </div>
    </motion.div>
  );
}