import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Trash2, Plus, MessageCircle, UserPlus, Check, MapPin, Download, Upload, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; 
import { DEFAULT_TASKS_EN, DEFAULT_TASKS_IT } from '../constants'; 

export default function Settings({ 
  allTasks, 
  setAllTasks, 
  lifeline, 
  setLifeline, 
  triggerHaptic 
}) {
  const { t, language, setLanguage } = useLanguage(); 

  // --- SMART LANGUAGE SWITCHER ---
  const changeLanguage = (newLang) => {
    triggerHaptic();
    setLanguage(newLang); // 1. Change UI Text

    // 2. Handle Tasks
    // Keep user's custom tasks...
    const customTasks = allTasks.filter(task => task.type === 'custom');
    
    // ...replace default tasks with the new language's set
    const newDefaults = newLang === 'it' ? DEFAULT_TASKS_IT : DEFAULT_TASKS_EN;
    
    // Combine them
    setAllTasks([...newDefaults, ...customTasks]);
  };

  // --- BACKUP & RESTORE ---
  const handleBackup = () => {
    triggerHaptic();
    const data = {
      tasks: localStorage.getItem("gentle_tasks"),
      history: localStorage.getItem("gentle_history"),
      wins: localStorage.getItem("gentle_wins"),
      lifeline: localStorage.getItem("gentle_lifeline")
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nudge-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.tasks) localStorage.setItem("gentle_tasks", data.tasks);
        if (data.history) localStorage.setItem("gentle_history", data.history);
        if (data.wins) localStorage.setItem("gentle_wins", data.wins);
        if (data.lifeline) localStorage.setItem("gentle_lifeline", data.lifeline);
        alert(t('settings.restoreAlert'));
        window.location.reload(); 
      } catch (err) {
        alert(t('settings.restoreError'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ backgroundColor: 'rgba(30,30,30,0.9)', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <SettingsIcon size={20} />
        <h2 style={{ margin: 0 }}>{t('settings.title')}</h2>
      </div>

      {/* --- LANGUAGE SWITCHER --- */}
      <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.9rem', color: '#aaa' }}>
            <Globe size={16} /> Language / Lingua
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={() => changeLanguage('en')}
                style={{ 
                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: language === 'en' ? '#4CAF50' : '#333', color: 'white', fontWeight: 'bold'
                }}
            >
                English
            </button>
            <button 
                onClick={() => changeLanguage('it')}
                style={{ 
                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: language === 'it' ? '#4CAF50' : '#333', color: 'white', fontWeight: 'bold'
                }}
            >
                Italiano
            </button>
        </div>
      </div>
      
      {/* TASK LIST EDITOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
         <h3 style={{ margin: 0, fontSize: '1rem', color: '#aaa' }}>{t('settings.taskEditor')}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
        {allTasks.map((task, index) => {
          let badgeColor = '#555';
          let badgeLabel = t('tiers.t1'); // Dynamic translation
          if (task.tier === 2) { badgeColor = '#d97706'; badgeLabel = t('tiers.t2'); }
          if (task.tier === 3) { badgeColor = '#2563eb'; badgeLabel = t('tiers.t3'); }
          if (task.tier === 4) { badgeColor = '#16a34a'; badgeLabel = t('tiers.t4'); }

          // Only allow deleting CUSTOM tasks to prevent breaking the array logic
          const isCustom = task.type === 'custom';

          return (
            <div key={index} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ flex: 1, marginRight: '10px' }}>
                <div style={{ marginBottom: '6px' }}>
                    <span style={{ backgroundColor: badgeColor, color: 'white', fontSize: '0.65rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {badgeLabel}
                    </span>
                    {isCustom && <span style={{ marginLeft: '5px', fontSize: '0.65rem', color: '#4CAF50', border: '1px solid #4CAF50', padding: '2px 5px', borderRadius: '5px' }}>MY TASK</span>}
                </div>
                <div style={{ lineHeight: '1.4' }}>{task.text}</div>
              </div>
              
              {/* Only show delete button for Custom Tasks, or allow all? 
                  If we allow deleting defaults, they will come back when switching languages.
                  Let's allow deleting everything for freedom, but knowing defaults return on lang switch. */}
              <button onClick={() => { triggerHaptic(); setAllTasks(allTasks.filter((_, i) => i !== index)); }} style={{ background: 'rgba(85, 34, 34, 0.5)', color: '#ffaaaa', border: '1px solid rgba(255,0,0,0.2)', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                 <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD NEW FORM */}
      <form onSubmit={(e) => {
           e.preventDefault();
           triggerHaptic();
           const text = e.target.elements.taskText.value;
           const tier = parseInt(e.target.elements.tierSelect.value);
           if(!text) return;
           setAllTasks([...allTasks, { text, tier, type: 'custom' }]);
           e.target.reset();
         }} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444' }}>
           <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#aaa' }}>{t('settings.addNew')}</h3>
           <input name="taskText" placeholder={t('settings.newTaskPlaceholder')} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', backgroundColor: '#333', color: 'white' }} />
           <div style={{ display: 'flex', gap: '10px' }}>
             <select name="tierSelect" style={{ padding: '10px', borderRadius: '5px', flex: 1, backgroundColor: '#333', color: 'white', border: 'none' }}>
                <option value="1">{t('tiers.t1')}</option>
                <option value="2">{t('tiers.t2')}</option>
                <option value="3">{t('tiers.t3')}</option>
                <option value="4">{t('tiers.t4')}</option>
             </select>
             <button type="submit" style={{ padding: '10px 15px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} />
             </button>
           </div>
      </form>

      {/* LIFELINE SETUP */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}>
           <MessageCircle size={16} /> {t('settings.lifelineTitle')}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {lifeline.contacts?.map((contact, index) => (
            <div key={contact.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <input 
                  placeholder={t('settings.lifelinePlaceholderName')}
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...lifeline.contacts];
                    newContacts[index].name = e.target.value;
                    setLifeline({ ...lifeline, contacts: newContacts });
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#4CAF50', fontWeight: 'bold', fontSize: '0.9rem', width: '100%' }}
                />
                <button onClick={() => {
                    const newContacts = lifeline.contacts.filter(c => c.id !== contact.id);
                    setLifeline({ ...lifeline, contacts: newContacts });
                }} style={{ background: 'transparent', border: 'none', color: '#ffaaaa', cursor: 'pointer' }}><Trash2 size={16}/></button>
              </div>

              <input 
                placeholder="39333..." 
                value={contact.number}
                onChange={(e) => {
                  const newContacts = [...lifeline.contacts];
                  newContacts[index].number = e.target.value;
                  setLifeline({ ...lifeline, contacts: newContacts });
                }}
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#222', color: 'white', boxSizing: 'border-box' }} 
              />

              <textarea 
                placeholder={t('settings.lifelinePlaceholderMsg')}
                value={contact.message}
                onChange={(e) => {
                  const newContacts = [...lifeline.contacts];
                  newContacts[index].message = e.target.value;
                  setLifeline({ ...lifeline, contacts: newContacts });
                }}
                style={{ width: '100%', height: '50px', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#222', color: 'white', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} 
              />
            </div>
          ))}
        </div>

        {lifeline.contacts?.length < 3 && (
          <button 
            onClick={() => {
              setLifeline({
                ...lifeline,
                contacts: [...lifeline.contacts || [], { id: Date.now(), name: "", number: "", message: "I need help." }]
              });
            }}
            style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <UserPlus size={16} /> {t('settings.addContact')}
          </button>
        )}

        <div 
          onClick={() => { triggerHaptic(); setLifeline({ ...lifeline, includeLocation: !lifeline.includeLocation }); }}
          style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', opacity: 0.9 }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '2px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: lifeline.includeLocation ? '#4CAF50' : 'transparent', borderColor: lifeline.includeLocation ? '#4CAF50' : '#666' }}>
            {lifeline.includeLocation && <Check size={14} color="white" />}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#ccc' }}><MapPin size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> {t('settings.gpsToggle')}</span>
        </div>
      </div>

      {/* DATA BACKUP */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#aaa' }}>{t('settings.backupTitle')}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleBackup} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#334155', color: '#e2e8f0', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <Download size={18} /> {t('common.save')}
          </button>
          <label style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#334155', color: '#e2e8f0', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <Upload size={18} /> {t('common.load')}
            <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
          </label>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>{t('settings.backupDesc')}</p>
      </div>
    </motion.div>
  );
}