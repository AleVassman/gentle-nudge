import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function HistoryGrid({ history }) {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.85)', 
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
            const tier = history[dateKey]; // Using the prop here
            const isToday = i === 29; 

            // Color Logic
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
  );
}