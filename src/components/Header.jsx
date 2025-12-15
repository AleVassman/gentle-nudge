import { motion } from 'framer-motion';
import { Trophy, X, Calendar, Settings as SettingsIcon, HelpCircle } from 'lucide-react';

export default function Header({ 
  wins, 
  openHistory, 
  isHistoryOpen, 
  openSettings, 
  isSettingsOpen,
  openHelp,
  triggerHaptic 
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
      
      {/* WINS COUNTER */}
      <span style={{ 
        fontSize: '1rem', fontWeight: 'bold', color: '#4CAF50',
        border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '20px',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <Trophy size={16} /> Wins: {wins}
      </span>

      {/* TOP BUTTONS */}
      <div style={{ display: 'flex', gap: '15px' }}>
          
          {/* HISTORY BUTTON */}
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => { triggerHaptic(); openHistory(); }}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: isHistoryOpen ? 1 : 0.5 }}
          >
            {isHistoryOpen ? <X size={28} /> : <Calendar size={28} />}
          </motion.button>

          {/* HELP BUTTON (NEW) */}
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => { triggerHaptic(); openHelp(); }}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: 0.5 }}
          >
            <HelpCircle size={28} />
          </motion.button>

          {/* SETTINGS BUTTON */}
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={() => { triggerHaptic(); openSettings(); }}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', opacity: isSettingsOpen ? 1 : 0.5 }}
          >
            {isSettingsOpen ? <X size={28} /> : <SettingsIcon size={28} />}
          </motion.button>
      </div>
    </div>
  );
}