import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Trash2, Plus, MessageCircle, UserPlus, Check, MapPin, Download, Upload } from 'lucide-react';

export default function Settings({ 
  allTasks, 
  setAllTasks, 
  lifeline, 
  setLifeline, 
  triggerHaptic 
}) {

  // --- BACKUP & RESTORE LOGIC (Moved here) ---
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
        
        alert("Restore successful! App will reload.");
        window.location.reload(); 
      } catch (err) {
        alert("Error: Invalid backup file.");
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <SettingsIcon size={20} />
        <h2 style={{ margin: 0 }}>Settings</h2>
      </div>
      
      {/* TASK LIST EDITOR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
        {allTasks.map((task, index) => {
          let badgeColor = '#555';
          let badgeLabel = 'Survival';
          if (task.tier === 2) { badgeColor = '#d97706'; badgeLabel = 'Low Power'; }
          if (task.tier === 3) { badgeColor = '#2563eb'; badgeLabel = 'Reboot'; }
          if (task.tier === 4) { badgeColor = '#16a34a'; badgeLabel = 'Online'; }

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
                </div>
                <div style={{ lineHeight: '1.4' }}>{task.text}</div>
              </div>
              
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
           <input name="taskText" placeholder="New task..." style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', backgroundColor: '#333', color: 'white' }} />
           <div style={{ display: 'flex', gap: '10px' }}>
             <select name="tierSelect" style={{ padding: '10px', borderRadius: '5px', flex: 1, backgroundColor: '#333', color: 'white', border: 'none' }}><option value="1">Survival Task</option><option value="2">Low Power Task</option><option value="3">Rebooting Task</option><option value="4">Online Task</option></select>
             <button type="submit" style={{ padding: '10px 15px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} />
             </button>
           </div>
      </form>

      {/* LIFELINE SETUP */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px' }}>
           <MessageCircle size={16} /> Lifeline Team
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {lifeline.contacts?.map((contact, index) => (
            <div key={contact.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <input 
                  placeholder="Name (e.g. Mom)"
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
                placeholder="Message..." 
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
            <UserPlus size={16} /> Add Contact
          </button>
        )}

        <div 
          onClick={() => { triggerHaptic(); setLifeline({ ...lifeline, includeLocation: !lifeline.includeLocation }); }}
          style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', opacity: 0.9 }}
        >
          <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: '2px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: lifeline.includeLocation ? '#4CAF50' : 'transparent', borderColor: lifeline.includeLocation ? '#4CAF50' : '#666' }}>
            {lifeline.includeLocation && <Check size={14} color="white" />}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#ccc' }}><MapPin size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> Include GPS location</span>
        </div>
      </div>

      {/* DATA BACKUP */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#aaa' }}>Data Backup</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleBackup} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#334155', color: '#e2e8f0', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <Download size={18} /> Save
          </button>
          <label style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#334155', color: '#e2e8f0', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <Upload size={18} /> Load
            <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
          </label>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>Save your file to keep your history safe.</p>
      </div>
    </motion.div>
  );
}