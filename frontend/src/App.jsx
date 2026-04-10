import { useState } from 'react'
import {
  Thermometer, Droplets, Clock, MapPin,
  ShieldAlert, Loader2, ExternalLink, AlertTriangle,
} from 'lucide-react'
import RiskGauge from './components/RiskGauge'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const ZONES = [
  { id: 'Arafat',    label: 'Arafat',    desc: 'Open plains · Peak ritual' },
  { id: 'Mina',      label: 'Mina',      desc: 'Tent city · Dense crowds' },
  { id: 'Muzdalifa', label: 'Muzdalifa', desc: 'Open air · Night stay' },
  { id: 'Jamarat',   label: 'Jamarat',   desc: 'Stoning site · High density' },
  { id: 'Masjid',    label: 'Masjid',    desc: 'Grand Mosque · Shade' },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const RISK_ACCENT = {
  EXTREME:  '#7F1D1D',
  HIGH:     '#DC2626',
  MODERATE: '#D97706',
  LOW:      '#65A30D',
  SAFE:     '#15803D',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Stepper({ label, value, unit, min, max, step = 1, icon: Icon, onChange }) {
  return (
    <div className="stepper-group">
      <label className="field-label">
        {Icon && <Icon size={13} />}
        {label}
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >−</button>
        <div className="stepper-display">
          <span className="stepper-value">{value}</span>
          <span className="stepper-unit">{unit}</span>
        </div>
        <button
          type="button"
          className="stepper-btn"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  )
}

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2 className="section-heading">
      <Icon size={15} strokeWidth={2} />
      {children}
    </h2>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [form, setForm] = useState({
    temp_celsius: 44,
    humidity: 25,
    month: 7,
    hour: 13,
    zone: 'Arafat',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    if (result) setResult(null) // clear result on input change
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Prediction failed')
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const hourStr = h => `${h === 0 ? 12 : h > 12 ? h - 12 : h}:00 ${h < 12 ? 'AM' : 'PM'}`

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <KaabaLogo />
            <div>
              <h1 className="header-title">Hajj Heatstroke Risk Predictor</h1>
              <p className="header-sub">Machine learning · Saudi Arabia · Pilgrim Safety</p>
            </div>
          </div>
          <div className="model-pill">
            <span className="pulse-dot" />
            Model Live
          </div>
        </div>
      </header>

      {/* ── Two-panel body ── */}
      <div className="app-body">

        {/* Left panel — form */}
        <form className="panel" onSubmit={handleSubmit}>

          <section className="form-section">
            <SectionHeading icon={Thermometer}>Weather Conditions</SectionHeading>
            <div className="stepper-row">
              <Stepper
                label="Temperature" value={form.temp_celsius} unit="°C"
                min={28} max={55} icon={Thermometer}
                onChange={v => set('temp_celsius', v)}
              />
              <Stepper
                label="Humidity" value={form.humidity} unit="%"
                min={5} max={80} icon={Droplets}
                onChange={v => set('humidity', v)}
              />
            </div>
          </section>

          <section className="form-section">
            <SectionHeading icon={Clock}>Time &amp; Date</SectionHeading>
            <div className="select-row">
              <div className="select-group">
                <label className="field-label"><Clock size={13} /> Month</label>
                <div className="select-wrap">
                  <select
                    value={form.month}
                    onChange={e => set('month', +e.target.value)}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="select-group">
                <label className="field-label"><Clock size={13} /> Hour</label>
                <div className="select-wrap">
                  <select
                    value={form.hour}
                    onChange={e => set('hour', +e.target.value)}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{hourStr(i)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="form-section no-border">
            <SectionHeading icon={MapPin}>Hajj Zone</SectionHeading>
            <div className="zone-grid">
              {ZONES.map(z => (
                <button
                  key={z.id}
                  type="button"
                  className={`zone-chip ${form.zone === z.id ? 'zone-chip--active' : ''}`}
                  onClick={() => set('zone', z.id)}
                >
                  <span className="zone-chip-name">{z.label}</span>
                  <span className="zone-chip-desc">{z.desc}</span>
                </button>
              ))}
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? <><Loader2 size={16} className="spin" /> Analyzing conditions…</>
              : <><ShieldAlert size={16} /> Assess Risk Level</>
            }
          </button>
        </form>

        {/* Right panel — result */}
        <div className="panel result-panel">
          {!result && !error && !loading && (
            <div className="placeholder">
              <KaabaOutline />
              <p className="placeholder-text">
                Set the weather conditions<br />on the left to see the risk assessment
              </p>
            </div>
          )}

          {loading && (
            <div className="placeholder">
              <Loader2 size={40} className="spin" color="#C9A84C" />
              <p className="placeholder-text">Running prediction model…</p>
            </div>
          )}

          {error && (
            <div className="error-box">
              <AlertTriangle size={18} />
              <div>
                <strong>Could not reach the API</strong>
                <p>{error}</p>
                <code>{API_URL}/predict</code>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="result-content" key={result.risk_level}>

              {/* Gauge */}
              <RiskGauge
                riskLevel={result.risk_level}
                feelsLike={result.feels_like}
                zone={result.inputs_echo.zone}
              />

              <div className="result-divider" style={{ borderColor: `${RISK_ACCENT[result.risk_level]}33` }} />

              {/* Advice */}
              <div className="advice-block">
                <p className="advice-heading">Recommended Actions</p>
                <ul className="advice-list">
                  {result.advice.map((tip, i) => (
                    <li key={i} className="advice-item">
                      <span
                        className="advice-num"
                        style={{ background: RISK_ACCENT[result.risk_level] }}
                      >{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conditions echo */}
              <div className="conditions-bar">
                <span>{form.temp_celsius}°C air</span>
                <span className="dot-sep">·</span>
                <span>{form.humidity}% humidity</span>
                <span className="dot-sep">·</span>
                <span>{MONTHS[form.month - 1]}</span>
                <span className="dot-sep">·</span>
                <span>{hourStr(form.hour)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <span>Decision-support tool only · Always follow official Saudi Ministry of Health guidance</span>
        <a
          href="https://github.com/muhammadmilhan-intellicode/HAJJ-HEATSTROKE-RISK-PREDICTOR"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          <ExternalLink size={14} /> View on GitHub
        </a>
      </footer>

    </div>
  )
}

// ── Brand icons (inline SVG) ──────────────────────────────────────────────────

function KaabaLogo() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="kaaba-logo" xmlns="http://www.w3.org/2000/svg">
      {/* Roof */}
      <polygon points="4,18 22,6 40,18" fill="#C9A84C" />
      {/* Body */}
      <rect x="8" y="18" width="28" height="22" rx="1" fill="#D4AF37" />
      {/* Gold band */}
      <rect x="8" y="18" width="28" height="5" fill="#A07D20" />
      {/* Door */}
      <rect x="16" y="27" width="12" height="13" rx="1" fill="#8B6914" />
      {/* Door arch highlight */}
      <rect x="18" y="29" width="8" height="2" rx="1" fill="#C9A84C" opacity="0.6" />
    </svg>
  )
}

function KaabaOutline() {
  return (
    <svg viewBox="0 0 88 88" fill="none" className="kaaba-outline" xmlns="http://www.w3.org/2000/svg">
      <polygon points="4,30 44,8 84,30" stroke="#C9A84C" strokeWidth="2" fill="none" opacity="0.4" />
      <rect x="12" y="30" width="64" height="50" rx="2" stroke="#C9A84C" strokeWidth="2" fill="none" opacity="0.4" />
      <rect x="12" y="30" width="64" height="12" fill="#C9A84C" fillOpacity="0.08" />
      <rect x="30" y="52" width="28" height="28" rx="1" stroke="#C9A84C" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  )
}
