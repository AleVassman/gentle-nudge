import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // <--- 1. Import

export default function HistoryGrid({ history }) {
  const { t, language } = useLanguage(); // <--- 2. Get t AND language

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
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
          {/* We translate the title AND the month names */}
          {t('history.title')} 
          <span style={{ fontSize: '1.1rem', fontWeight: 'normal', marginLeft: '10px', opacity: 0.7 }}>
            {(() => {
                const today = new Date();
                const past = new Date();
                past.setDate(today.getDate() - 29);
                
                // Force the date to use our selected language ('en' or 'it')
                const startMonth = past.toLocaleString(language, { month: 'short' });
                const endMonth = today.toLocaleString(language, { month: 'short' });
                
                return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
            })()}
          </span>
        </h2>
      </div>

      {/* THE GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '5px', 
        marginBottom: '20px'
      }}>
        {Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i)); 
            const dateKey = d.toLocaleDateString();
            const dayNumber = d.getDate();
            const tier = history[dateKey];
            const isToday = i === 29; 

            let bg = 'rgba(255,255,255,0.05)'; 
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

      {/* LEGEND (Translated) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #444', paddingTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#555' }}></div> {t('tiers.t1')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#d97706' }}></div> {t('tiers.t2')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#2563eb' }}></div> {t('tiers.t3')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#aaa' }}><div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#16a34a' }}></div> {t('tiers.t4')}</div>
      </div>
      
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '15px', fontStyle: 'italic' }}>
        "{t('history.quote')}"
      </p>

    </motion.div>
  );
}