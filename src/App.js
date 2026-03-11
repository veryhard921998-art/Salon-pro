import { useState, useEffect } from "react";

// ===== DATA STORE =====
const initialData = {
  appointments: [
    { id: 1, client: "سارة أحمد", service: "قص وتسريح", employee: "منى", date: "2026-03-11", time: "10:00", price: 150, status: "confirmed" },
    { id: 2, client: "نور محمد", service: "صبغة كاملة", employee: "ريم", date: "2026-03-11", time: "11:30", price: 300, status: "waiting" },
    { id: 3, client: "هدى علي", service: "مانيكير", employee: "دينا", date: "2026-03-11", time: "14:00", price: 80, status: "done" },
    { id: 4, client: "لمياء سالم", service: "كيراتين", employee: "منى", date: "2026-03-12", time: "09:00", price: 500, status: "confirmed" },
  ],
  employees: [
    { id: 1, name: "منى خالد", role: "كوافيرة أولى", phone: "0501234567", salary: 3000, commission: 10, appointments: 24, revenue: 4800 },
    { id: 2, name: "ريم عبدالله", role: "خبيرة صبغات", phone: "0507654321", salary: 2500, commission: 12, appointments: 18, revenue: 3600 },
    { id: 3, name: "دينا محمد", role: "خبيرة مانيكير", phone: "0509876543", salary: 2000, commission: 8, appointments: 30, revenue: 2400 },
  ],
  services: [
    { id: 1, name: "قص وتسريح", price: 150, duration: 60, category: "شعر" },
    { id: 2, name: "صبغة كاملة", price: 300, duration: 120, category: "شعر" },
    { id: 3, name: "مانيكير", price: 80, duration: 45, category: "أظافر" },
    { id: 4, name: "كيراتين", price: 500, duration: 180, category: "شعر" },
    { id: 5, name: "بيديكير", price: 100, duration: 60, category: "أظافر" },
    { id: 6, name: "مكياج سهرة", price: 250, duration: 90, category: "مكياج" },
  ],
  inventory: [
    { id: 1, name: "شامبو كيراتين", quantity: 15, minQty: 5, price: 85, unit: "زجاجة" },
    { id: 2, name: "صبغة شعر - أشقر", quantity: 8, minQty: 10, price: 45, unit: "أنبوب" },
    { id: 3, name: "مزيل طلاء أظافر", quantity: 25, minQty: 8, price: 20, unit: "زجاجة" },
    { id: 4, name: "كريم مرطب", quantity: 3, minQty: 5, price: 120, unit: "علبة" },
    { id: 5, name: "مناديل تجميل", quantity: 50, minQty: 20, price: 15, unit: "علبة" },
  ],
  clients: [
    { id: 1, name: "سارة أحمد", phone: "0501111111", visits: 12, totalSpent: 2400, lastVisit: "2026-03-11", points: 240 },
    { id: 2, name: "نور محمد", phone: "0502222222", visits: 5, totalSpent: 950, lastVisit: "2026-03-11", points: 95 },
    { id: 3, name: "هدى علي", phone: "0503333333", visits: 20, totalSpent: 3800, lastVisit: "2026-03-11", points: 380 },
    { id: 4, name: "لمياء سالم", phone: "0504444444", visits: 8, totalSpent: 2100, lastVisit: "2026-03-12", points: 210 },
  ],
  invoices: [
    { id: 1001, client: "هدى علي", services: ["مانيكير"], employee: "دينا", total: 80, paid: 80, date: "2026-03-11", status: "paid" },
    { id: 1002, client: "سارة أحمد", services: ["قص وتسريح"], employee: "منى", total: 150, paid: 150, date: "2026-03-10", status: "paid" },
  ],
};

// ===== COLORS & STYLES =====
const colors = {
  bg: "#0f0a1e",
  bgCard: "#1a1030",
  bgCardHover: "#221540",
  accent: "#c084fc",
  accent2: "#f0abfc",
  accentGold: "#fbbf24",
  accentTeal: "#2dd4bf",
  accentRose: "#fb7185",
  text: "#f3e8ff",
  textMuted: "#a78bca",
  border: "#3b2060",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#fb7185",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Tajawal:wght@300;400;500;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:${colors.bg}; color:${colors.text}; font-family:'Cairo',sans-serif; direction:rtl; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:${colors.bg}; }
  ::-webkit-scrollbar-thumb { background:${colors.border}; border-radius:3px; }
  
  .sidebar { position:fixed; right:0; top:0; height:100vh; width:240px; background:${colors.bgCard};
    border-left:1px solid ${colors.border}; display:flex; flex-direction:column; z-index:100;
    background: linear-gradient(180deg, #1a1030 0%, #0f0a1e 100%);
  }
  .logo { padding:24px 20px; border-bottom:1px solid ${colors.border}; }
  .logo h1 { font-size:22px; font-weight:900; background:linear-gradient(135deg,${colors.accent},${colors.accent2});
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .logo p { font-size:11px; color:${colors.textMuted}; margin-top:2px; }
  
  .nav-item { display:flex; align-items:center; gap:12px; padding:13px 20px; cursor:pointer;
    color:${colors.textMuted}; font-size:14px; font-weight:500; transition:all .2s;
    border-right:3px solid transparent; }
  .nav-item:hover { color:${colors.text}; background:rgba(192,132,252,0.08); }
  .nav-item.active { color:${colors.accent}; background:rgba(192,132,252,0.12); border-right-color:${colors.accent}; }
  .nav-item .icon { font-size:18px; width:24px; text-align:center; }
  
  .main { margin-right:240px; min-height:100vh; padding:28px; }
  .page-title { font-size:26px; font-weight:900; margin-bottom:6px; }
  .page-sub { color:${colors.textMuted}; font-size:13px; margin-bottom:28px; }
  
  .card { background:${colors.bgCard}; border:1px solid ${colors.border}; border-radius:16px; padding:20px;
    transition:all .2s; }
  .card:hover { border-color:rgba(192,132,252,0.3); }
  
  .stat-card { background:linear-gradient(135deg,${colors.bgCard},rgba(192,132,252,0.05));
    border:1px solid ${colors.border}; border-radius:16px; padding:22px; }
  
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:600; }
  .badge-confirmed { background:rgba(45,212,191,0.15); color:${colors.accentTeal}; }
  .badge-waiting { background:rgba(251,191,36,0.15); color:${colors.warning}; }
  .badge-done { background:rgba(52,211,153,0.15); color:${colors.success}; }
  .badge-cancelled { background:rgba(251,113,133,0.15); color:${colors.danger}; }
  .badge-paid { background:rgba(52,211,153,0.15); color:${colors.success}; }
  
  .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:10px;
    border:none; cursor:pointer; font-family:'Cairo',sans-serif; font-size:13px; font-weight:600;
    transition:all .2s; }
  .btn-primary { background:linear-gradient(135deg,#7c3aed,${colors.accent}); color:white; }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 15px rgba(124,58,237,0.4); }
  .btn-outline { background:transparent; border:1px solid ${colors.border}; color:${colors.textMuted}; }
  .btn-outline:hover { border-color:${colors.accent}; color:${colors.accent}; }
  .btn-danger { background:rgba(251,113,133,0.15); color:${colors.danger}; border:1px solid rgba(251,113,133,0.3); }
  
  .table { width:100%; border-collapse:collapse; }
  .table th { padding:12px 16px; text-align:right; font-size:12px; color:${colors.textMuted};
    font-weight:600; border-bottom:1px solid ${colors.border}; text-transform:uppercase; letter-spacing:.5px; }
  .table td { padding:14px 16px; border-bottom:1px solid rgba(59,32,96,0.5); font-size:13px; }
  .table tr:hover td { background:rgba(192,132,252,0.04); }
  .table tr:last-child td { border-bottom:none; }
  
  .input { background:rgba(255,255,255,0.05); border:1px solid ${colors.border}; border-radius:10px;
    padding:10px 14px; color:${colors.text}; font-family:'Cairo',sans-serif; font-size:13px;
    outline:none; transition:all .2s; width:100%; }
  .input:focus { border-color:${colors.accent}; background:rgba(192,132,252,0.08); }
  .input::placeholder { color:${colors.textMuted}; }
  
  .select { background:rgba(255,255,255,0.05); border:1px solid ${colors.border}; border-radius:10px;
    padding:10px 14px; color:${colors.text}; font-family:'Cairo',sans-serif; font-size:13px;
    outline:none; width:100%; cursor:pointer; }
  .select option { background:#1a1030; }
  
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:200;
    display:flex; align-items:center; justify-content:center; backdrop-filter:blur(4px); }
  .modal { background:${colors.bgCard}; border:1px solid ${colors.border}; border-radius:20px;
    padding:28px; width:90%; max-width:480px; max-height:90vh; overflow-y:auto; }
  .modal h2 { font-size:18px; font-weight:700; margin-bottom:20px; }
  
  .form-group { margin-bottom:16px; }
  .form-label { display:block; font-size:12px; color:${colors.textMuted}; font-weight:600;
    margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
  
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  
  .low-stock { background:rgba(251,113,133,0.08); border-color:rgba(251,113,133,0.3); }
  
  .progress-bar { height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:3px; transition:width .5s; }
  
  .toast { position:fixed; bottom:24px; left:24px; background:#1a1030; border:1px solid ${colors.accentTeal};
    color:${colors.accentTeal}; padding:12px 20px; border-radius:12px; font-size:13px; font-weight:600;
    z-index:999; animation:slideUp .3s ease; }
  @keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fade-in { animation: fadeIn .3s ease; }

  .chip { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px;
    font-size:11px; font-weight:600; background:rgba(192,132,252,0.15); color:${colors.accent}; margin:2px; }
`;

// ===== HELPERS =====
const statusLabel = { confirmed: "مؤكد", waiting: "انتظار", done: "منتهي", cancelled: "ملغي", paid: "مدفوع" };
const today = "2026-03-11";

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  return <div className="toast">✓ {msg}</div>;
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2>{title}</h2>
          <button className="btn btn-outline" style={{padding:"6px 12px"}} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ===== DASHBOARD =====
function Dashboard({ data }) {
  const todayAppts = data.appointments.filter(a => a.date === today);
  const todayRevenue = data.invoices.filter(i => i.date === today).reduce((s,i) => s+i.total, 0);
  const lowStock = data.inventory.filter(i => i.quantity <= i.minQty);

  const stats = [
    { label:"مواعيد اليوم", value:todayAppts.length, icon:"📅", color:colors.accent, sub:"حجز مؤكد" },
    { label:"إيرادات اليوم", value:`${todayRevenue} ر.س`, icon:"💰", color:colors.accentGold, sub:"+12% عن أمس" },
    { label:"إجمالي العملاء", value:data.clients.length, icon:"👥", color:colors.accentTeal, sub:"عميل نشط" },
    { label:"تنبيهات مخزون", value:lowStock.length, icon:"⚠️", color:colors.accentRose, sub:"منتج ناقص" },
  ];

  return (
    <div className="fade-in">
      <div className="page-title">لوحة التحكم 🌸</div>
      <div className="page-sub">مرحباً بك — {new Date().toLocaleDateString("ar-SA", {weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>

      <div className="grid-4" style={{marginBottom:24}}>
        {stats.map((s,i) => (
          <div key={i} className="stat-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,color:colors.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>{s.label}</div>
                <div style={{fontSize:26,fontWeight:900,color:s.color}}>{s.value}</div>
                <div style={{fontSize:11,color:colors.textMuted,marginTop:4}}>{s.sub}</div>
              </div>
              <div style={{fontSize:28}}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{gap:20}}>
        <div className="card">
          <div style={{fontWeight:700,marginBottom:16,fontSize:15}}>مواعيد اليوم 📋</div>
          {todayAppts.length === 0 ? <div style={{color:colors.textMuted,textAlign:"center",padding:20}}>لا توجد مواعيد</div> : (
            todayAppts.map(a => (
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${colors.border}`}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{a.client}</div>
                  <div style={{fontSize:12,color:colors.textMuted}}>{a.service} · {a.employee}</div>
                </div>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:700,color:colors.accent,fontSize:13}}>{a.time}</div>
                  <span className={`badge badge-${a.status}`}>{statusLabel[a.status]}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div style={{fontWeight:700,marginBottom:16,fontSize:15}}>أداء الموظفين 👩‍💼</div>
          {data.employees.map(e => (
            <div key={e.id} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:13}}>{e.name}</span>
                <span style={{color:colors.accentGold,fontSize:13,fontWeight:700}}>{e.revenue} ر.س</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${Math.min((e.revenue/5000)*100,100)}%`,
                  background:`linear-gradient(90deg,#7c3aed,${colors.accent})`}} />
              </div>
              <div style={{fontSize:11,color:colors.textMuted,marginTop:4}}>{e.appointments} موعد هذا الشهر</div>
            </div>
          ))}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="card low-stock" style={{marginTop:20}}>
          <div style={{fontWeight:700,marginBottom:12,fontSize:15,color:colors.danger}}>⚠️ تنبيهات المخزون</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {lowStock.map(i => (
              <div key={i.id} style={{background:"rgba(251,113,133,0.15)",padding:"8px 14px",borderRadius:10,fontSize:13}}>
                <span style={{fontWeight:600}}>{i.name}</span>
                <span style={{color:colors.danger,marginRight:8}}>({i.quantity} {i.unit} متبقي)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== APPOINTMENTS =====
function Appointments({ data, setData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ client:"", service:"", employee:"", date:today, time:"", price:"", status:"confirmed" });

  const filtered = data.appointments.filter(a => filter === "all" || a.status === filter);

  function addAppointment() {
    if (!form.client || !form.service || !form.time) return;
    const newA = { ...form, id: Date.now(), price: Number(form.price) };
    setData(d => ({ ...d, appointments: [newA, ...d.appointments] }));
    setShowModal(false);
    setForm({ client:"", service:"", employee:"", date:today, time:"", price:"", status:"confirmed" });
    showToast("تم إضافة الموعد بنجاح");
  }

  function changeStatus(id, status) {
    setData(d => ({ ...d, appointments: d.appointments.map(a => a.id===id ? {...a,status} : a) }));
    showToast("تم تحديث الحالة");
  }

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div className="page-title">الحجوزات والمواعيد 📅</div>
          <div className="page-sub">إدارة جميع مواعيد الصالون</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ موعد جديد</button>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {[["all","الكل"],["confirmed","مؤكد"],["waiting","انتظار"],["done","منتهي"]].map(([v,l]) => (
          <button key={v} className={`btn ${filter===v?"btn-primary":"btn-outline"}`}
            style={{padding:"8px 16px",fontSize:12}} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>العميل</th><th>الخدمة</th><th>الموظفة</th><th>التاريخ</th><th>الوقت</th><th>السعر</th><th>الحالة</th><th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td style={{fontWeight:600}}>{a.client}</td>
                <td>{a.service}</td>
                <td style={{color:colors.textMuted}}>{a.employee}</td>
                <td style={{color:colors.textMuted}}>{a.date}</td>
                <td style={{color:colors.accent,fontWeight:700}}>{a.time}</td>
                <td style={{color:colors.accentGold,fontWeight:700}}>{a.price} ر.س</td>
                <td><span className={`badge badge-${a.status}`}>{statusLabel[a.status]}</span></td>
                <td>
                  <div style={{display:"flex",gap:4}}>
                    {a.status !== "done" && <button className="btn btn-outline" style={{padding:"4px 10px",fontSize:11}} onClick={() => changeStatus(a.id,"done")}>✓ أنهِ</button>}
                    {a.status === "confirmed" && <button className="btn btn-danger" style={{padding:"4px 10px",fontSize:11}} onClick={() => changeStatus(a.id,"cancelled")}>إلغاء</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="إضافة موعد جديد" onClose={() => setShowModal(false)}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">اسم العميلة</label>
              <input className="input" placeholder="اسم العميلة" value={form.client} onChange={e=>setForm({...form,client:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">الخدمة</label>
              <select className="select" value={form.service} onChange={e=>{
                const svc = data.services.find(s=>s.name===e.target.value);
                setForm({...form,service:e.target.value,price:svc?.price||""});
              }}>
                <option value="">اختر الخدمة</option>
                {data.services.map(s=><option key={s.id} value={s.name}>{s.name} - {s.price} ر.س</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">الموظفة</label>
              <select className="select" value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})}>
                <option value="">اختر الموظفة</option>
                {data.employees.map(e=><option key={e.id} value={e.name}>{e.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">السعر (ر.س)</label>
              <input className="input" type="number" placeholder="السعر" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">التاريخ</label>
              <input className="input" type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">الوقت</label>
              <input className="input" type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button className="btn btn-primary" style={{flex:1}} onClick={addAppointment}>حفظ الموعد</button>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ===== POS =====
function POS({ data, setData, showToast }) {
  const [cart, setCart] = useState([]);
  const [client, setClient] = useState("");
  const [employee, setEmployee] = useState("");
  const [payMethod, setPayMethod] = useState("cash");

  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);

  function addToCart(svc) {
    setCart(c => {
      const ex = c.find(i=>i.id===svc.id);
      if (ex) return c.map(i=>i.id===svc.id?{...i,qty:i.qty+1}:i);
      return [...c, {...svc,qty:1}];
    });
  }

  function removeFromCart(id) { setCart(c => c.filter(i=>i.id!==id)); }

  function checkout() {
    if (cart.length===0 || !client) return;
    const inv = {
      id: 1000+data.invoices.length+1,
      client, employee, services: cart.map(i=>i.name),
      total, paid: total, date: today, status:"paid"
    };
    setData(d => ({ ...d, invoices:[inv,...d.invoices] }));
    setCart([]); setClient(""); setEmployee("");
    showToast(`تم إصدار الفاتورة #${inv.id} بنجاح`);
  }

  const categories = [...new Set(data.services.map(s=>s.category))];

  return (
    <div className="fade-in">
      <div className="page-title">نقطة البيع 🧾</div>
      <div className="page-sub">إصدار الفواتير وتسجيل المبيعات</div>

      <div className="grid-2" style={{gap:20,alignItems:"start"}}>
        <div>
          {categories.map(cat => (
            <div key={cat} style={{marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:13,color:colors.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{cat}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {data.services.filter(s=>s.category===cat).map(s => (
                  <button key={s.id} onClick={() => addToCart(s)}
                    style={{background:colors.bgCard,border:`1px solid ${colors.border}`,borderRadius:12,
                      padding:"14px",cursor:"pointer",textAlign:"right",transition:"all .2s",color:colors.text,fontFamily:"Cairo,sans-serif"}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor=colors.accent;e.currentTarget.style.background=colors.bgCardHover}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor=colors.border;e.currentTarget.style.background=colors.bgCard}}>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{s.name}</div>
                    <div style={{color:colors.accentGold,fontWeight:700}}>{s.price} ر.س</div>
                    <div style={{fontSize:11,color:colors.textMuted,marginTop:2}}>⏱ {s.duration} دقيقة</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{position:"sticky",top:20}}>
          <div style={{fontWeight:700,fontSize:16,marginBottom:16}}>🛒 الفاتورة الحالية</div>

          <div className="form-group">
            <label className="form-label">العميلة</label>
            <input className="input" placeholder="اسم أو رقم هاتف العميلة" value={client} onChange={e=>setClient(e.target.value)} list="clients-list" />
            <datalist id="clients-list">{data.clients.map(c=><option key={c.id} value={c.name}/>)}</datalist>
          </div>
          <div className="form-group">
            <label className="form-label">الموظفة</label>
            <select className="select" value={employee} onChange={e=>setEmployee(e.target.value)}>
              <option value="">اختر الموظفة</option>
              {data.employees.map(e=><option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          </div>

          {cart.length === 0 ? (
            <div style={{textAlign:"center",color:colors.textMuted,padding:"30px 0",fontSize:13}}>
              اضغط على الخدمات لإضافتها
            </div>
          ) : (
            <div style={{marginBottom:16}}>
              {cart.map(item => (
                <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 0",borderBottom:`1px solid ${colors.border}`}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{item.name}</div>
                    <div style={{fontSize:12,color:colors.textMuted}}>{item.price} ر.س × {item.qty}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:700,color:colors.accentGold}}>{item.price*item.qty} ر.س</span>
                    <button onClick={()=>removeFromCart(item.id)} style={{background:"none",border:"none",color:colors.danger,cursor:"pointer",fontSize:16}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{background:"rgba(192,132,252,0.1)",borderRadius:12,padding:14,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{color:colors.textMuted,fontSize:13}}>المجموع</span>
              <span style={{fontWeight:900,fontSize:20,color:colors.accent}}>{total} ر.س</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">طريقة الدفع</label>
            <div style={{display:"flex",gap:8}}>
              {[["cash","نقداً 💵"],["card","بطاقة 💳"],["transfer","تحويل 📱"]].map(([v,l]) => (
                <button key={v} onClick={()=>setPayMethod(v)}
                  className={`btn ${payMethod===v?"btn-primary":"btn-outline"}`}
                  style={{flex:1,fontSize:12,padding:"8px"}}>{l}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" style={{width:"100%",padding:"14px",fontSize:15,justifyContent:"center"}}
            onClick={checkout} disabled={cart.length===0||!client}>
            إصدار الفاتورة ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== EMPLOYEES =====
function Employees({ data, setData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", role:"", phone:"", salary:"", commission:"" });

  function addEmployee() {
    if (!form.name || !form.role) return;
    const emp = { ...form, id:Date.now(), salary:Number(form.salary), commission:Number(form.commission), appointments:0, revenue:0 };
    setData(d => ({ ...d, employees:[...d.employees,emp] }));
    setShowModal(false);
    setForm({ name:"", role:"", phone:"", salary:"", commission:"" });
    showToast("تم إضافة الموظفة بنجاح");
  }

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div className="page-title">إدارة الموظفين 👩‍💼</div>
          <div className="page-sub">متابعة أداء وبيانات الفريق</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ موظفة جديدة</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {data.employees.map(e => (
          <div key={e.id} className="card">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,#7c3aed,${colors.accent})`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {e.name[0]}
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>{e.name}</div>
                <div style={{fontSize:12,color:colors.textMuted}}>{e.role}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[
                ["📅 المواعيد",e.appointments,""],
                ["💰 الإيرادات",e.revenue,"ر.س"],
                ["🎯 العمولة",e.commission,"%"],
                ["💵 الراتب",e.salary,"ر.س"],
              ].map(([l,v,u]) => (
                <div key={l} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:10}}>
                  <div style={{fontSize:11,color:colors.textMuted,marginBottom:4}}>{l}</div>
                  <div style={{fontWeight:700,fontSize:15}}>{v} <span style={{fontSize:11,color:colors.textMuted}}>{u}</span></div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:colors.textMuted,display:"flex",alignItems:"center",gap:6}}>
              📱 {e.phone}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="إضافة موظفة جديدة" onClose={()=>setShowModal(false)}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">الاسم</label>
              <input className="input" placeholder="اسم الموظفة" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">المسمى الوظيفي</label>
              <input className="input" placeholder="مثل: كوافيرة" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">رقم الهاتف</label>
              <input className="input" placeholder="05xxxxxxxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">الراتب (ر.س)</label>
              <input className="input" type="number" placeholder="الراتب" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} />
            </div>
            <div className="form-group" style={{gridColumn:"span 2"}}>
              <label className="form-label">نسبة العمولة (%)</label>
              <input className="input" type="number" placeholder="نسبة العمولة" value={form.commission} onChange={e=>setForm({...form,commission:e.target.value})} />
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button className="btn btn-primary" style={{flex:1}} onClick={addEmployee}>حفظ</button>
            <button className="btn btn-outline" onClick={()=>setShowModal(false)}>إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ===== INVENTORY =====
function Inventory({ data, setData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", quantity:"", minQty:"", price:"", unit:"قطعة" });

  function addItem() {
    if (!form.name) return;
    const item = { ...form, id:Date.now(), quantity:Number(form.quantity), minQty:Number(form.minQty), price:Number(form.price) };
    setData(d => ({ ...d, inventory:[...d.inventory,item] }));
    setShowModal(false);
    setForm({ name:"", quantity:"", minQty:"", price:"", unit:"قطعة" });
    showToast("تم إضافة المنتج بنجاح");
  }

  function updateQty(id, delta) {
    setData(d => ({ ...d, inventory: d.inventory.map(i => i.id===id ? {...i,quantity:Math.max(0,i.quantity+delta)} : i) }));
  }

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div className="page-title">المخزون والمنتجات 📦</div>
          <div className="page-sub">متابعة المنتجات والمستلزمات</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ منتج جديد</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {data.inventory.map(item => {
          const isLow = item.quantity <= item.minQty;
          return (
            <div key={item.id} className={`card ${isLow?"low-stock":""}`}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:14}}>{item.name}</div>
                {isLow && <span className="badge" style={{background:"rgba(251,113,133,0.15)",color:colors.danger}}>⚠️ ناقص</span>}
              </div>
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{color:colors.textMuted,fontSize:12}}>الكمية المتاحة</span>
                  <span style={{fontWeight:700,color:isLow?colors.danger:colors.success}}>{item.quantity} {item.unit}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width:`${Math.min((item.quantity/Math.max(item.minQty*3,item.quantity))*100,100)}%`,
                    background:isLow?`linear-gradient(90deg,${colors.danger},#f97316)`:`linear-gradient(90deg,${colors.success},${colors.accentTeal})`
                  }} />
                </div>
                <div style={{fontSize:11,color:colors.textMuted,marginTop:4}}>الحد الأدنى: {item.minQty} {item.unit}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:colors.accentGold,fontWeight:700}}>{item.price} ر.س</span>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-outline" style={{padding:"4px 12px",fontSize:13}} onClick={()=>updateQty(item.id,-1)}>−</button>
                  <button className="btn btn-primary" style={{padding:"4px 12px",fontSize:13}} onClick={()=>updateQty(item.id,+1)}>+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="إضافة منتج جديد" onClose={()=>setShowModal(false)}>
          <div className="grid-2">
            <div className="form-group" style={{gridColumn:"span 2"}}>
              <label className="form-label">اسم المنتج</label>
              <input className="input" placeholder="اسم المنتج" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">الكمية الحالية</label>
              <input className="input" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">الحد الأدنى</label>
              <input className="input" type="number" value={form.minQty} onChange={e=>setForm({...form,minQty:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">السعر (ر.س)</label>
              <input className="input" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">الوحدة</label>
              <input className="input" placeholder="زجاجة / علبة..." value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} />
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <button className="btn btn-primary" style={{flex:1}} onClick={addItem}>حفظ</button>
            <button className="btn btn-outline" onClick={()=>setShowModal(false)}>إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ===== CLIENTS =====
function Clients({ data }) {
  return (
    <div className="fade-in">
      <div className="page-title">العملاء 👥</div>
      <div className="page-sub">قاعدة بيانات العملاء وتاريخ زياراتهم</div>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>الاسم</th><th>الهاتف</th><th>عدد الزيارات</th><th>إجمالي الإنفاق</th><th>آخر زيارة</th><th>نقاط الولاء</th></tr>
          </thead>
          <tbody>
            {data.clients.map(c => (
              <tr key={c.id}>
                <td style={{fontWeight:600}}>{c.name}</td>
                <td style={{color:colors.textMuted}}>{c.phone}</td>
                <td><span className="chip">🗓 {c.visits} زيارة</span></td>
                <td style={{color:colors.accentGold,fontWeight:700}}>{c.totalSpent} ر.س</td>
                <td style={{color:colors.textMuted}}>{c.lastVisit}</td>
                <td><span className="chip">⭐ {c.points} نقطة</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== REPORTS =====
function Reports({ data }) {
  const totalRevenue = data.invoices.reduce((s,i) => s+i.total, 0);
  const totalAppts = data.appointments.length;
  const doneAppts = data.appointments.filter(a=>a.status==="done").length;
  const avgTicket = data.invoices.length ? Math.round(totalRevenue/data.invoices.length) : 0;

  const serviceStats = {};
  data.appointments.forEach(a => {
    serviceStats[a.service] = (serviceStats[a.service]||0)+1;
  });
  const topServices = Object.entries(serviceStats).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div className="fade-in">
      <div className="page-title">التقارير والإحصائيات 📊</div>
      <div className="page-sub">تحليل أداء الصالون والإيرادات</div>

      <div className="grid-4" style={{marginBottom:24}}>
        {[
          ["💰 إجمالي الإيرادات",`${totalRevenue} ر.س`,colors.accentGold],
          ["📅 إجمالي المواعيد",totalAppts,colors.accent],
          ["✅ المواعيد المنجزة",doneAppts,colors.success],
          ["🧾 متوسط الفاتورة",`${avgTicket} ر.س`,colors.accentTeal],
        ].map(([l,v,c]) => (
          <div key={l} className="stat-card">
            <div style={{fontSize:12,color:colors.textMuted,marginBottom:8}}>{l}</div>
            <div style={{fontSize:24,fontWeight:900,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{gap:20}}>
        <div className="card">
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>أكثر الخدمات طلباً 🏆</div>
          {topServices.map(([name,count],i) => (
            <div key={name} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13}}><span style={{color:colors.accent,fontWeight:700,marginLeft:6}}>#{i+1}</span>{name}</span>
                <span style={{color:colors.accentGold,fontWeight:700}}>{count} مرة</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${(count/topServices[0][1])*100}%`,
                  background:`linear-gradient(90deg,#7c3aed,${colors.accent})`}} />
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>آخر الفواتير 🧾</div>
          {data.invoices.slice(0,5).map(inv => (
            <div key={inv.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"12px 0",borderBottom:`1px solid ${colors.border}`}}>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>#{inv.id} — {inv.client}</div>
                <div style={{fontSize:12,color:colors.textMuted}}>{inv.date} · {inv.employee}</div>
                <div>{inv.services.map(s=><span key={s} className="chip">{s}</span>)}</div>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={{fontWeight:700,color:colors.accentGold}}>{inv.total} ر.س</div>
                <span className="badge badge-paid">مدفوع</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
const navItems = [
  { id:"dashboard", icon:"🏠", label:"الرئيسية" },
  { id:"appointments", icon:"📅", label:"الحجوزات" },
  { id:"pos", icon:"🧾", label:"نقطة البيع" },
  { id:"employees", icon:"👩‍💼", label:"الموظفين" },
  { id:"inventory", icon:"📦", label:"المخزون" },
  { id:"clients", icon:"👥", label:"العملاء" },
  { id:"reports", icon:"📊", label:"التقارير" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(initialData);
  const [toast, setToast] = useState(null);

  function showToast(msg) { setToast(msg); }

  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:colors.bg}}>
        <nav className="sidebar">
          <div className="logo">
            <h1>✨ سالون برو</h1>
            <p>نظام إدارة الصالون</p>
          </div>
          <div style={{padding:"12px 0",flex:1}}>
            {navItems.map(n => (
              <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
                <span className="icon">{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </div>
          <div style={{padding:"16px 20px",borderTop:`1px solid ${colors.border}`}}>
            <div style={{fontSize:12,color:colors.textMuted}}>صالون الجمال الراقي</div>
            <div style={{fontSize:11,color:colors.border,marginTop:2}}>النسخة 1.0</div>
          </div>
        </nav>

        <main className="main">
          {page==="dashboard" && <Dashboard data={data} />}
          {page==="appointments" && <Appointments data={data} setData={setData} showToast={showToast} />}
          {page==="pos" && <POS data={data} setData={setData} showToast={showToast} />}
          {page==="employees" && <Employees data={data} setData={setData} showToast={showToast} />}
          {page==="inventory" && <Inventory data={data} setData={setData} showToast={showToast} />}
          {page==="clients" && <Clients data={data} />}
          {page==="reports" && <Reports data={data} />}
        </main>

        {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}
