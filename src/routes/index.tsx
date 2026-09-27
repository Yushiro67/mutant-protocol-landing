import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Github, Instagram, Linkedin, Menu, Play, Radio, Shield, Volume2, VolumeX, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/comic-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "MUTANT PROTOCOL: The Bennett Initiative | GFG Bennett" },
    { name: "description", content: "A 36-hour hackathon and tech summit from GeeksForGeeks Student Chapter, Bennett University. Explore the mission, tracks, timeline, and squad registration." },
    { property: "og:title", content: "MUTANT PROTOCOL: The Bennett Initiative" },
    { property: "og:description", content: "Evolve or fall behind. Join the 36-hour hackathon and tech summit at Bennett University." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const tracks = [
  { id: "ai-robotics", code: "01", name: "AI & ROBOTICS", hero: "IRON MAN / TONY STARK", accent: "cyan", description: "Build intelligent systems that think, move, and make an impact in the real world.", stack: "Python · PyTorch · ROS · OpenCV", prize: "Track distinction + prize pool eligibility" },
  { id: "cybersecurity", code: "02", name: "CYBERSECURITY", hero: "WOLVERINE / LOGAN", accent: "crimson", description: "Defend tomorrow's digital world. Find vulnerabilities and engineer resilient systems.", stack: "Kali Linux · Burp Suite · Wireshark · Rust", prize: "Track distinction + prize pool eligibility" },
  { id: "neural", code: "03", name: "NEURAL INTERFACES", hero: "PROFESSOR X / JEAN GREY", accent: "violet", description: "Decode human-machine interaction through neural networks and brain-computer interfaces.", stack: "TensorFlow · MNE · Python · EEG", prize: "Track distinction + prize pool eligibility" },
  { id: "cloud", code: "04", name: "CLOUD & COMPUTE", hero: "THOR / STORM", accent: "cyan", description: "Architect systems with the scale and force to withstand any storm.", stack: "AWS · Kubernetes · Docker · Go", prize: "Track distinction + prize pool eligibility" },
  { id: "spatial", code: "05", name: "SPATIAL COMPUTING", hero: "SCARLET WITCH / DOCTOR STRANGE", accent: "amber", description: "Bend the boundaries of reality with immersive web, AR/VR, and decentralized experiences.", stack: "Three.js · Unity · Solidity · WebXR", prize: "Track distinction + prize pool eligibility" },
] as const;

const schedule = [
  { label: "DAY 01", title: "GENESIS", entries: [["09:00", "Arrival & clearance"], ["10:30", "Opening transmission"], ["12:00", "Challenge reveal & squad formation"], ["14:00", "The build begins"], ["19:00", "Mentor checkpoints"]] },
  { label: "DAY 02", title: "THE CRUCIBLE", entries: [["00:00", "Midnight build sprint"], ["09:00", "Fuel up & field check"], ["11:00", "Danger Room coding battles"], ["15:00", "Prototype review"], ["21:00", "Final sprint"]] },
  { label: "DAY 03", title: "ENDGAME", entries: [["08:00", "Submission lock"], ["09:30", "Project showcases"], ["12:00", "Jury deliberation"], ["14:00", "Winners & closing assembly"]] },
] as const;

const faqs = [
  ["Who can join the initiative?", "Students from any college or university are welcome. Coders, designers, builders, and first-time hackers all belong here."],
  ["How many people can be in a squad?", "Form a squad of 1 to 4 people. You can register with a team name now and finalize your roster with the organizers."],
  ["Where does the event take place?", "The event is hosted at Bennett University, Greater Noida. Exact on-campus venue details will be shared with registered participants."],
  ["Will accommodation be provided?", "Accommodation details have not been confirmed yet. Registered participants will receive logistical updates from the organizers."],
  ["What should I bring?", "Bring your laptop, charger, student ID, and whatever you need to create comfortably. Specific hardware needs depend on your chosen track."],
];

const nav = [["Intel", "#intel"], ["Mentors", "#mentors"], ["Timeline", "#timeline"], ["Dossier", "#dossier"], ["Prizes", "#prizes"], ["FAQ", "#faq"]];
const emptyForm = { name: "", email: "", roll_number: "", track: "", team_name: "", portfolio_url: "" };
const EVENT_DATE = new Date("2026-11-14T09:00:00+05:30"); // Provisional launch date; replace when organizers confirm.
function timeLeft() {
  const diff = Math.max(0, EVENT_DATE.getTime() - Date.now());
  return [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [audio, setAudio] = useState(false);
  const [soundContext, setSoundContext] = useState<AudioContext | null>(null);
  const [clock, setClock] = useState<number[] | null>(null);
  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState<number | null>(null);
  const [day, setDay] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [teaser, setTeaser] = useState(false);

  useEffect(() => { setClock(timeLeft()); const interval = window.setInterval(() => setClock(timeLeft()), 1000); return () => window.clearInterval(interval); }, []);
  useEffect(() => () => { if (soundContext) void soundContext.close(); }, [soundContext]);
  function playPop() {
    if (!audio || typeof window === "undefined") return;
    const ctx = soundContext ?? new window.AudioContext();
    if (!soundContext) setSoundContext(ctx);
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = "triangle"; osc.frequency.setValueAtTime(220, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + .12);
    gain.gain.setValueAtTime(.035, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .13);
    osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .14);
  }
  useEffect(() => { if (!pulse) return; const timer = window.setTimeout(() => setPulse(false), 1000); return () => clearTimeout(timer); }, [pulse]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setFormError("");
    if (!form.track) { setFormError("Select a track to continue."); return; }
    if (!/^https?:\/\//i.test(form.portfolio_url)) { setFormError("Enter a full portfolio URL starting with https://"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("event_registrations").insert({ name: form.name.trim(), email: form.email.trim(), roll_number: form.roll_number.trim(), track: form.track, team_name: form.team_name.trim(), portfolio_url: form.portfolio_url.trim() });
    setSubmitting(false);
    if (error) { setFormError("Transmission failed. Please try again in a moment."); return; }
    setSuccess(true); setForm(emptyForm);
  }
  const update = (key: keyof typeof emptyForm, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const currentTrack = tracks[selected] ?? tracks[0];
  const currentDay = schedule[day] ?? schedule[0];
  const modalTrack = modal === null ? null : (tracks[modal] ?? tracks[0]);
  if (!currentTrack || !currentDay) return null;

  return <div className="site-shell" onClick={playPop}>
    <div className={pulse ? "cerebro-wave active" : "cerebro-wave"} aria-hidden="true" />
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Mutant Protocol home"><span className="brand-emblem">M<span>✕</span></span><span className="brand-text"><strong>MUTANT<br/>PROTOCOL</strong><small>GFG STUDENT CHAPTER · BENNETT</small></span></a>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">{nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <div className="header-actions"><Button variant="ghost" size="icon" className="audio-button" onClick={() => setAudio(!audio)} aria-label={audio ? "Mute comic sound effects" : "Enable comic sound effects"} title={audio ? "Mute sound effects" : "Enable sound effects"}>{audio ? <Volume2/> : <VolumeX/>}</Button><Button asChild className="button-primary header-cta"><a href="#register">INITIATE PROTOCOL <ArrowUpRight/></a></Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</Button></div>
    </header>

    <main id="top">
      <section className="hero"><div className="hero-content wrap">
        <div className="cover-masthead"><div className="cover-edition"><span>VOL. 01 / ISSUE NO. 001</span><span>GEEKSFORGEEKS STUDENT CHAPTER · BENNETT UNIVERSITY</span></div><div className="cover-title"><strong>MUTANT <span>PROTOCOL</span></strong><div className="cover-seal"><span>THE BENNETT</span><b>INITIATIVE</b><span>EST. 2026</span></div></div><div className="cover-rule"><span>THE 36-HOUR HACKATHON & TECH SUMMIT</span><span>25¢ · COLLECTOR'S EDITION</span></div></div>
        <div className="cover-grid"><div className="cover-art"><img src={hero} alt="Ink illustration of student builders facing a mysterious signal" width={1600} height={1104}/><div className="cover-caption">A NEW GENERATION IS ASSEMBLING. THE FUTURE WON'T BUILD ITSELF.</div><div className="cover-headline"><small>THE AWAKENING / CHAPTER ONE</small><h1>EVOLVE <em>OR</em><br/>FALL BEHIND<span>.</span></h1></div></div><div className="cover-sidebar"><div className="cover-clock"><span className="issue-label">THE COUNTDOWN BEGINS</span><div className="countdown-numbers">{(clock ?? [0,0,0,0]).map((v, i) => <div key={i}><strong>{String(v).padStart(2,"0")}</strong><small>{["DAYS", "HOURS", "MIN", "SEC"][i]}</small></div>)}</div><small className="provisional">14 NOV 2026 · PROVISIONAL DATE</small></div><div className="cover-story"><span className="issue-label">THIS ISSUE / THE MISSION</span><p>36 hours to build what comes next. Coders, designers and tech mutants: your story starts here.</p><div className="cover-story-actions"><Button asChild className="button-primary"><a href="#register">REGISTER YOUR SQUAD <ArrowUpRight/></a></Button><Button variant="outline" className="button-outline" onClick={() => setTeaser(true)}>READ THE BRIEF <ArrowRight/></Button></div></div><div className="cover-stamp">NO MORE<br/>ORDINARY.</div></div></div>
        <div className="cover-footer"><span>BENNETT UNIVERSITY · GREATER NOIDA</span><span>TURN THE PAGE ↓</span></div>
      </div></section>

      <section id="intel" className="section intel-section wrap"><div className="section-heading"><div><p className="section-index">CHAPTER 01 / MISSION INTEL</p><h2>THE FUTURE IS <em>NOT</em><br/>BUILT ALONE.</h2></div><p className="section-intro">This is more than a hackathon. It’s a test of imagination, engineering, and the people you build with. Choose your mission. Assemble your squad. Make it real.</p></div>
        <div className="intel-grid"><div className="intel-card big"><div className="card-top"><span>01 / DURATION</span><Zap size={20}/></div><div><strong className="stat">36<span>H</span></strong><h3>NON-STOP CREATION</h3><p>One relentless window to turn your wildest idea into a working reality.</p></div><span className="card-corner">↗</span></div><div className="intel-card prize-card" id="prizes"><div className="card-top"><span>02 / REWARDS</span><span className="amber-text">✳</span></div><div><strong className="stat">₹1L<span>+</span></strong><h3>PRIZE POOL</h3><p>Plus exclusive Stark Industries-tier swag for the makers who go beyond.</p></div><span className="card-corner">↗</span></div><div className="intel-card"><div className="card-top"><span>03 / GUIDANCE</span><span>✦</span></div><div><strong className="card-word">REAL<br/>MENTORS.</strong><h3>INDUSTRY TITANS</h3><p>Expert guidance and honest feedback from people who build for a living.</p></div><span className="card-corner">↗</span></div><div className="intel-card"><div className="card-top"><span>04 / EXPERIENCE</span><Shield size={20}/></div><div><strong className="card-word">THE DANGER<br/>ROOM.</strong><h3>BATTLES & CONNECTIONS</h3><p>High-stakes coding challenges, electric energy, and a network that lasts.</p></div><span className="card-corner">↗</span></div></div>
      </section>

      <section id="mentors" className="mentor-band"><div className="wrap mentor-inner"><div><p className="section-index">SPECIAL FEATURE / THE ALLIES</p><h2>NO HERO<br/>BUILDS ALONE.</h2></div><div className="mentor-copy"><div className="mentor-symbol">✳</div><p>Meet the minds behind the mission. Industry builders, technical mentors, and creative problem-solvers will be on the ground to challenge your thinking and sharpen your ideas.</p><span>MENTOR ANNOUNCEMENTS INCOMING <ArrowRight size={16}/></span></div></div></section>

      <section id="dossier" className="section dossier-section"><div className="wrap"><div className="section-heading dossier-heading"><div><p className="section-index">CHAPTER 02 / THE DOSSIERS</p><h2>CHOOSE YOUR<br/><em>EVOLUTION.</em></h2></div><p className="section-intro">Five domains. Infinite possibilities. Select a dossier to uncover your mission.</p></div><div className="dossier-layout"><div className={`dossier-feature dossier-${currentTrack.accent}`}><div className="dossier-graphic"><span className="dossier-graphic-number">{currentTrack.code}</span><span className="dossier-burst">{["THINK.", "DEFEND.", "CONNECT.", "SCALE.", "BEND."][selected]}</span></div><div className="feature-shade"/><div className="feature-content"><span className="image-label">ISSUE #{currentTrack.code} <b>25¢</b></span><div><p>INSPIRED BY {currentTrack.hero}</p><h3>{currentTrack.name}</h3><Button className="button-primary" onClick={() => setModal(selected)}>OPEN THIS ISSUE <ArrowUpRight/></Button><div className="comic-barcode" aria-hidden="true">▮▮ ▮ ▮▮▮ ▮ ▮▮ ▮▮▮</div></div></div></div><div className="dossier-list">{tracks.map((track, i) => <Button variant="ghost" key={track.id} onClick={() => setSelected(i)} className={`dossier-row ${selected === i ? "selected" : ""}`}><span className="row-number">{track.code}</span><span className="row-info"><strong>{track.name}</strong><small>{track.hero}</small></span><ArrowUpRight className="row-arrow"/></Button>)}<div className="dossier-pagination"><span>ISSUE 0{selected + 1} <i>/</i> 05</span><div><Button variant="outline" size="icon" aria-label="Previous dossier" onClick={() => setSelected((selected + tracks.length - 1) % tracks.length)}><ChevronLeft/></Button><Button variant="outline" size="icon" aria-label="Next dossier" onClick={() => setSelected((selected + 1) % tracks.length)}><ChevronRight/></Button></div></div></div></div></div></section>

      <section id="timeline" className="section timeline-section wrap"><div className="section-heading"><div><p className="section-index">CHAPTER 03 / DANGER ROOM</p><h2>EVERY SECOND<br/><em>COUNTS.</em></h2></div><p className="section-intro">From your first idea to the final reveal, here's how the mission unfolds.</p></div><div className="timeline-panel"><div className="day-tabs" role="tablist" aria-label="Event days">{schedule.map((d,i) => <Button key={d.label} role="tab" aria-selected={day===i} variant="ghost" className={day===i ? "day-tab active" : "day-tab"} onClick={() => setDay(i)}><span>ISSUE #{i+1} / {d.label}</span><strong>{d.title}</strong></Button>)}</div><div className="timeline-content"><div className="timeline-title"><span>SERIALIZED CHAPTER / ISSUE #{day+1}</span><h3>{currentDay.title}</h3><p>THE PROTOCOL IS IN MOTION.</p></div><div className="timeline-events">{currentDay.entries.map(([time, title], i) => <div className="timeline-event" key={i}><span className="event-time">{time}</span><span className="event-node"/><strong>{title}</strong><ArrowUpRight size={17}/></div>)}</div></div></div><p className="timeline-note">* Schedule is indicative and subject to organizer confirmation.</p></section>

      <section id="register" className="section registration-section"><div className="wrap"><div className="section-heading"><div><p className="section-index">CHAPTER 04 / REGISTRATION BUREAU</p><h2>YOUR SQUAD.<br/><em>YOUR LEGACY.</em></h2></div><p className="section-intro">Your clearance starts here. Tell us who you are, what you build, and where you belong.</p></div><div className="registration-layout"><form className="terminal-form" onSubmit={submit}><div className="terminal-head"><span><span className="live-dot"/> SECURE TRANSMISSION</span><span>FILE NO. 001 / CLASSIFIED</span></div><div className="form-grid"><label>01 / MUTANT ALIAS / NAME<input required minLength={2} maxLength={120} value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your full name"/></label><label>02 / COLLEGE EMAIL<input type="email" required maxLength={254} value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@university.edu"/></label><label>03 / UNIVERSITY ROLL NO.<input required minLength={2} maxLength={80} value={form.roll_number} onChange={e=>update("roll_number",e.target.value)} placeholder="Your student ID"/></label><label>04 / SELECTED TRACK<select required value={form.track} onChange={e=>update("track",e.target.value)}><option value="">Select your mission</option>{tracks.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label>05 / SQUAD / TEAM NAME<input required minLength={2} maxLength={120} value={form.team_name} onChange={e=>update("team_name",e.target.value)} placeholder="Your squad name"/></label><label>06 / GITHUB / PORTFOLIO URL<input type="url" required maxLength={500} value={form.portfolio_url} onChange={e=>update("portfolio_url",e.target.value)} placeholder="https://github.com/you"/></label></div>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="form-footer"><p>BY SUBMITTING, YOU REQUEST ACCESS TO THE INITIATIVE.</p><Button className="button-primary button-large" disabled={submitting} type="submit">{submitting ? "TRANSMITTING..." : "REQUEST CLEARANCE"} <ArrowUpRight/></Button></div></form><div className="id-area"><div className="id-card"><span className="approval-stamp">PENDING<br/>CLEARANCE</span><div className="id-top"><span>M<span>✕</span></span><span>GFG // BENNETT<br/>IDENTITY DIVISION</span></div><div className="id-avatar">{form.name ? form.name.trim().slice(0,1).toUpperCase() : "?"}<span className="avatar-ring"/></div><div className="id-details"><small>AGENT IDENTITY</small><strong>{form.name.trim() || "UNKNOWN AGENT"}</strong><small>ASSIGNED DIVISION</small><span>{tracks.find(t=>t.id===form.track)?.name || "AWAITING ASSIGNMENT"}</span></div><div className="id-bottom"><span>STATUS: PENDING CLEARANCE</span><span>▥ ▥▥ ▥ ▥▥▥</span></div></div><p><span className="live-dot"/> LIVE IDENTITY PREVIEW <span>— YOUR DATA UPDATES IN REAL TIME</span></p></div></div></div></section>

      <section id="faq" className="section faq-section wrap"><div className="faq-heading"><p className="section-index">BACK PAGES / FREQUENCY CHECK</p><h2>QUESTIONS FROM<br/><em>THE MULTIVERSE.</em></h2><p>Everything you need to know before stepping into the arena.</p></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${faq===i ? "expanded" : ""}`} key={q}><Button variant="ghost" aria-expanded={faq===i} onClick={()=>setFaq(faq===i?null:i)}><span className="faq-number">0{i+1}</span><strong>{q}</strong><ChevronDown/></Button>{faq===i && <p>{a}</p>}</div>)}</div></section>
    </main>
    <footer className="footer"><div className="wrap"><div className="footer-main"><div><a href="#top" className="footer-title">MUTANT<br/><span>PROTOCOL.</span></a><p>Built for the ones who dare to become more.<br/>GeeksForGeeks Student Chapter · Bennett University</p></div><div className="footer-right"><span>STAY CONNECTED</span><div className="socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a><a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a><a href="https://discord.com/" target="_blank" rel="noreferrer" aria-label="Discord"><AudioLines/></a></div><Button variant="outline" className="cerebro-button" onClick={()=>setPulse(true)}>✳ &nbsp; ACTIVATE CEREBRO</Button></div></div><div className="footer-bottom"><span>© 2026 GFG BENNETT STUDENT CHAPTER</span><span>FAN-MADE EVENT EXPERIENCE BY GFG BENNETT STUDENT CHAPTER. NOT AFFILIATED WITH MARVEL.</span><a href="#top">BACK TO TOP ↑</a></div></div></footer>

    {modalTrack && <div className="modal-backdrop" onMouseDown={()=>setModal(null)} role="presentation"><div className="dossier-modal" role="dialog" aria-modal="true" aria-label={`${modalTrack.name} dossier`} onMouseDown={e=>e.stopPropagation()}><div className={`modal-image dossier-${modalTrack.accent}`}><span className="modal-issue">ISSUE #{modalTrack.code} · 25¢</span><strong>{modalTrack.name}</strong><span className="comic-barcode" aria-hidden="true">▮▮ ▮ ▮▮▮ ▮ ▮▮ ▮▮▮</span></div><div className="modal-info"><Button variant="ghost" size="icon" className="modal-close" onClick={()=>setModal(null)} aria-label="Close dossier"><X/></Button><p className="section-index">CLASSIFIED INTEL / TRACK {modalTrack.code}</p><h2>{modalTrack.name}</h2><p className="modal-hero">INSPIRED BY {modalTrack.hero}</p><p className="modal-description">{modalTrack.description}</p><div className="modal-data"><small>RECOMMENDED TECH STACK</small><strong>{modalTrack.stack}</strong></div><div className="modal-data"><small>RECOGNITION</small><strong>{modalTrack.prize}</strong></div><Button asChild className="button-primary" onClick={()=>setModal(null)}><a href="#register">CHOOSE THIS TRACK <ArrowUpRight/></a></Button></div></div></div>}
    {success && <div className="modal-backdrop" role="presentation"><div className="success-modal" role="dialog" aria-modal="true" aria-label="Registration successful"><div className="success-icon"><Check/></div><p className="section-index">TRANSMISSION RECEIVED</p><h2>CLEARANCE<br/>GRANTED.</h2><p>Welcome to the Initiative. Your registration is on file. Stay tuned for the next transmission from the organizers.</p><Button className="button-primary" onClick={()=>setSuccess(false)}>RETURN TO THE MISSION <ArrowRight/></Button></div></div>}
    {teaser && <div className="modal-backdrop" onMouseDown={()=>setTeaser(false)} role="presentation"><div className="brief-modal" role="dialog" aria-modal="true" aria-label="Mission brief" onMouseDown={e=>e.stopPropagation()}><Button variant="ghost" size="icon" className="modal-close" onClick={()=>setTeaser(false)} aria-label="Close brief"><X/></Button><CircleHelp className="brief-icon"/><p className="section-index">MISSION BRIEF / THE BENNETT INITIATIVE</p><h2>THE FUTURE NEEDS<br/>A NEW KIND OF HERO.</h2><p>36 hours. Five frontier tracks. One chance to build something extraordinary with your squad at Bennett University. The mission starts with you.</p><Button asChild className="button-primary" onClick={()=>setTeaser(false)}><a href="#intel">EXPLORE THE MISSION <ArrowRight/></a></Button></div></div>}
  </div>;
}
