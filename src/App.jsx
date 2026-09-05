import { createElement, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Coins,
  Headphones,
  Heart,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Plus,
  Quote,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  Wallet,
  X,
} from 'lucide-react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'My assets', path: '/coins' },
  { label: 'Community', path: '/chat' },
]

const assets = [
  { name: 'Solstice Solar', type: 'Clean energy', value: '$4,820.40', change: '+12.8%', color: 'sun', icon: Leaf },
  { name: 'Common Ground', type: 'Urban farming', value: '$2,140.00', change: '+7.4%', color: 'green', icon: Sprout },
  { name: 'Tideway Homes', type: 'Affordable housing', value: '$1,560.80', change: '+4.9%', color: 'blue', icon: Heart },
]

function Logo({ dark = false }) {
  return (
    <Link to="/" className={`logo ${dark ? 'logo-dark' : ''}`}>
      <span className="logo-mark"><span /></span>
      <span>zen<span>heaven</span></span>
    </Link>
  )
}

function Pill({ children, className = '' }) {
  return <span className={`pill ${className}`}>{children}</span>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/books" element={<Books />} />
        <Route path="/music" element={<Music />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/coins" element={<CoinsPage />} />
      </Route>
    </Routes>
  )
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main className="landing">
      <header className="landing-nav container">
        <Logo />
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`landing-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="#why">Why ZenHeaven</a>
          <a href="#how">How it works</a>
          <a href="#assets">Explore assets</a>
          <Link to="/login" className="nav-login">Log in <ArrowRight size={15} /></Link>
          <Link to="/register" className="button button-dark button-small">Start investing <ArrowRight size={15} /></Link>
        </nav>
      </header>

      <section className="hero container">
        <div className="hero-copy">
          <Pill><span className="live-dot" /> A calmer way to own what matters</Pill>
          <h1>Real things.<br /><em>Real ownership.</em><br />Reimagined.</h1>
          <p className="hero-lead">ZenHeaven turns the world around you into a portfolio you can feel good about. Own a piece of solar farms, thriving neighborhoods, and the future they make possible.</p>
          <div className="hero-actions">
            <Link to="/register" className="button button-accent">Explore the collection <ArrowUpRight /></Link>
            <a href="#how" className="text-link">See how it works <ArrowDownRight size={17} /></a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack"><span>AK</span><span>SM</span><span>JT</span><span>+</span></div>
            <div><strong>12,400+ people</strong><small>are building a better tomorrow</small></div>
          </div>
        </div>
        <div className="hero-art" aria-label="ZenHeaven portfolio preview">
          <div className="art-glow" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="asset-preview-card main-card">
            <div className="card-top"><span className="mini-icon sun-bg"><Leaf size={17} /></span><span className="card-tag">SUSTAINABLE ENERGY</span><span className="card-menu">•••</span></div>
            <div className="preview-image solar-image"><span className="sun-disc" /><span className="field-line line-one" /><span className="field-line line-two" /><span className="field-line line-three" /></div>
            <div className="preview-name"><div><strong>Solstice Solar I</strong><small>Hampshire, UK · 2024</small></div><span className="up-change">+12.8%</span></div>
            <div className="preview-foot"><div><small>YOUR OWNERSHIP</small><strong>0.042%</strong></div><div><small>PROJECTED YIELD</small><strong>8.4% <span>p.a.</span></strong></div></div>
          </div>
          <div className="floating-card value-card"><span className="mini-icon mint-bg"><TrendingUp size={16} /></span><small>PORTFOLIO VALUE</small><strong>$8,521.20</strong><span className="value-up">↗ 8.6% this month</span></div>
          <div className="floating-card impact-card"><span className="mini-icon coral-bg"><Sparkles size={16} /></span><small>YOUR IMPACT</small><strong>2.4t <span>CO₂ saved</span></strong><div className="impact-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
          <div className="floating-stamp"><ShieldCheck size={18} /><span>On-chain<br />verified</span></div>
        </div>
      </section>

      <div className="ticker"><div className="ticker-track"><span>OWN THE EVERYDAY</span><i>✦</i><span>BACK THE REAL WORLD</span><i>✦</i><span>GROW WITH PURPOSE</span><i>✦</i><span>OWN THE EVERYDAY</span><i>✦</i><span>BACK THE REAL WORLD</span><i>✦</i><span>GROW WITH PURPOSE</span></div></div>

      <section className="intro-section container" id="why">
        <div className="section-kicker">01 — A new relationship with value</div>
        <div className="intro-grid"><h2>Money feels different<br /><em>when it has a pulse.</em></h2><div><p>For too long, investing has lived in abstract numbers on a screen. ZenHeaven brings it back to earth — into the fields, rooftops, and homes your money helps grow.</p><Link to="/register" className="text-link">Meet your future portfolio <ArrowRight size={16} /></Link></div></div>
        <div className="manifesto"><div className="manifesto-word">VISIBLE</div><div className="manifesto-line" /><div className="manifesto-caption">Every asset has a story.<br />Now you can be part of it.</div></div>
      </section>

      <section className="steps-section" id="how">
        <div className="container"><div className="section-kicker">02 — From physical to possible</div><h2>One simple idea.<br /><em>Three meaningful steps.</em></h2>
          <div className="steps-grid">
            <Step number="01" icon={Target} title="Choose what moves you" text="Discover carefully selected real-world projects that align with your values and your vision." />
            <Step number="02" icon={Coins} title="Own your piece" text="Buy a transparent, on-chain token that represents a real share in something tangible." />
            <Step number="03" icon={Sprout} title="Watch it grow" text="Receive your share of the yield while the project creates positive change in the world." />
          </div>
        </div>
      </section>

      <section className="collection-section container" id="assets">
        <div className="collection-heading"><div><div className="section-kicker">03 — The collection</div><h2>Find your kind<br /><em>of tomorrow.</em></h2></div><Link to="/coins" className="button button-outline">View all assets <ArrowRight size={16} /></Link></div>
        <div className="collection-grid">{assets.map((asset) => <AssetCard key={asset.name} asset={asset} />)}</div>
      </section>

      <section className="quote-section container"><div className="quote-mark"><Quote size={30} /></div><blockquote>“ZenHeaven makes investing feel less like a transaction, and more like a relationship with the future.”</blockquote><div className="quote-person"><span className="portrait">MR</span><div><strong>Maya R.</strong><small>Early ZenHeaven owner · London</small></div></div></section>

      <section className="bottom-cta container"><div><Pill className="pill-dark"><Sparkles size={13} /> Your next chapter starts here</Pill><h2>Build a portfolio<br /><em>with a point of view.</em></h2></div><Link to="/register" className="button button-light">Begin your journey <ArrowRight size={17} /></Link></section>
      <footer className="landing-footer container"><Logo dark /><div><span>© 2024 ZenHeaven</span><a href="#why">Our story</a><a href="#how">How it works</a><a href="#assets">Assets</a><Link to="/login">Log in</Link></div><span className="footer-note">Made for a more grounded future ✦</span></footer>
    </main>
  )
}

function Step({ number, icon, title, text }) {
  return <article className="step-card"><span className="step-number">{number}</span><span className="step-icon">{createElement(icon, { size: 22 })}</span><h3>{title}</h3><p>{text}</p><ArrowRight className="step-arrow" size={18} /></article>
}

function AssetCard({ asset }) {
  const Icon = asset.icon
  return <article className={`collection-card ${asset.color}`}><div className="collection-art">{asset.color === 'sun' && <><span className="big-sun" /><span className="hill hill-a" /><span className="hill hill-b" /><span className="panel-row row-a" /><span className="panel-row row-b" /></>}{asset.color === 'green' && <><span className="field field-a" /><span className="field field-b" /><span className="tree tree-a" /><span className="tree tree-b" /></>}{asset.color === 'blue' && <><span className="building building-a" /><span className="building building-b" /><span className="window-grid" /></>}</div><div className="collection-meta"><div className="meta-icon"><Icon size={17} /></div><div><span>{asset.type}</span><h3>{asset.name}</h3></div><ArrowRight size={17} /></div><div className="collection-value"><span>Starting from $50</span><strong>{asset.change} <small>projected</small></strong></div></article>
}

function Auth({ mode }) {
  const isLogin = mode === 'login'
  return <main className="auth-page"><div className="auth-visual"><Logo dark /><div className="auth-visual-copy"><Pill className="pill-dark"><Sparkles size={13} /> Invest with intention</Pill><h1>Make your money<br /><em>mean something.</em></h1><p>Join a community making ownership more human, one real-world asset at a time.</p><div className="auth-mini-stat"><strong>8.6%</strong><span>average projected yield<br />across the collection</span></div></div><div className="auth-visual-footer">✦ Built on transparency &nbsp; · &nbsp; Rooted in the real world</div></div><div className="auth-form-wrap"><Link to="/" className="back-link">← Back to ZenHeaven</Link><div className="auth-form"><div className="section-kicker">{isLogin ? 'Welcome back' : 'Start your journey'}</div><h2>{isLogin ? 'Good to see you.' : 'Create your account.'}</h2><p>{isLogin ? 'Log in to continue building your future.' : 'It only takes a minute to get started.'}</p>{!isLogin && <label>Full name<input type="text" placeholder="Alex Morgan" /></label>}<label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<div className="password-input"><input type="password" placeholder="••••••••••••" /><span>Show</span></div></label><button className="button button-accent full-button">{isLogin ? 'Log in to ZenHeaven' : 'Create my account'} <ArrowRight size={16} /></button><div className="auth-divider"><span>or continue with</span></div><button className="social-button">◎&nbsp; Continue with Google</button><p className="auth-switch">{isLogin ? 'New to ZenHeaven?' : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link></p><small className="legal-copy">By continuing, you agree to our Terms of Use and Privacy Policy.</small></div></div></main>
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="app-shell"><aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}><div className="sidebar-head"><Logo /><button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={18} /></button></div><div className="sidebar-profile"><span className="profile-avatar">AM</span><div><strong>Alex Morgan</strong><small>Good energy, today</small></div><ChevronDown size={15} /></div><nav className="side-nav"><span className="side-label">Your space</span>{navItems.map(({ label, path }) => <NavLink key={path} to={path} onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>{label === 'Dashboard' ? <BarChart3 size={17} /> : label === 'My assets' ? <Wallet size={17} /> : <UsersRound size={17} />}{label}</NavLink>)}<span className="side-label">Take care</span><NavLink to="/chat"><MessageCircle size={17} />AI companion</NavLink><NavLink to="/journal"><BookOpen size={17} />Journal</NavLink><NavLink to="/music"><Headphones size={17} />Mood music</NavLink><NavLink to="/books"><BookOpen size={17} />Reading room</NavLink><NavLink to="/therapists"><UserRound size={17} />Therapists</NavLink></nav><div className="sidebar-bottom"><div className="side-help"><CircleHelp size={18} /><div><strong>Need a little help?</strong><small>We’re here for you.</small></div></div><Link to="/" className="side-logout">← Exit to landing</Link></div></aside><div className="app-content"><header className="app-header"><button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><Menu size={21} /></button><div className="app-breadcrumb">ZenHeaven <span>/</span> {useLocation().pathname.slice(1) || 'dashboard'}</div><div className="header-actions"><button className="icon-button"><CircleHelp size={18} /></button><span className="header-avatar">AM</span></div></header><div className="app-main"><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/chat" element={<Chat />} /><Route path="/journal" element={<Journal />} /><Route path="/books" element={<Books />} /><Route path="/music" element={<Music />} /><Route path="/therapists" element={<Therapists />} /><Route path="/coins" element={<CoinsPage />} /></Routes></div></div></div>
}

function PageHeading({ kicker, title, children }) {
  return <div className="page-heading"><div><div className="section-kicker">{kicker}</div><h1>{title}</h1></div>{children}</div>
}

function Dashboard() {
  return <><PageHeading kicker="Monday, 14 October 2024" title={<>A good day to<br /><em>grow something.</em></>}><button className="button button-dark">+ Add funds</button></PageHeading><div className="dashboard-grid"><section className="balance-card"><div className="balance-top"><span>Total portfolio value</span><span className="balance-change">↗ 8.6% <small>this month</small></span></div><strong>$8,521.20</strong><div className="chart"><span className="chart-tooltip">$8,521</span><svg viewBox="0 0 700 150" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d5f26b" stopOpacity=".32" /><stop offset="1" stopColor="#d5f26b" stopOpacity="0" /></linearGradient></defs><path d="M0 132 C30 125 42 118 68 122 S110 105 132 112 S167 70 194 89 S230 102 255 83 S287 89 313 70 S350 82 375 66 S414 92 445 61 S482 56 508 68 S540 46 568 50 S604 43 628 20 S671 35 700 5 L700 150 L0 150Z" fill="url(#chartFill)" /><path d="M0 132 C30 125 42 118 68 122 S110 105 132 112 S167 70 194 89 S230 102 255 83 S287 89 313 70 S350 82 375 66 S414 92 445 61 S482 56 508 68 S540 46 568 50 S604 43 628 20 S671 35 700 5" fill="none" stroke="#d5f26b" strokeWidth="3" /></svg></div><div className="chart-labels"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></section><section className="wellbeing-card"><div className="wellbeing-orbit"><span>✦</span><span>✦</span><div><Sparkles size={25} /></div></div><div><Pill className="pill-dark">Your wellbeing</Pill><h3>How are you<br /><em>feeling today?</em></h3><Link to="/journal" className="text-link light-link">Check in with yourself <ArrowRight size={15} /></Link></div></section></div><div className="dashboard-lower"><section className="panel"><div className="panel-head"><div><span className="panel-eyebrow">Your collection</span><h2>Active assets</h2></div><Link to="/coins" className="text-link">View all <ArrowRight size={15} /></Link></div><div className="asset-list">{assets.map((asset) => <div className="asset-row" key={asset.name}><span className={`asset-row-icon ${asset.color}`}><asset.icon size={18} /></span><div><strong>{asset.name}</strong><small>{asset.type}</small></div><div className="asset-amount"><strong>{asset.value}</strong><small>{asset.change}</small></div><ArrowRight size={16} /></div>)}</div></section><section className="panel activity-panel"><div className="panel-head"><div><span className="panel-eyebrow">Your rhythm</span><h2>Small moments</h2></div><button className="plain-button"><Plus size={16} /> Add</button></div><div className="activity-item"><span className="activity-icon mood"><Heart size={15} /></span><div><strong>Morning check-in</strong><small>Feeling grounded · Today</small></div><Check size={16} /></div><div className="activity-item"><span className="activity-icon read"><BookOpen size={15} /></span><div><strong>Read 12 minutes</strong><small>The Art of Stillness · Yesterday</small></div><Check size={16} /></div><div className="activity-item"><span className="activity-icon music"><Music2 size={15} /></span><div><strong>Evening wind-down</strong><small>Quiet focus · Sunday</small></div><Check size={16} /></div></section></div></>
}

function Chat() {
  const [message, setMessage] = useState('')
  return <><PageHeading kicker="Your AI companion" title={<>A little space<br /><em>to think out loud.</em></>}><Pill><span className="live-dot" /> Sol is online</Pill></PageHeading><div className="chat-layout"><section className="chat-window"><div className="chat-intro"><span className="sol-avatar"><Sparkles size={20} /></span><strong>Hi Alex, I’m Sol.</strong><p>Think of me as a calm corner of the internet. What’s on your mind?</p></div><div className="chat-bubble theirs">I’m feeling a little overwhelmed by everything on my list today.</div><div className="chat-bubble mine">That sounds heavy. We can take it one small thing at a time.</div><div className="chat-bubble theirs">I’d like that. Where should I start?</div><div className="chat-compose"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share what’s on your mind..." /><button aria-label="Send message"><ArrowRight size={18} /></button></div></section><aside className="chat-aside"><span className="panel-eyebrow">Gentle prompts</span><h3>Where would you like to begin?</h3>{['I want to check in with myself', 'Help me find some focus', 'I need a moment to breathe'].map((prompt) => <button key={prompt} className="prompt-button" onClick={() => setMessage(prompt)}>{prompt}<ArrowRight size={15} /></button>)}</aside></div></>
}

function Journal() {
  return <><PageHeading kicker="Your private space" title={<>Come as you are.<br /><em>Leave a little lighter.</em></>}><button className="button button-accent"><Plus size={16} /> New entry</button></PageHeading><div className="journal-grid"><section className="journal-feature"><div className="journal-date">MONDAY <strong>14</strong> OCTOBER</div><span className="mood-chip">✦ Grounded</span><h2>Today I noticed<br /><em>the small things.</em></h2><p>“The light was different on my morning walk. For once, I wasn’t thinking about the next thing. I was just there.”</p><span className="journal-time">8:42 AM · 3 min read</span></section><section className="journal-side"><div className="journal-prompt"><Sparkles size={17} /><span>Today’s gentle prompt</span><h3>What felt like a small win today?</h3><button className="text-link">Start writing <ArrowRight size={15} /></button></div><div className="mood-history"><div className="panel-head"><div><span className="panel-eyebrow">Your rhythm</span><h2>Mood over time</h2></div><span className="select-mini">This month⌄</span></div><div className="mood-bars"><span style={{ height: '42%' }} /><span style={{ height: '62%' }} /><span style={{ height: '52%' }} /><span style={{ height: '78%' }} /><span style={{ height: '69%' }} /><span style={{ height: '88%' }} /><span style={{ height: '74%' }} /><span style={{ height: '94%' }} /></div><div className="chart-labels"><span>Sep 30</span><span>Oct 14</span></div></div></section></div></>
}

function Books() {
  return <><PageHeading kicker="The reading room" title={<>A good book<br /><em>changes the weather.</em></>}><button className="button button-outline">Browse collection <ArrowRight size={15} /></button></PageHeading><div className="book-layout"><section className="book-feature"><div className="book-cover cover-stillness"><span>THE ART<br /><small>OF</small><br />STILLNESS</span><i>✦</i></div><div><Pill>Currently reading</Pill><h2>The Art of Stillness</h2><p>Adventures in Going Nowhere</p><div className="progress-line"><span style={{ width: '38%' }} /></div><small>38% complete · 4h 20m left</small><button className="button button-dark book-continue">Continue reading <ArrowRight size={15} /></button></div></section><section className="recommendations"><div className="panel-head"><div><span className="panel-eyebrow">Picked for you</span><h2>Quiet recommendations</h2></div><ArrowRight size={17} /></div><BookRow color="orange" title="Wintering" author="Katherine May" tag="Resilience" /><BookRow color="blue" title="How to Do Nothing" author="Jenny Odell" tag="Perspective" /><BookRow color="green" title="Braiding Sweetgrass" author="Robin Wall Kimmerer" tag="Connection" /></section></div></>
}

function BookRow({ color, title, author, tag }) {
  return <div className="book-row"><div className={`book-thumb ${color}`}><span>{title.split(' ').map((word) => word[0]).join('')}</span></div><div><Pill>{tag}</Pill><strong>{title}</strong><small>{author}</small></div><ArrowRight size={16} /></div>
}

function Music() {
  const [playing, setPlaying] = useState(false)
  return <><PageHeading kicker="Your mood, in sound" title={<>Press play on<br /><em>feeling better.</em></>}><button className="button button-dark"><Headphones size={16} /> Open player</button></PageHeading><div className="music-hero"><div className="album-art"><span className="album-sun" /><span className="album-ring ring-a" /><span className="album-ring ring-b" /><span>DEEP<br />BREATHS</span></div><div><Pill className="pill-dark">Curated for you</Pill><h2>A softer kind of focus</h2><p>Ambient · 12 tracks · 48 min</p><button className="button button-light" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} /> : <Play size={16} />} {playing ? 'Pause mix' : 'Play mix'}</button></div></div><section className="panel tracks-panel"><div className="panel-head"><div><span className="panel-eyebrow">Your recent mixes</span><h2>Follow your feeling</h2></div></div><Track number="01" title="A Quiet Place" artist="Hania Rani" time="4:32" active={playing} /><Track number="02" title="Bloom" artist="Ólafur Arnalds" time="3:58" /><Track number="03" title="First Light" artist="Bonobo" time="5:10" /><Track number="04" title="Weightless" artist="Marconi Union" time="8:02" /></section></>
}

function Track({ number, title, artist, time, active }) {
  return <div className={`track-row ${active ? 'playing' : ''}`}><span>{active ? <Pause size={14} /> : number}</span><span className="track-wave">{[1, 3, 2, 5, 3, 7, 4, 2].map((height, index) => <i key={index} style={{ height: `${height * 2 + 3}px` }} />)}</span><div><strong>{title}</strong><small>{artist}</small></div><span className="track-time">{time}</span><button className="plain-button"><Play size={14} /></button></div>
}

function Therapists() {
  return <><PageHeading kicker="Care, on your terms" title={<>A little support<br /><em>goes a long way.</em></>}><button className="button button-accent">Find a therapist <ArrowRight size={15} /></button></PageHeading><div className="therapist-intro"><ShieldCheck size={22} /><div><strong>A safe place to start</strong><p>Every professional on ZenHeaven is verified and here to meet you exactly where you are.</p></div></div><div className="therapist-grid"><Therapist color="terra" initials="LC" name="Dr. Lena Carter" role="Anxiety & life transitions" time="Available this week" /><Therapist color="lavender" initials="JM" name="Jordan Miller, LCSW" role="Self-worth & relationships" time="Next available tomorrow" /><Therapist color="sage" initials="NS" name="Nia Shah, LMFT" role="Stress & burnout" time="Available today" /></div></>
}

function Therapist({ color, initials, name, role, time }) {
  return <article className="therapist-card"><div className={`therapist-photo ${color}`}><span>{initials}</span></div><div className="therapist-copy"><Pill>Verified</Pill><h3>{name}</h3><p>{role}</p><span className="availability"><span className="live-dot" /> {time}</span><button className="button button-outline full-button">View profile <ArrowRight size={15} /></button></div></article>
}

function CoinsPage() {
  return <><PageHeading kicker="Your ownership" title={<>A portfolio with<br /><em>roots.</em></>}><button className="button button-accent"><Plus size={16} /> Discover assets</button></PageHeading><div className="coins-summary"><div><span>Total value</span><strong>$8,521.20</strong><small className="positive">↗ $674.22 all time</small></div><div><span>Projected annual yield</span><strong>8.4%</strong><small>Across 3 assets</small></div><div><span>Impact score</span><strong>742 <small>/ 1000</small></strong><small className="positive">Top 12% of owners</small></div></div><section className="panel coins-panel"><div className="panel-head"><div><span className="panel-eyebrow">Your collection</span><h2>Owned assets</h2></div><span className="select-mini">Performance⌄</span></div><div className="coin-table-head"><span>Asset</span><span>Value</span><span>Change</span><span>Yield</span><span /></div>{assets.map((asset) => <div className="coin-row" key={asset.name}><span className={`asset-row-icon ${asset.color}`}><asset.icon size={18} /></span><div><strong>{asset.name}</strong><small>{asset.type}</small></div><strong>{asset.value}</strong><span className="positive">{asset.change}</span><span>8.4% p.a.</span><ArrowRight size={16} /></div>)}</section></>
}

export default App
