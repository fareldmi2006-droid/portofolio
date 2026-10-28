import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Code2, Copy, Expand, FileText, Github, Linkedin, Mail, MapPinned, Moon, Network, Sun, X } from 'lucide-react';
import { Background } from './Background';
import { FolderStack } from './FolderStack';
import { RevealText, RotatingBadge, SectionRail, WordCycle } from './Motion';
import { Marquee, useNameIntro } from './Kinetic';
import { MotionBlurDefs } from './motionBlur';
import { CursorHint } from './CursorHint';
import { COPY, CONTACT, type Lang } from './content';
import photo from './assets/farrell-new.jpg'; // previous photo kept as ./assets/farrell.jpg
import ccnaImg from './assets/ccna-itn.webp';

const CCNA_PDF = 'certificates/ccna-introduction-to-networks.pdf';

type Theme = 'dark' | 'light';
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'en';
}

const CARD_ICONS = [<Code2 key="c" strokeWidth={1} />, <MapPinned key="m" strokeWidth={1} />, <Network key="n" strokeWidth={1} />];

export const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#141113' : '#f1ebe3');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number>();
  const emailRef = useRef<HTMLSpanElement>(null);
  const t = COPY[lang];
  const name = useNameIntro();
  const [certOpen, setCertOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const certTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!certOpen) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCertOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      certTrigger.current?.focus();
    };
  }, [certOpen]);

  const rail = [
    { id: 'top', label: lang === 'en' ? 'Intro' : 'Pembuka' },
    { id: 'profile', label: t.nav.profile },
    { id: 'skills', label: t.nav.skills },
    { id: 'work', label: t.nav.work },
    { id: 'certs', label: t.certs.label },
    { id: 'contact', label: t.nav.contact },
  ];

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const say = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  const copyEmail = () => {
    const fallback = () => {
      const el = emailRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        el.scrollIntoView({ block: 'center' });
      }
      say(t.copyFallback);
    };
    try {
      navigator.clipboard.writeText(CONTACT.email).then(() => say(t.copied), fallback);
    } catch {
      fallback();
    }
  };

  return (
    <>
      <MotionBlurDefs />
      <CursorHint />
      <Background theme={theme} />
      <SectionRail items={rail} prefix={t.cursor.rail} />

      <nav className="nav" aria-label="Main">
        <div className="wrap nav-row">
          <a className="mono-mark" href="#top" aria-label="Farrell Fathurrahman, back to top" data-cursor={t.cursor.top}>
            <span>F</span><span>F</span>
          </a>
          <ul className="nav-links">
            <li><a href="#profile" data-cursor={`${t.cursor.go} ${t.nav.profile}`}>{t.nav.profile}</a></li>
            <li><a href="#skills" data-cursor={`${t.cursor.go} ${t.nav.skills}`}>{t.nav.skills}</a></li>
            <li><a href="#work" data-cursor={`${t.cursor.go} ${t.nav.work}`}>{t.nav.work}</a></li>
            <li><a href="#contact" data-cursor={`${t.cursor.go} ${t.nav.contact}`}>{t.nav.contact}</a></li>
          </ul>
          <button
            type="button"
            className="theme-btn"
            aria-label={theme === 'dark' ? t.cursor.toLight : t.cursor.toDark}
            data-cursor={theme === 'dark' ? t.cursor.toLight : t.cursor.toDark}
            onClick={() => setTheme((m) => (m === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>
          <div className="lang" role="group" aria-label="Language">
            <button type="button" aria-pressed={lang === 'en'} data-cursor={lang === 'en' ? undefined : t.cursor.toEn} onClick={() => setLang('en')}>EN</button>
            <button type="button" aria-pressed={lang === 'id'} data-cursor={lang === 'id' ? undefined : t.cursor.toId} onClick={() => setLang('id')}>ID</button>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap hero-grid">
          <div className="hero-copy card">
            <span className="status"><i className="pulse" />{t.status}</span>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="name">
              <span className="name-first" ref={name.first}>Farrell</span>
              <span className="name-last" ref={name.last}>Fathurrahman</span>
            </h1>
            <p className="role"><span aria-hidden="true">{t.rolePrefix} </span><WordCycle words={t.roleWords} /><span className="sr-only">{t.role}</span></p>
            <p className="lede">{t.lede}</p>
            <div className="cta">
              <a className="btn btn-primary" href="#work" data-cursor={t.cursor.work}>{t.ctaWork}<ArrowUpRight size={16} aria-hidden="true" /></a>
              <button className="btn btn-line" type="button" onClick={copyEmail} data-cursor={t.cursor.copy}><Copy size={16} aria-hidden="true" />{t.ctaCopy}</button>
              <a className="btn btn-icon" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-cursor={t.cursor.linkedin}><Linkedin size={18} /></a>
              <a className="btn btn-icon" href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-cursor={t.cursor.github}><Github size={18} /></a>
            </div>
          </div>

          <figure className="portrait">
            <RotatingBadge text={t.badge} core="FF" />
            <div className="portrait-frame">
              <img src={photo} alt="Portrait of Farrell Fathurrahman" width={720} height={960} />
              <span className="portrait-shine" aria-hidden="true" />
            </div>
            <figcaption className="card">{t.photoCaption}</figcaption>
          </figure>
        </div>

        <div className="wrap">
          <dl className="hero-meta card">
            {t.meta.map((m) => (
              <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>
            ))}
          </dl>
        </div>
      </header>

      <Marquee items={t.marquee} />

      <main>
        <section className="block" id="profile">
          <div className="wrap">
            <SectionHead label={t.profile.label} title={t.profile.title} intro={t.profile.intro} />
            <FolderStack
              cards={t.profile.cards}
              icons={CARD_ICONS}
              openLabel={t.profile.turn}
              closeLabel={t.profile.back}
              hint={t.profile.hint}
              cursorOpen={t.cursor.turn}
              cursorClose={t.cursor.back}
            />
          </div>
        </section>

        <section className="block" id="skills">
          <div className="wrap">
            <SectionHead label={t.skills.label} title={t.skills.title} intro={t.skills.intro} />
            <div className="skills card">
              {t.skills.groups.map((g) => (
                <div className="skill-row" key={g.name}>
                  <h3>{g.name}</h3>
                  <div className="chips">
                    {g.items.map((it) => (
                      <span key={it} className={`chip${g.key.includes(it) ? ' chip-key' : ''}`}>{it}</span>
                    ))}
                  </div>
                  <span className={`level level-${g.tone}`}><i />{g.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="work">
          <div className="wrap">
            <SectionHead label={t.work.label} title={t.work.title} />
            <div className="projects">
              {t.work.projects.map((p, i) => (
                <article className="proj card" key={p.title}>
                  <div className="proj-text">
                    <span className={`tag${p.tagWip ? ' tag-wip' : ''}`}>{p.tag}</span>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                    <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                  </div>
                  <div className="proj-visual">
                    {i === 0 && <FtthVisual label={t.work.visual.ftth} note={t.work.illustrative} />}
                    {i === 1 && <RolesVisual label={t.work.visual.roles} lang={lang} />}
                    {i === 2 && <VarsVisual label={t.work.visual.vars} mine={t.work.visual.mine} lang={lang} />}
                    {i === 3 && <MapVisual label={t.work.visual.map} />}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="certs">
          <div className="wrap">
            <SectionHead label={t.certs.label} title={t.certs.title} />
            <div className="certs">
              {t.certs.items.map((c) => (
                <div className={`cert card${c.pending ? ' cert-pending' : ''}`} key={c.name}>
                  <div className="cert-top">
                    <span className="seal">{c.seal}</span>
                    {c.date && <span className="cert-date">{c.date}</span>}
                  </div>
                  <div>
                    <h3>{c.name}</h3>
                    <p className="cert-issuer">{c.issuer}</p>
                  </div>
                  {c.image === 'ccna' && (
                    <button
                      type="button"
                      className="cert-thumb"
                      aria-label={`${t.certs.view}: ${c.name}`}
                      data-cursor={t.cursor.cert}
                      onClick={(e) => {
                        certTrigger.current = e.currentTarget;
                        setCertOpen(true);
                      }}
                    >
                      <img src={ccnaImg} alt="" width={1280} height={867} loading="lazy" />
                    </button>
                  )}
                  <p>{c.desc}</p>
                  <div className="cert-foot">
                    <span className={`level ${c.pending ? 'level-grow' : 'level-strong'}`}><i />{c.status}</span>
                    {c.image === 'ccna' && (
                      <button
                        type="button"
                        className="btn btn-line btn-sm"
                        data-cursor={t.cursor.cert}
                        onClick={(e) => {
                          certTrigger.current = e.currentTarget;
                          setCertOpen(true);
                        }}
                      >
                        <Expand size={14} aria-hidden="true" />{t.certs.view}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="beyond">
          <div className="wrap">
            <SectionHead label={t.beyond.label} title={t.beyond.title} />
            <div className="beyond">
              {t.beyond.items.map((b) => (
                <div className="card" key={b.title}>
                  <span className="label">{b.label}</span>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <section className="contact" id="contact">
        <div className="wrap">
          <div className="contact-head card">
            <span className="label">{t.contact.label}</span>
            <h2>{t.contact.title1}<br /><span className="light">{t.contact.title2}</span></h2>
            <p>{t.contact.body}</p>
          </div>
          <div className="channels">
            <div className="channel card">
              <span className="label"><Mail size={14} aria-hidden="true" />{t.contact.email}</span>
              <span className="channel-val" ref={emailRef}>{CONTACT.email}</span>
              <button type="button" className="btn btn-line btn-sm" onClick={copyEmail} data-cursor={t.cursor.copy}><Copy size={14} aria-hidden="true" />{t.contact.copy}</button>
            </div>
            <a className="channel card" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" data-cursor={t.cursor.linkedin}>
              <span className="label"><Linkedin size={14} aria-hidden="true" />LinkedIn</span>
              <span className="channel-val">in/farrell-fathurrahman</span>
              <span className="channel-go">{t.contact.open}<ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
            <a className="channel card" href={CONTACT.github} target="_blank" rel="noopener noreferrer" data-cursor={t.cursor.github}>
              <span className="label"><Github size={14} aria-hidden="true" />GitHub</span>
              <span className="channel-val">fareldmi2006-droid</span>
              <span className="channel-go">{t.contact.open}<ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-row">
          <span>© 2026 Farrell Fathurrahman</span>
          <span>{t.footer}</span>
        </div>
      </footer>

      {certOpen && (
        <div className="viewer" role="dialog" aria-modal="true" aria-label="CCNA: Introduction to Networks" onClick={(e) => e.target === e.currentTarget && setCertOpen(false)}>
          <div className="viewer-card card">
            <div className="viewer-bar">
              <strong>CCNA: Introduction to Networks</strong>
              <div className="viewer-actions">
                <a className="btn btn-line btn-sm" href={CCNA_PDF} target="_blank" rel="noopener" data-cursor={t.cursor.cert}>
                  <FileText size={14} aria-hidden="true" />PDF
                </a>
                <button type="button" ref={closeBtn} className="btn btn-primary btn-sm" onClick={() => setCertOpen(false)} data-cursor={t.cursor.close}>
                  <X size={14} aria-hidden="true" />{t.certs.close}
                </button>
              </div>
            </div>
            <img src={ccnaImg} alt="Cisco Networking Academy certificate: Farrell Fathurrahman completed CCNA: Introduction to Networks, offered by Politeknik Caltex Riau, 17 Nov 2025" width={1280} height={867} />
          </div>
        </div>
      )}

      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
};

const SectionHead: React.FC<{ label: string; title: string; intro?: string }> = ({ label, title, intro }) => (
  <div className="sec-head card">
    <span className="label">{label}</span>
    <RevealText text={title} />
    {intro && <p>{intro}</p>}
  </div>
);

const FtthVisual: React.FC<{ label: string; note: string }> = ({ label, note }) => (
  <>
    <span className="label">{label}</span>
    <div className="path">
      {[
        ['OLT', 'central'],
        ['ODC', 'cabinet'],
        ['ODP', 'point'],
        ['ONT', 'home'],
      ].map(([n, s], i) => (
        <React.Fragment key={n}>
          {i > 0 && <span className="link" />}
          <span className={`node${n === 'ODP' ? ' node-warn' : ''}`}>
            <span className="node-box">{n}</span>
            <small>{s}</small>
          </span>
        </React.Fragment>
      ))}
    </div>
    <div className="readout">
      <div><span className="label">Rx</span><b>−19.4 dBm</b></div>
      <div><span className="label">Status</span><b>Online</b></div>
      <div><span className="label">Alert</span><b>1 ODP</b></div>
    </div>
    <span className="note">{note}</span>
  </>
);

const RolesVisual: React.FC<{ label: string; lang: Lang }> = ({ label, lang }) => {
  const rows: [string, string, number][] =
    lang === 'en'
      ? [['Dashboard & users', 'admin', 0], ['Products & store', 'seller', 1], ['Incoming orders', 'seller', 1], ['Cart & checkout', 'buyer', 2], ['My orders', 'buyer', 2]]
      : [['Dashboard & pengguna', 'admin', 0], ['Produk & toko', 'penjual', 1], ['Pesanan masuk', 'penjual', 1], ['Keranjang & checkout', 'pembeli', 2], ['Pesanan saya', 'pembeli', 2]];
  const heads = lang === 'en' ? ['Admin', 'Seller', 'Buyer'] : ['Admin', 'Penjual', 'Pembeli'];
  return (
    <>
      <span className="label">{label}</span>
      <div className="table-wrap">
        <table className="matrix">
          <thead><tr><th scope="col" /><th scope="col">{heads[0]}</th><th scope="col">{heads[1]}</th><th scope="col">{heads[2]}</th></tr></thead>
          <tbody>
            {rows.map(([name, , col]) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                {[0, 1, 2].map((c) => (
                  <td key={c}>{c === col ? <i className="yes" aria-label="yes" /> : <i className="no" aria-label="no" />}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const VarsVisual: React.FC<{ label: string; mine: string; lang: Lang }> = ({ label, mine, lang }) => {
  const vars: [string, string, boolean][] =
    lang === 'en'
      ? [['Product price', 'price', true], ['Shipping cost', 'freight_value', true], ['Delivery time', 'days', true], ['Customer satisfaction', 'review_score', false]]
      : [['Harga produk', 'price', true], ['Ongkos kirim', 'freight_value', true], ['Waktu pengiriman', 'days', true], ['Kepuasan pelanggan', 'review_score', false]];
  return (
    <>
      <span className="label">{label}</span>
      <div className="vars">
        {vars.map(([n, code, m]) => (
          <div className={`var${m ? ' var-mine' : ''}`} key={code}><span>{n}</span><code>{code}</code></div>
        ))}
      </div>
      <span className="legend"><i />{mine}</span>
    </>
  );
};

const MapVisual: React.FC<{ label: string }> = ({ label }) => (
  <>
    <span className="label">{label}</span>
    <svg className="minimap" viewBox="0 0 320 200" role="img" aria-label="Sketch of a web map with point, line and polygon layers">
      <rect x="0.5" y="0.5" width="319" height="199" rx="10" className="mm-bg" />
      <g className="mm-contour">
        <path d="M30 150 C 70 110, 130 140, 160 100 S 250 60, 300 90" />
        <path d="M20 175 C 80 140, 140 170, 175 125 S 260 90, 305 120" />
        <path d="M40 120 C 80 85, 120 110, 150 75 S 230 35, 290 60" />
      </g>
      <path className="mm-poly" d="M190 120 L 250 105 L 272 150 L 225 172 L 185 155 Z" />
      <path className="mm-line" d="M18 60 C 70 70, 95 40, 140 52 S 200 95, 240 70" />
      <g className="mm-pt">
        <circle cx="72" cy="98" r="5" />
        <circle cx="128" cy="150" r="5" />
        <circle cx="160" cy="40" r="5" />
      </g>
      <g className="mm-ctrl">
        <rect x="12" y="12" width="20" height="20" rx="4" /><text x="22" y="26.5">+</text>
        <rect x="12" y="34" width="20" height="20" rx="4" /><text x="22" y="48.5">−</text>
      </g>
    </svg>
    <div className="geo-legend">
      <span><i className="g-pt" />Point</span>
      <span><i className="g-line" />LineString</span>
      <span><i className="g-poly" />Polygon</span>
    </div>
  </>
);
