'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070d1a;--surface:#0f1929;--surface2:#162035;--surface3:#1c2a42;
  --accent:#3b82f6;--accent2:#6366f1;--accent3:#8b5cf6;
  --green:#10b981;--red:#ef4444;--gold:#f59e0b;--orange:#f97316;
  --text:#e2e8f0;--text2:#94a3b8;--text3:#475569;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);
  --radius:12px;--radius-lg:18px;--radius-xl:24px;
  --font:'Sora',sans-serif;--mono:'JetBrains Mono',monospace;
  --shadow:0 8px 32px rgba(0,0,0,0.5);
}
html,body{font-family:var(--font);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--surface)}
::-webkit-scrollbar-thumb{background:var(--surface3);border-radius:3px}

/* AUTH */
.auth-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;
  background:radial-gradient(ellipse 900px 600px at 50% -5%,rgba(99,102,241,0.18) 0%,transparent 65%),
             radial-gradient(ellipse 500px 400px at 85% 85%,rgba(59,130,246,0.08) 0%,transparent 60%)}
.auth-grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
  background-size:55px 55px;pointer-events:none;z-index:0}
.auth-logo{display:flex;align-items:center;gap:14px;margin-bottom:2.5rem;position:relative;z-index:1;animation:fadeUp 0.5s ease both}
.auth-emblem{width:54px;height:54px;border-radius:15px;background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));
  display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:700;color:#fff;
  box-shadow:0 0 40px rgba(99,102,241,0.45),inset 0 1px 0 rgba(255,255,255,0.2)}
.auth-brand{font-size:20px;font-weight:700;letter-spacing:-0.3px}
.auth-tag{font-size:10px;color:var(--text3);letter-spacing:1.5px;text-transform:uppercase;margin-top:3px}
.auth-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-xl);
  padding:2.5rem;width:100%;max-width:430px;box-shadow:var(--shadow),0 0 60px rgba(99,102,241,0.1);
  position:relative;z-index:1;animation:fadeUp 0.5s ease 0.1s both}
.auth-card h2{font-size:22px;font-weight:700;margin-bottom:5px;letter-spacing:-0.3px}
.auth-sub{font-size:13px;color:var(--text2);margin-bottom:2rem;line-height:1.6}
.field{margin-bottom:1.2rem}
.field label{display:block;font-size:11px;font-weight:600;color:var(--text3);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:7px}
.field input,.field select{width:100%;padding:12px 16px;background:var(--surface2);border:1px solid var(--border2);
  border-radius:var(--radius);color:var(--text);font-family:var(--font);font-size:14px;outline:none;transition:all 0.2s}
.field input:focus,.field select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(59,130,246,0.12)}
.field input::placeholder{color:var(--text3)}
.field select option{background:var(--surface2)}
.btn{width:100%;padding:13px;border-radius:var(--radius);border:none;cursor:pointer;font-family:var(--font);font-size:14px;font-weight:600;transition:all 0.2s}
.btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 16px rgba(99,102,241,0.3)}
.btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 24px rgba(99,102,241,0.45)}
.btn-primary:disabled{opacity:0.55;cursor:not-allowed;transform:none}
.btn-ghost{background:var(--surface2);color:var(--text2);border:1px solid var(--border2)}
.btn-ghost:hover{background:var(--surface3);color:var(--text)}
.otp-row{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:1.5rem}
.otp-cell{padding:15px 0;text-align:center;background:var(--surface2);border:1px solid var(--border2);
  border-radius:10px;color:var(--text);font-size:22px;font-weight:700;font-family:var(--mono);outline:none;transition:all 0.2s}
.otp-cell:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(59,130,246,0.14);background:var(--surface3)}
.otp-cell.filled{border-color:rgba(99,102,241,0.5)}
.timer-row{text-align:center;font-size:13px;color:var(--text3);margin-bottom:1.5rem}
.timer-row span{color:var(--accent);font-weight:600;font-family:var(--mono)}
.alert{padding:11px 16px;border-radius:10px;font-size:13px;margin-bottom:1rem;display:flex;align-items:flex-start;gap:8px;line-height:1.5}
.alert-err{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);color:#fca5a5}
.alert-ok{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#6ee7b7}
.alert-info{background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);color:#93c5fd}

/* APP */
.app{display:flex;flex-direction:column;min-height:100vh}
.topbar{background:rgba(15,25,41,0.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);
  padding:0 2rem;height:62px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.tb-left{display:flex;align-items:center}
.tb-logo{display:flex;align-items:center;gap:10px;margin-right:2.5rem}
.tb-em{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;box-shadow:0 0 14px rgba(99,102,241,0.3)}
.tb-name{font-size:14px;font-weight:600}
.nav{display:flex;gap:2px}
.nav-btn{padding:7px 15px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;color:var(--text2);border:none;background:transparent;font-family:var(--font);transition:all 0.2s;white-space:nowrap}
.nav-btn.active{background:var(--surface2);color:var(--text);border:1px solid var(--border2)}
.nav-btn:hover:not(.active){color:var(--text);background:rgba(255,255,255,0.04)}
.tb-right{display:flex;align-items:center;gap:10px}
.user-chip{display:flex;align-items:center;gap:8px;padding:5px 12px;background:var(--surface2);border:1px solid var(--border2);border-radius:20px;font-size:12px}
.online-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 6px rgba(16,185,129,0.6);flex-shrink:0}
.role-tag{font-size:10px;padding:2px 8px;border-radius:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.role-admin{background:rgba(99,102,241,0.2);color:#a5b4fc}
.role-faculty{background:rgba(16,185,129,0.15);color:#6ee7b7}
.logout-btn{padding:6px 13px;border-radius:8px;background:transparent;border:1px solid var(--border2);color:var(--text2);font-size:12px;cursor:pointer;font-family:var(--font);transition:all 0.2s}
.logout-btn:hover{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.35);color:#fca5a5}
.content{flex:1;padding:2rem;max-width:1360px;margin:0 auto;width:100%}
.page-hdr{margin-bottom:1.75rem}
.page-hdr h1{font-size:24px;font-weight:700;letter-spacing:-0.5px}
.page-hdr p{font-size:13px;color:var(--text2);margin-top:4px}

/* STATS */
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:14px;margin-bottom:1.75rem}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.2rem 1.4rem;transition:all 0.2s}
.stat-card:hover{border-color:var(--border2);transform:translateY(-1px)}
.stat-ic{font-size:18px;margin-bottom:8px}
.stat-val{font-size:26px;font-weight:700;letter-spacing:-1px;font-family:var(--mono);line-height:1}
.stat-lbl{font-size:11px;color:var(--text2);margin-top:5px;text-transform:uppercase;letter-spacing:0.5px}
.stat-sub{font-size:11px;color:var(--text3);margin-top:2px}

/* CHARTS */
.charts-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:1.75rem}
.chart-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem}
.chart-ttl{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:1.2rem}
.chart-box{position:relative;height:200px}

/* TOPPERS */
.toppers-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;margin-bottom:1.75rem}
.topper-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.topper-item:last-child{border-bottom:none;padding-bottom:0}
.t-rank{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.r1{background:rgba(245,158,11,0.18);color:var(--gold)}
.r2{background:rgba(148,163,184,0.15);color:#94a3b8}
.r3{background:rgba(180,83,9,0.15);color:#c2714f}
.t-info{flex:1}
.t-name{font-size:13px;font-weight:600}
.t-meta{font-size:11px;color:var(--text3);margin-top:1px}

/* TABLE */
.toolbar{display:flex;gap:10px;margin-bottom:1.4rem;flex-wrap:wrap;align-items:center}
.search-inp{flex:1;min-width:180px;padding:9px 14px;background:var(--surface);border:1px solid var(--border2);
  border-radius:var(--radius);color:var(--text);font-family:var(--font);font-size:13px;outline:none;transition:border-color 0.2s}
.search-inp:focus{border-color:var(--accent)}
.search-inp::placeholder{color:var(--text3)}
.filter-sel{padding:9px 12px;background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);color:var(--text);font-family:var(--font);font-size:12px;outline:none}
.add-btn{padding:9px 18px;background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:var(--radius);
  color:#fff;font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap;
  box-shadow:0 3px 12px rgba(99,102,241,0.3)}
.add-btn:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(99,102,241,0.45)}
.tbl-wrap{overflow-x:auto;border-radius:var(--radius);border:1px solid var(--border)}
table{width:100%;border-collapse:collapse}
thead tr{background:var(--surface2);border-bottom:1px solid var(--border2)}
th{padding:10px 12px;text-align:left;font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.7px;white-space:nowrap}
tbody tr{border-bottom:1px solid var(--border);background:var(--surface);transition:background 0.15s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--surface2)}
td{padding:11px 12px;font-size:13px}
.empty-row td{text-align:center;padding:3rem;color:var(--text3);font-size:14px}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.3px}
.b-pass{background:rgba(16,185,129,0.15);color:#6ee7b7}
.b-fail{background:rgba(239,68,68,0.15);color:#fca5a5}
.grade{display:inline-flex;align-items:center;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;font-family:var(--mono)}
.gA{background:rgba(99,102,241,0.18);color:#a5b4fc}
.gB{background:rgba(59,130,246,0.18);color:#93c5fd}
.gC{background:rgba(245,158,11,0.18);color:#fcd34d}
.gD{background:rgba(249,115,22,0.18);color:#fdba74}
.gF{background:rgba(239,68,68,0.18);color:#fca5a5}
.acts{display:flex;gap:5px;flex-wrap:wrap}
.act{padding:4px 9px;border-radius:6px;border:1px solid var(--border2);background:transparent;color:var(--text2);font-size:10px;font-weight:500;cursor:pointer;font-family:var(--font);transition:all 0.2s;white-space:nowrap}
.act:hover{background:var(--surface3);color:var(--text)}
.act.del:hover{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.4);color:#fca5a5}
.act.mail:hover{background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.4);color:#6ee7b7}
.act.view{color:var(--accent);border-color:rgba(59,130,246,0.3)}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px);animation:fadeIn 0.2s ease}
.modal{background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius-xl);padding:2rem;width:100%;max-width:580px;max-height:92vh;overflow-y:auto;box-shadow:var(--shadow);animation:slideUp 0.25s ease}
.modal h2{font-size:19px;font-weight:700;margin-bottom:4px;letter-spacing:-0.3px}
.m-sub{font-size:13px;color:var(--text2);margin-bottom:1.6rem}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.full{grid-column:span 2}
.marks-section{border-top:1px solid var(--border);padding-top:1.2rem;margin-top:0.5rem}
.marks-section>label{display:block;font-size:11px;font-weight:600;color:var(--text3);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:14px}
.marks-grid-6{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mf-label{font-size:11px;color:var(--text3);margin-bottom:5px}
.mf-input{width:100%;padding:9px 12px;background:var(--surface2);border:1px solid var(--border2);border-radius:9px;color:var(--text);font-family:var(--mono);font-size:14px;font-weight:600;outline:none;transition:all 0.2s;text-align:center}
.mf-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}
.preview-bar{margin-top:1rem;padding:12px 16px;background:var(--surface2);border-radius:10px;display:flex;gap:14px;align-items:center;font-size:13px;flex-wrap:wrap}
.m-actions{display:flex;gap:10px;margin-top:1.5rem}
.m-actions .btn{flex:1;padding:11px}

/* PROFILE */
.back-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;margin-bottom:1.4rem;border-radius:8px;background:var(--surface);border:1px solid var(--border2);color:var(--text2);font-size:12px;cursor:pointer;font-family:var(--font);transition:all 0.2s}
.back-btn:hover{color:var(--text);background:var(--surface2)}
.profile-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:2rem;margin-bottom:1.2rem}
.profile-head{display:flex;align-items:center;gap:18px;padding-bottom:1.5rem;border-bottom:1px solid var(--border);margin-bottom:1.5rem;flex-wrap:wrap}
.p-avatar{width:60px;height:60px;border-radius:14px;flex-shrink:0;background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;box-shadow:0 4px 16px rgba(99,102,241,0.3)}
.p-info{flex:1}
.p-info h2{font-size:20px;font-weight:700;letter-spacing:-0.3px}
.p-info p{font-size:12px;color:var(--text2);margin-top:3px}
.p-badges{display:flex;gap:7px;margin-top:8px;flex-wrap:wrap}
.p-score{text-align:center;flex-shrink:0}
.p-pct{font-size:30px;font-weight:700;font-family:var(--mono);letter-spacing:-1px;line-height:1}
.p-pct-lbl{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-top:2px}
.p-total{font-size:11px;color:var(--text3);margin-top:1px}
.marks-cells{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-bottom:1.5rem}
.mark-cell{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px}
.mc-sub{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px}
.mc-val{font-size:20px;font-weight:700;font-family:var(--mono)}
.mc-max{font-size:10px;color:var(--text3)}
.mc-bar{height:3px;border-radius:2px;background:var(--surface3);margin-top:7px;overflow:hidden}
.mc-fill{height:100%;border-radius:2px;transition:width 0.7s ease}
.p-chart-box{position:relative;height:200px}
.profile-actions{display:flex;gap:10px;margin-top:4px;flex-wrap:wrap}
.mail-btn{padding:9px 18px;border-radius:var(--radius);background:transparent;border:1px solid rgba(16,185,129,0.4);color:var(--green);font-family:var(--font);font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s}
.mail-btn:hover{background:rgba(16,185,129,0.1)}

/* USERS */
.users-wrap{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.users-hdr{padding:1.2rem 1.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.users-hdr h3{font-size:14px;font-weight:600}

/* SPINNER / LOADING */
.spinner{width:18px;height:18px;border:2px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block;vertical-align:middle}
.loading-box{display:flex;align-items:center;justify-content:center;height:180px;gap:12px;color:var(--text2);font-size:14px}

/* TOAST */
.toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:var(--surface);border:1px solid var(--border2);border-radius:var(--radius);padding:12px 18px;font-size:13px;box-shadow:var(--shadow);display:flex;align-items:center;gap:10px;max-width:340px;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
.toast.hidden{transform:translateY(80px);opacity:0;pointer-events:none}
.toast.show{transform:translateY(0);opacity:1}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:768px){
  .charts-row{grid-template-columns:1fr}
  .form-grid{grid-template-columns:1fr}
  .full{grid-column:span 1}
  .marks-grid-6{grid-template-columns:repeat(2,1fr)}
  .nav{display:none}
  .topbar{padding:0 1rem}
  .content{padding:1rem}
  .profile-head{flex-direction:column;align-items:flex-start}
  .p-score{align-self:flex-start}
}
`

// ── HELPERS ────────────────────────────────────────────────────────────────
const DEPARTMENT_SUBJECTS = {
  Science: ['Physics','Chemistry','Mathematics','Biology','English','ComputerSci'],
  Commerce: ['Accountancy','BusinessStudies','Economics','Mathematics','English','Statistics'],
  Arts: ['History','Geography','PoliticalScience','Sociology','English','Psychology'],
  Engineering: ['Mathematics','Physics','Programming','Electronics','Mechanics','English']
}
const SUBJ_LABELS = {
  Physics:'Physics',
  Chemistry:'Chemistry',
  Mathematics:'Mathematics',
  Biology:'Biology',
  English:'English',
  ComputerSci:'Computer Science',

  Accountancy:'Accountancy',
  BusinessStudies:'Business Studies',
  Economics:'Economics',
  Statistics:'Statistics',

  History:'History',
  Geography:'Geography',
  PoliticalScience:'Political Science',
  Sociology:'Sociology',
  Psychology:'Psychology',

  Programming:'Programming',
  Electronics:'Electronics',
  Mechanics:'Mechanics'
}
const DEPTS = ['Science','Commerce','Arts','Engineering']
const SEMS = ['I','II','III','IV','V','VI']

function calcResult(marks) {
  const vals = Object.values(marks)
  const total = vals.reduce((a,b)=>a+b,0)
  const max = vals.length * 100
  const pct = parseFloat(((total/max)*100).toFixed(1))
  let grade = 'F'
  if(pct>=90) grade='A'
  else if(pct>=75) grade='B'
  else if(pct>=60) grade='C'
  else if(pct>=40) grade='D'
  return {total, max, pct, grade, result: pct>=40?'Pass':'Fail'}
}

function gradeClass(g){return{A:'gA',B:'gB',C:'gC',D:'gD',F:'gF'}[g]||'gF'}
function initials(name){return name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}

// ── TOAST HOOK ─────────────────────────────────────────────────────────────
function useToast(){
  const [toast,setToast]=useState({show:false,msg:'',icon:'✓'})
  const tmr=useRef()
  const show=useCallback((msg,icon='✓')=>{
    clearTimeout(tmr.current)
    setToast({show:true,msg,icon})
    tmr.current=setTimeout(()=>setToast(t=>({...t,show:false})),3500)
  },[])
  return {toast,showToast:show}
}

// ── CHART HOOK ─────────────────────────────────────────────────────────────
function useChart(ref,config,deps){
  const inst=useRef(null)
  useEffect(()=>{
    if(!ref.current) return
    const Chart=window.Chart
    if(!Chart) return
    if(inst.current){inst.current.destroy();inst.current=null}
    inst.current=new Chart(ref.current,config)
    return ()=>{if(inst.current){inst.current.destroy();inst.current=null}}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },deps)
}

// ── API ────────────────────────────────────────────────────────────────────
const api={
  sendOTP:(email,role)=>
    fetch('/api/auth/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,role})}).then(r=>r.json()),
  verifyOTP:(email,otp,role)=>
    fetch('/api/auth/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,otp,role})}).then(r=>r.json()),
  getStudents:(token,params={})=>{
    const q=new URLSearchParams(params).toString()
    return fetch(`/api/students${q?'?'+q:''}`,{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json())
  },
  addStudent:(token,data)=>
    fetch('/api/students',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(data)}).then(r=>r.json()),
  updateStudent:(token,id,data)=>
    fetch(`/api/students/${id}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(data)}).then(r=>r.json()),
  deleteStudent:(token,id)=>
    fetch(`/api/students/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
  sendResult:(token,studentId)=>
    fetch('/api/send-result',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({studentId})}).then(r=>r.json()),
  getUsers:(token)=>
    fetch('/api/users',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()),
  addUser:(token,data)=>
    fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(data)}).then(r=>r.json()),
  deleteUser:(token,id)=>
    fetch('/api/users',{method:'DELETE',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({id})}).then(r=>r.json()),
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function AuthScreen({onLogin}){
  const [step,setStep]=useState('email')
  const [email,setEmail]=useState('')
  const [role,setRole]=useState('Admin')
  const [otp,setOtp]=useState(['','','','','',''])
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const [info,setInfo]=useState('')
  const [seconds,setSeconds]=useState(300)
  const timerRef=useRef()
  const otpRefs=useRef([])
  const {toast,showToast}=useToast()

  function startTimer(){
    clearInterval(timerRef.current)
    setSeconds(300)
    timerRef.current=setInterval(()=>setSeconds(s=>{if(s<=1){clearInterval(timerRef.current);return 0}return s-1}),1000)
  }

  async function handleSendOTP(){
    setError('');setInfo('')
    if(!email.trim()){setError('Please enter your email address.');return}
    setLoading(true)
    const res=await api.sendOTP(email.trim().toLowerCase(),role)
    setLoading(false)
    if(res.error){setError(res.error);return}
    setStep('otp')
    setInfo(`OTP sent to ${email}. Check your inbox.`)
    startTimer()
    setTimeout(()=>otpRefs.current[0]?.focus(),100)
  }

  function handleOtpChange(i,val){
    val=val.replace(/\D/g,'').slice(0,1)
    const next=[...otp];next[i]=val;setOtp(next)
    if(val&&i<5)otpRefs.current[i+1]?.focus()
  }
  function handleOtpKey(i,e){
    if(e.key==='Backspace'&&!otp[i]&&i>0)otpRefs.current[i-1]?.focus()
  }

  async function handleVerify(){
    setError('')
    const code=otp.join('')
    if(code.length<6){setError('Please enter all 6 digits.');return}
    setLoading(true)
    const res=await api.verifyOTP(email.trim().toLowerCase(),code,role)
    setLoading(false)
    if(res.error){setError(res.error);return}
    sessionStorage.setItem('tca_token',res.token)
    sessionStorage.setItem('tca_user',JSON.stringify(res.user))
    onLogin(res.user,res.token)
  }

  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  return(
    <>
      <style>{css}</style>
      <div className="auth-wrap">
        <div className="auth-grid"/>
        <div className="auth-logo">
          <div className="auth-emblem">T</div>
          <div><div className="auth-brand">Target Coaching Academy</div><div className="auth-tag">Result Analysis System</div></div>
        </div>

        {step==='email'&&(
          <div className="auth-card">
            <h2>Secure Portal Access</h2>
            <p className="auth-sub">Only authorized Admin & Faculty can access this system. Enter your registered email to receive a one-time password.</p>
            {error&&<div className="alert alert-err">⚠ {error}</div>}
            <div className="field"><label>Registered Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==='Enter'&&handleSendOTP()}/>
            </div>
            <div className="field"><label>Role</label>
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="Admin">Admin</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleSendOTP} disabled={loading}>
              {loading?<><span className="spinner"/> Sending OTP...</>:'Send OTP via Email'}
            </button>
          </div>
        )}

        {step==='otp'&&(
          <div className="auth-card">
            <h2>Verify Your Identity</h2>
            <p className="auth-sub">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
            {error&&<div className="alert alert-err">⚠ {error}</div>}
            {info&&<div className="alert alert-ok">✓ {info}</div>}
            <div className="otp-row">
              {otp.map((v,i)=>(
                <input key={i} ref={el=>otpRefs.current[i]=el}
                  className={`otp-cell${v?' filled':''}`}
                  value={v} maxLength={1} inputMode="numeric"
                  onChange={e=>handleOtpChange(i,e.target.value)}
                  onKeyDown={e=>handleOtpKey(i,e)}/>
              ))}
            </div>
            <div className="timer-row">
              {seconds>0?<>Expires in <span>{fmt(seconds)}</span></>:<span style={{color:'var(--red)'}}>OTP expired. Go back and resend.</span>}
            </div>
            <button className="btn btn-primary" onClick={handleVerify} disabled={loading} style={{marginBottom:10}}>
              {loading?<><span className="spinner"/> Verifying...</>:'Verify & Sign In'}
            </button>
            <button className="btn btn-ghost" onClick={()=>{setStep('email');setOtp(['','','','','','']);setError('');clearInterval(timerRef.current)}}>← Back</button>
          </div>
        )}

        <div className={`toast ${toast.show?'show':'hidden'}`}><span style={{fontSize:15}}>{toast.icon}</span>{toast.msg}</div>
      </div>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({students}){
  const pfRef=useRef(),deptRef=useRef()
  const results=students.map(s=>({...s,...calcResult(s.marks)}))
  const total=results.length
  const passed=results.filter(r=>r.result==='Pass').length
  const failed=total-passed
  const avgPct=total?(results.reduce((a,r)=>a+r.pct,0)/total).toFixed(1):'0.0'
  const sorted=[...results].sort((a,b)=>b.pct-a.pct)
  const depts=[...new Set(students.map(s=>s.department))]
  const deptAvgs=depts.map(d=>{
    const ds=results.filter(r=>r.department===d)
    return{dept:d,avg:ds.length?parseFloat((ds.reduce((a,r)=>a+r.pct,0)/ds.length).toFixed(1)):0}
  })

  useChart(pfRef,{
    type:'doughnut',
    data:{labels:['Pass','Fail'],datasets:[{data:[passed,failed],backgroundColor:['#10b981','#ef4444'],borderWidth:0,hoverOffset:6}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false}}}
  },[passed,failed])

  useChart(deptRef,{
    type:'bar',
    data:{labels:deptAvgs.map(d=>d.dept),datasets:[{data:deptAvgs.map(d=>d.avg),backgroundColor:'rgba(99,102,241,0.65)',borderColor:'#6366f1',borderWidth:1,borderRadius:7}]},
    options:{responsive:true,maintainAspectRatio:false,
      scales:{y:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#475569'}},x:{grid:{display:false},ticks:{color:'#475569'}}},
      plugins:{legend:{display:false}}}
  },[JSON.stringify(deptAvgs)])

  const rankCls=['r1','r2','r3']

  return(
    <div>
      <div className="page-hdr"><h1>Analytics Dashboard</h1><p>Live performance overview — Target Coaching Academy</p></div>
      <div className="stats-row">
        {[
          {ic:'👥',val:total,lbl:'Total Students'},
          {ic:'📊',val:`${avgPct}%`,lbl:'Average Score'},
          {ic:'✅',val:passed,lbl:'Passed',sub:`${total?Math.round((passed/total)*100):0}% pass rate`,col:'var(--green)'},
          {ic:'❌',val:failed,lbl:'Failed',col:'var(--red)'},
          {ic:'🏆',val:sorted[0]?.name?.split(' ')[0]||'—',lbl:'Top Performer',sub:sorted[0]?`${sorted[0].pct}%`:''},
        ].map((s,i)=>(
          <div className="stat-card" key={i}>
            <div className="stat-ic">{s.ic}</div>
            <div className="stat-val" style={s.col?{color:s.col}:{}}>{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
            {s.sub&&<div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-ttl">Pass vs Fail Ratio</div>
          <div style={{display:'flex',gap:14,marginBottom:10,fontSize:12,color:'var(--text2)'}}>
            {['Pass','Fail'].map((l,i)=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                <span style={{width:9,height:9,borderRadius:2,background:i===0?'#10b981':'#ef4444',display:'inline-block'}}/>{l}
              </span>
            ))}
          </div>
          <div className="chart-box"><canvas ref={pfRef} role="img" aria-label="Pass vs Fail doughnut chart"/></div>
        </div>
        <div className="chart-card">
          <div className="chart-ttl">Avg Score by Department</div>
          <div className="chart-box"><canvas ref={deptRef} role="img" aria-label="Average score by department bar chart"/></div>
        </div>
      </div>
      <div className="toppers-card">
        <div className="chart-ttl" style={{marginBottom:'1rem'}}>Top Performers</div>
        {sorted.slice(0,3).length===0
          ?<p style={{color:'var(--text3)',fontSize:13}}>No students added yet.</p>
          :sorted.slice(0,3).map((s,i)=>(
            <div className="topper-item" key={s._id}>
              <div className={`t-rank ${rankCls[i]}`}>{i+1}</div>
              <div className="t-info">
                <div className="t-name">{s.name}</div>
                <div className="t-meta">{s.department} · Sem {s.semester}</div>
              </div>
              <span style={{fontFamily:'var(--mono)',fontWeight:700,color:'var(--accent)',marginRight:8}}>{s.pct}%</span>
              <span className={`grade ${gradeClass(s.grade)}`}>{s.grade}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT PROFILE
// ══════════════════════════════════════════════════════════════════════════════
function StudentProfile({student,onBack,onEdit,onSendResult}){
  const chartRef=useRef()
  const r=calcResult(student.marks)

  useChart(chartRef,{
    type:'bar',
    data:{
      labels: DEPARTMENT_SUBJECTS[student.department].map(k => SUBJ_LABELS[k]),

datasets: [{
  data: DEPARTMENT_SUBJECTS[student.department].map(k => student.marks[k] || 0),

  backgroundColor: DEPARTMENT_SUBJECTS[student.department].map(k =>
    (student.marks[k] || 0) >= 40
      ? 'rgba(99,102,241,0.7)'
      : 'rgba(239,68,68,0.65)'
  ),

  borderRadius: 6,
  borderWidth: 0
}]
    },
    options:{responsive:true,maintainAspectRatio:false,
      scales:{y:{beginAtZero:true,max:100,grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#475569'}},
              x:{grid:{display:false},ticks:{color:'#475569',font:{size:10}}}},
      plugins:{legend:{display:false}}}
  },[JSON.stringify(student.marks)])

  return(
    <div>
      <button className="back-btn" onClick={onBack}>← Back to Students</button>
      <div className="profile-card">
        <div className="profile-head">
          <div className="p-avatar">{initials(student.name)}</div>
          <div className="p-info">
            <h2>{student.name}</h2>
            <p>{student.studentId} · Roll: {student.rollNo} · {student.email}</p>
            <div className="p-badges">
              <span className={`badge ${r.result==='Pass'?'b-pass':'b-fail'}`}>{r.result}</span>
              <span className={`grade ${gradeClass(r.grade)}`}>{r.grade} Grade</span>
              <span style={{fontSize:11,color:'var(--text2)',padding:'3px 8px',background:'var(--surface2)',borderRadius:6}}>{student.department} · Sem {student.semester}</span>
            </div>
          </div>
          <div className="p-score">
            <div className="p-pct" style={{color:r.pct>=40?'var(--accent)':'var(--red)'}}>{r.pct}%</div>
            <div className="p-pct-lbl">Score</div>
            <div className="p-total">{r.total}/{r.max}</div>
          </div>
        </div>
        <div className="marks-cells">
          {DEPARTMENT_SUBJECTS[student.department].map(sub => {
  const mark = student.marks[sub] || 0
  return (
    <div className="mark-cell" key={sub}>
      <div className="mc-sub">{SUBJ_LABELS[sub]}</div>
      <div>
        <span className="mc-val">{mark}</span>
        <span className="mc-max">/100</span>
      </div>
      <div className="mc-bar">
        <div
          className="mc-fill"
          style={{
            width: `${mark}%`,
            background: mark >= 40
              ? 'linear-gradient(90deg,#3b82f6,#6366f1)'
              : '#ef4444'
          }}
        />
      </div>
    </div>
  )
})}
        </div>
        <div className="profile-actions">
          <button className="mail-btn" onClick={()=>onSendResult(student)}>✉ Send Result Email</button>
          <button className="act" onClick={()=>onEdit(student)}>Edit Marks</button>
        </div>
      </div>
      <div className="profile-card">
        <div className="chart-ttl" style={{marginBottom:'1rem'}}>Subject Performance Chart</div>
        <div className="p-chart-box"><canvas ref={chartRef} role="img" aria-label={`Subject marks for ${student.name}`}/></div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT MODAL
// ══════════════════════════════════════════════════════════════════════════════
function StudentModal({student,onSave,onClose,loading}){
  const isEdit=!!student?._id
  const [form,setForm]=useState({
    studentId:student?.studentId||'',name:student?.name||'',
    rollNo:student?.rollNo||'',email:student?.email||'',
    department:student?.department||'Science',semester:student?.semester||'I',
    marks:{Mathematics:student?.marks?.Mathematics??0,Science:student?.marks?.Science??0,
           English:student?.marks?.English??0,SocialStudies:student?.marks?.SocialStudies??0,
           ComputerSci:student?.marks?.ComputerSci??0,Hindi:student?.marks?.Hindi??0}
  })
  const set=(k,v)=>setForm(f=>({...f,[k]:v}))
  const setMark=(k,v)=>setForm(f=>({...f,marks:{...f.marks,[k]:Math.min(100,Math.max(0,parseInt(v)||0))}}))
  const r=calcResult(form.marks)

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <h2>{isEdit?'Edit Student':'Add New Student'}</h2>
        <p className="m-sub">Fill in student details and marks. Result is calculated automatically.</p>
        <div className="form-grid">
          <div className="field"><label>Student ID</label><input value={form.studentId} onChange={e=>set('studentId',e.target.value)} placeholder="TCA-2024-001" disabled={isEdit}/></div>
          <div className="field"><label>Full Name</label><input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Riya Sharma"/></div>
          <div className="field"><label>Roll No</label><input value={form.rollNo} onChange={e=>set('rollNo',e.target.value)} placeholder="S-101"/></div>
          <div className="field"><label>Student Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="student@gmail.com"/></div>
          <div className="field"><label>Department</label>
            <select
  value={form.department}
  onChange={e => {
    const dept = e.target.value
    setForm(f => ({
      ...f,
      department: dept,
      marks: DEPARTMENT_SUBJECTS[dept].reduce((acc, sub) => {
        acc[sub] = 0
        return acc
      }, {})
    }))
  }}
>
              {DEPTS.map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field"><label>Semester</label>
            <select value={form.semester} onChange={e=>set('semester',e.target.value)}>
              {SEMS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="full marks-section">
            <label>Subject Marks (out of 100)</label>
            <div className="marks-grid-6">
             {DEPARTMENT_SUBJECTS[form.department].map(sub => (
                <div key={sub}>
                  <div className="mf-label">{SUBJ_LABELS[sub]}</div>
                  <input className="mf-input" type="number" min={0} max={100} value={form.marks[sub]} onChange={e=>setMark(sub,e.target.value)}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="preview-bar">
          <span style={{color:'var(--text2)',fontSize:12}}>Live Preview:</span>
          <span style={{fontFamily:'var(--mono)',fontWeight:700}}>{r.pct}%</span>
          <span className={`grade ${gradeClass(r.grade)}`}>{r.grade}</span>
          <span className={`badge ${r.result==='Pass'?'b-pass':'b-fail'}`}>{r.result}</span>
          <span style={{color:'var(--text3)',marginLeft:'auto',fontSize:12}}>{r.total}/{r.max} marks</span>
        </div>
        <div className="m-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>onSave(form)} disabled={loading}>
            {loading?<><span className="spinner"/> Saving...</>:'Save & Calculate Result'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENTS PAGE
// ══════════════════════════════════════════════════════════════════════════════
function StudentsPage({students,loading,isAdmin,onAdd,onEdit,onDelete,onSendResult,onViewProfile}){
  const [search,setSearch]=useState('')
  const [deptF,setDeptF]=useState('')
  const [semF,setSemF]=useState('')

  const filtered=students.filter(s=>
    (!search||s.name.toLowerCase().includes(search.toLowerCase())||s.rollNo?.toLowerCase().includes(search.toLowerCase()))&&
    (!deptF||s.department===deptF)&&
    (!semF||s.semester===semF)
  )

  return(
    <div>
      <div className="page-hdr"><h1>Student Records</h1><p>Manage all student data, marks and results</p></div>
      <div className="toolbar">
        <input className="search-inp" placeholder="Search by name or roll no..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="filter-sel" value={deptF} onChange={e=>setDeptF(e.target.value)}>
          <option value="">All Departments</option>{DEPTS.map(d=><option key={d}>{d}</option>)}
        </select>
        <select className="filter-sel" value={semF} onChange={e=>setSemF(e.target.value)}>
          <option value="">All Semesters</option>{SEMS.map(s=><option key={s}>{s}</option>)}
        </select>
        <button className="add-btn" onClick={onAdd}>+ Add Student</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Roll No</th><th>Dept</th><th>Sem</th><th>%</th><th>Grade</th><th>Result</th><th>Actions</th></tr></thead>
          <tbody>
            {loading&&<tr><td colSpan={9} style={{textAlign:'center',padding:'2rem'}}><span className="spinner"/></td></tr>}
            {!loading&&filtered.length===0&&<tr className="empty-row"><td colSpan={9}>No students found. Click "+ Add Student" to begin.</td></tr>}
            {!loading&&filtered.map(s=>{
              const r=calcResult(s.marks)
              return(
                <tr key={s._id}>
                  <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text3)'}}>{s.studentId}</td>
                  <td><button className="act view" style={{border:'none',background:'none',padding:0,fontWeight:600,fontSize:13,cursor:'pointer'}} onClick={()=>onViewProfile(s)}>{s.name}</button></td>
                  <td style={{fontFamily:'var(--mono)',fontSize:12}}>{s.rollNo}</td>
                  <td style={{fontSize:12}}>{s.department}</td>
                  <td style={{fontSize:12}}>{s.semester}</td>
                  <td style={{fontFamily:'var(--mono)',fontWeight:700}}>{r.pct}%</td>
                  <td><span className={`grade ${gradeClass(r.grade)}`}>{r.grade}</span></td>
                  <td><span className={`badge ${r.result==='Pass'?'b-pass':'b-fail'}`}>{r.result}</span></td>
                  <td><div className="acts">
                    <button className="act view" onClick={()=>onViewProfile(s)}>View</button>
                    <button className="act" onClick={()=>onEdit(s)}>Edit</button>
                    {isAdmin&&<button className="act del" onClick={()=>onDelete(s)}>Delete</button>}
                    <button className="act mail" onClick={()=>onSendResult(s)}>Email</button>
                  </div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MANAGE USERS (Admin only)
// ══════════════════════════════════════════════════════════════════════════════
function ManageUsers({token,showToast}){
  const [users,setUsers]=useState([])
  const [loading,setLoading]=useState(true)
  const [showModal,setShowModal]=useState(false)
  const [form,setForm]=useState({name:'',email:'',role:'Faculty'})
  const [saving,setSaving]=useState(false)

  const load=useCallback(async()=>{
    setLoading(true)
    const data=await api.getUsers(token)
    setUsers(Array.isArray(data)?data:[])
    setLoading(false)
  },[token])

  useEffect(()=>{load()},[load])

  async function handleAdd(){
    if(!form.name||!form.email){showToast('Name and email are required','⚠');return}
    setSaving(true)
    const res=await api.addUser(token,form)
    setSaving(false)
    if(res.error){showToast(res.error,'❌');return}
    showToast(`${form.name} added as ${form.role}`,'✓')
    setShowModal(false)
    setForm({name:'',email:'',role:'Faculty'})
    load()
  }

  async function handleDelete(u){
    if(!confirm(`Remove ${u.name} (${u.role}) from the system?`)) return
    await api.deleteUser(token,u._id)
    showToast(`${u.name} removed`,'🗑')
    load()
  }

  return(
    <div>
      <div className="page-hdr"><h1>Manage Users</h1><p>Add or remove authorized Admin & Faculty accounts</p></div>
      <div className="users-wrap">
        <div className="users-hdr">
          <h3>Authorized Users ({users.length})</h3>
          <button className="add-btn" onClick={()=>setShowModal(true)}>+ Add User</button>
        </div>
        <div className="tbl-wrap" style={{border:'none'}}>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Added On</th><th>Action</th></tr></thead>
            <tbody>
              {loading&&<tr><td colSpan={5} style={{textAlign:'center',padding:'2rem'}}><span className="spinner"/></td></tr>}
              {!loading&&users.length===0&&<tr className="empty-row"><td colSpan={5}>No users yet.</td></tr>}
              {!loading&&users.map(u=>(
                <tr key={u._id}>
                  <td style={{fontWeight:600}}>{u.name}</td>
                  <td style={{fontSize:12,fontFamily:'var(--mono)',color:'var(--text2)'}}>{u.email}</td>
                  <td><span className={`role-tag ${u.role==='Admin'?'role-admin':'role-faculty'}`}>{u.role}</span></td>
                  <td style={{fontSize:11,color:'var(--text3)'}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><button className="act del" onClick={()=>handleDelete(u)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal" style={{maxWidth:420}}>
            <h2>Add Authorized User</h2>
            <p className="m-sub">This person will receive an OTP on their email to log in.</p>
            <div className="field"><label>Full Name</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Dr. Riya Sharma"/></div>
            <div className="field"><label>Email Address</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="faculty@gmail.com"/></div>
            <div className="field"><label>Role</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="m-actions">
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>
                {saving?<><span className="spinner"/> Adding...</>:'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
function App({user,token,onLogout}){
  const [page,setPage]=useState('dashboard')
  const [students,setStudents]=useState([])
  const [studLoading,setStudLoading]=useState(true)
  const [modalOpen,setModalOpen]=useState(false)
  const [editStudent,setEditStudent]=useState(null)
  const [savingStudent,setSavingStudent]=useState(false)
  const [profileStudent,setProfileStudent]=useState(null)
  const {toast,showToast}=useToast()
  const isAdmin=user.role==='Admin'

  const loadStudents=useCallback(async()=>{
    setStudLoading(true)
    const data=await api.getStudents(token)
    setStudents(Array.isArray(data)?data:[])
    setStudLoading(false)
  },[token])

  useEffect(()=>{loadStudents()},[loadStudents])

  async function handleSaveStudent(form){
    if(!form.studentId||!form.name||!form.rollNo){showToast('Student ID, Name and Roll No are required','⚠');return}
    setSavingStudent(true)
    let res
    if(editStudent?._id) res=await api.updateStudent(token,editStudent._id,form)
    else res=await api.addStudent(token,form)
    setSavingStudent(false)
    if(res.error){showToast(res.error,'❌');return}
    showToast(editStudent?._id?`${form.name} updated`:`${form.name} added successfully`,'✓')
    setModalOpen(false);setEditStudent(null)
    loadStudents()
  }

  async function handleDelete(s){
    if(!confirm(`Delete ${s.name}? This cannot be undone.`)) return
    const res=await api.deleteStudent(token,s._id)
    if(res.error){showToast(res.error,'❌');return}
    showToast(`${s.name} deleted`,'🗑')
    loadStudents()
  }

  async function handleSendResult(s){
    if(!s.email){showToast('No email address for this student','⚠');return}
    showToast('Sending result email...','⏳')
    const res=await api.sendResult(token,s._id)
    if(res.success) showToast(`Result emailed to ${s.email}`,'✉')
    else showToast(res.error||'Failed to send email','❌')
  }

  function navTo(id){setPage(id);setProfileStudent(null)}

  const tabs=[
    {id:'dashboard',label:'Dashboard'},
    {id:'students',label:'Students'},
    ...(isAdmin?[{id:'users',label:'Manage Users'}]:[]),
  ]

  return(
    <>
      <style>{css}</style>
      <div className="app">
        <div className="topbar">
          <div className="tb-left">
            <div className="tb-logo">
              <div className="tb-em">T</div>
              <div className="tb-name">Target Academy</div>
            </div>
            <div className="nav">
              {tabs.map(t=>(
                <button key={t.id} className={`nav-btn${page===t.id?' active':''}`} onClick={()=>navTo(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
          <div className="tb-right">
            <div className="user-chip">
              <div className="online-dot"/>
              <span style={{fontSize:12}}>{user.name}</span>
              <span className={`role-tag ${isAdmin?'role-admin':'role-faculty'}`}>{user.role}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <div className="content">
          {page==='dashboard'&&<Dashboard students={students}/>}
          {page==='students'&&!profileStudent&&(
            <StudentsPage students={students} loading={studLoading} isAdmin={isAdmin}
              onAdd={()=>{setEditStudent(null);setModalOpen(true)}}
              onEdit={s=>{setEditStudent(s);setModalOpen(true)}}
              onDelete={handleDelete} onSendResult={handleSendResult}
              onViewProfile={s=>{setProfileStudent(s)}}/>
          )}
          {page==='students'&&profileStudent&&(
            <StudentProfile student={profileStudent} isAdmin={isAdmin}
              onBack={()=>setProfileStudent(null)}
              onEdit={s=>{setEditStudent(s);setProfileStudent(null);setModalOpen(true)}}
              onSendResult={handleSendResult}/>
          )}
          {page==='users'&&isAdmin&&<ManageUsers token={token} showToast={showToast}/>}
        </div>
      </div>

      {modalOpen&&(
        <StudentModal student={editStudent} onSave={handleSaveStudent}
          onClose={()=>{setModalOpen(false);setEditStudent(null)}} loading={savingStudent}/>
      )}
      <div className={`toast ${toast.show?'show':'hidden'}`}>
        <span style={{fontSize:15,flexShrink:0}}>{toast.icon}</span>{toast.msg}
      </div>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function Home(){
  const [authed,setAuthed]=useState(false)
  const [user,setUser]=useState(null)
  const [token,setToken]=useState(null)

  useEffect(()=>{
    const t=sessionStorage.getItem('tca_token')
    const u=sessionStorage.getItem('tca_user')
    if(t&&u){setToken(t);setUser(JSON.parse(u));setAuthed(true)}
  },[])

  function handleLogin(u,t){setUser(u);setToken(t);setAuthed(true)}
  function handleLogout(){
    sessionStorage.removeItem('tca_token')
    sessionStorage.removeItem('tca_user')
    setAuthed(false);setUser(null);setToken(null)
  }

  if(!authed) return <AuthScreen onLogin={handleLogin}/>
  return <App user={user} token={token} onLogout={handleLogout}/>
}
