import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // <--- 1. Import

export default function BreathingCircle() {
  const { t } = useLanguage(); // <--- 2. Activate

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{ 
            backgroundColor: 'rgba(0, 20, 40, 0.8)', 
            backdropFilter: 'blur(10px)',
            padding: '30px', borderRadius: '25px', textAlign: 'center',
            border: '1px solid rgba(50, 100, 255, 0.2)', 
            boxShadow: '0 0 50px rgba(0, 100, 255, 0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '400px',
            width: '100%',
            boxSizing: 'border-box'
        }}
    >
        <h2 style={{ color: '#aaccff', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Wind /> {t('breathe.title')}
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
            
            <div style={{ position: 'absolute', pointerEvents: 'none', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                4-4-4
            </div>
        </div>

        {/* Note: whiteSpace: 'pre-line' ensures the text breaks lines correctly */}
        <p style={{ opacity: 0.7, fontSize: '0.9rem', maxWidth: '80%', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {t('breathe.instructions')}
        </p>
    </motion.div> 
  );
}