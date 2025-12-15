import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Battery, Layers, LifeBuoy, Flame, Calendar, HelpCircle } from 'lucide-react';

// Map string names to actual components
const iconMap = {
  'Battery': <Battery size={48} color="#4dabf7" />,
  'Layers': <Layers size={48} color="#ffd43b" />,
  'LifeBuoy': <LifeBuoy size={48} color="#69db7c" />, // Using LifeBuoy to represent Tools/Help
  'Flame': <Flame size={48} color="#ff8787" />,
  'Calendar': <Calendar size={48} color="#da77f2" />,
  'Default': <HelpCircle size={48} color="white" />
};

export default function HelpGuide({ onClose, slides, triggerHaptic }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = right, -1 = left

  const handleNext = () => {
    triggerHaptic();
    if (index < slides.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    } else {
      onClose(); // Close if at the end
    }
  };

  const handlePrev = () => {
    triggerHaptic();
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  const content = slides[index];
  const Icon = iconMap[content.icon] || iconMap['Default'];

  // Animation Variants
  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '100%', maxWidth: '350px' }}>
        
        {/* CLOSE BUTTON (Top Right) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button onClick={() => { triggerHaptic(); onClose(); }} style={{ background: 'transparent', color: '#aaa' }}>
                <X size={24} />
            </button>
        </div>

        {/* THE CARD */}
        <div style={{ 
            backgroundColor: 'rgba(30, 30, 40, 0.95)', 
            borderRadius: '24px', 
            padding: '30px 20px',
            border: '1px solid rgba(255,255,255,0.1)',
            minHeight: '350px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
        }}>
            
            <AnimatePresence custom={direction} mode='wait'>
                <motion.div 
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}
                >
                    <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                        {Icon}
                    </div>
                    <h2 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>{content.title}</h2>
                    <p style={{ margin: 0, color: '#aaa', lineHeight: '1.5', minHeight: '80px' }}>
                        {content.text}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* DOTS INDICATOR */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '30px' }}>
                {slides.map((_, i) => (
                    <div key={i} style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.2)',
                        transition: 'background-color 0.3s'
                    }} />
                ))}
            </div>

        </div>

        {/* NAVIGATION BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '0 10px' }}>
            <button 
                onClick={handlePrev} 
                disabled={index === 0}
                style={{ 
                    background: 'transparent', color: index === 0 ? 'transparent' : 'white', 
                    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem',
                    transition: 'opacity 0.2s'
                }}
            >
                <ChevronLeft size={20} /> Back
            </button>

            <button 
                onClick={handleNext} 
                style={{ 
                    background: '#4CAF50', color: 'white', border: 'none',
                    padding: '10px 25px', borderRadius: '30px', fontWeight: 'bold',
                    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem'
                }}
            >
                {index === slides.length - 1 ? 'Start' : 'Next'} <ChevronRight size={20} />
            </button>
        </div>

      </div>
    </motion.div>
  );
}