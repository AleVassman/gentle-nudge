import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function TheVoid() {
  // Logic moved from App.jsx to here
  const [voidText, setVoidText] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = () => {
    if (!voidText) return;
    
    // Haptics (Vibration pattern)
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]); 
    
    setIsBurning(true);
    setTimeout(() => {
      setVoidText("");
      setIsBurning(false);
    }, 1000);
  };

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{ 
            backgroundColor: 'rgba(20, 0, 0, 0.8)', // Dark Red tint
            backdropFilter: 'blur(10px)',
            padding: '30px', borderRadius: '25px', textAlign: 'center',
            border: '1px solid rgba(255, 50, 50, 0.2)', 
            boxShadow: '0 0 50px rgba(255, 0, 0, 0.1)',
            width: '100%',
            boxSizing: 'border-box'
        }}
    >
        <h2 style={{ color: '#ffaaaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '0 0 20px 0' }}>
            <Flame /> The Void
        </h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>Type what is bothering you. Then burn it.</p>
        
        <textarea 
            value={voidText} 
            onChange={(e) => setVoidText(e.target.value)} 
            placeholder="I feel..."
            style={{
                width: '100%', height: '150px', boxSizing: 'border-box',
                backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '15px',
                padding: '15px', color: 'white', fontSize: '1rem', marginTop: '20px',
                resize: 'none', outline: 'none', fontFamily: 'inherit',
                
                // Animation
                transition: 'all 1s ease', 
                opacity: isBurning ? 0 : 1,
                transform: isBurning ? 'scale(0.9) translateY(-20px)' : 'scale(1)',
                filter: isBurning ? 'blur(10px) brightness(2)' : 'none',
            }}
        />
        <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={handleBurn}
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
  );
}