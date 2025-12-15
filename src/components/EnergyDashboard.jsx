import { motion } from 'framer-motion';
import { Battery } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // <--- 1. Import

export default function EnergyDashboard({ tiers, handleSelect }) {
  const { t } = useLanguage(); // <--- 2. Activate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Battery size={28} /> {t('dashboard.title')}
        </h2>
        
        {tiers.map((tier) => (
            <motion.button 
            key={tier.level}
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(tier.level)}
            style={{
                padding: '20px', fontSize: '1.2rem', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                backdropFilter: 'blur(5px)',
                color: 'white', textAlign: 'left', cursor: 'pointer', 
                marginBottom: '10px', width: '100%'
            }}
            >
            {/* 3. Dynamic Translation Logic */}
            {/* We look up 'tiers.t1', 'tiers.t2', etc based on the level number */}
            <strong>{t(`tiers.t${tier.level}`)}</strong><br/>
            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {t(`tiers.t${tier.level}_desc`)}
            </span>
            </motion.button>
        ))}
    </div>
  );
}