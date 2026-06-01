import { useEffect, useMemo, useRef, useState } from 'react';
import ConfettiCanvas from './components/ConfettiCanvas.jsx';
import { createBlowDetector } from './lib/audio.js';
import {
  LIMITS,
  buildShareUrl,
  clearDraft,
  defaultGreeting,
  loadDraft,
  ordinalAge,
  readGreetingFromHash,
  saveDraft,
  validateGreeting,
} from './lib/shareData.js';

const TAP_BLOW_TARGET = 5;
const TAP_BLOW_WINDOW_MS = 850;
const TAP_PROGRESS_RESET_MS = 1100;
const BALLOON_COLORS = [
  '#ff8fbd',
  '#ffd84a',
  '#57b7ff',
  '#74d66f',
  '#f04c4c',
  '#b99cff',
  '#ff9d4d',
];
const BALLOON_COUNT = 24;
const BUNTING_TEXT = 'HAPPY BIRTHDAY';
const NOTE_COLORS = ['#fff1a8', '#9ee6ff', '#ffb7d5', '#bdf3a7', '#d8c5ff'];
const NOTE_LAYOUT = [
  { left: '6%', top: '62%', rotate: '-4deg' },
  { left: '74%', top: '56%', rotate: '3deg' },
  { left: '10%', top: '35%', rotate: '2deg' },
  { left: '76%', top: '34%', rotate: '-3deg' },
  { left: '42%', top: '74%', rotate: '2deg' },
];

export default function App() {
  const [sharedGreeting, setSharedGreeting] = useState(() => readGreetingFromHash());
  const [creatorKey, setCreatorKey] = useState(0);

  useEffect(() => {
    const handleHashChange = () => setSharedGreeting(readGreetingFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (sharedGreeting) {
    return (
      <CelebrantExperience
        greeting={sharedGreeting}
        onCreateNew={() => {
          clearDraft();
          window.history.pushState(null, '', window.location.pathname);
          setSharedGreeting(null);
          setCreatorKey((key) => key + 1);
        }}
      />
    );
  }

  return <Creator key={creatorKey} />;
}

function Creator() {
  const [form, setForm] = useState(() => loadDraft());
  const [shareUrl, setShareUrl] = useState('');
  const [copyState, setCopyState] = useState('idle');
  const [errors, setErrors] = useState([]);
  const nativeShareAvailable = typeof navigator !== 'undefined' && Boolean(navigator.share);

  useEffect(() => {
    saveDraft(form);
  }, [form]);

  const filledNotes = useMemo(
    () => form.notes.filter((note) => note.trim()).length,
    [form.notes],
  );

  const updateField = (field, value) => {
    setShareUrl('');
    setCopyState('idle');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateNote = (index, value) => {
    setShareUrl('');
    setCopyState('idle');
    setForm((current) => ({
      ...current,
      notes: current.notes.map((note, noteIndex) => (noteIndex === index ? value : note)),
    }));
  };

  const addNote = () => {
    if (form.notes.length >= LIMITS.noteCount) return;
    setForm((current) => ({ ...current, notes: [...current.notes, ''] }));
  };

  const removeNote = (index) => {
    setForm((current) => ({
      ...current,
      notes: current.notes.filter((_, noteIndex) => noteIndex !== index),
    }));
  };

  const generateLink = () => {
    const result = validateGreeting(form);
    setErrors(result.errors);

    if (result.errors.length) {
      setShareUrl('');
      return;
    }

    const url = buildShareUrl(result.data);
    setShareUrl(url);
    window.history.replaceState(null, '', url);
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState('copied');
    } catch {
      setCopyState('manual');
    }
  };

  const nativeShare = async () => {
    if (!nativeShareAvailable || !shareUrl) return;
    try {
      await navigator.share({
        title: `Happy Birthday, ${form.name || 'friend'}!`,
        text: 'Open this birthday greeting.',
        url: shareUrl,
      });
    } catch {
      // Canceled shares do not need a visible error.
    }
  };

  const previewUrlLength = shareUrl || validateGreeting(form).url;

  return (
    <main className="creator-page">
      <div className="creator-shell">
        <section className="creator-hero" aria-labelledby="creator-title">
          <p className="eyebrow">Birthday surprise maker</p>
          <h1 id="creator-title">Create a birthday surprise</h1>
          <p>Personalize the cake, add a few wishes, then send the birthday link.</p>
        </section>

        <section className="builder-grid" aria-label="Birthday greeting builder">
          <form className="builder-form" onSubmit={(event) => event.preventDefault()}>
            <Field label="Celebrant name" help={`${form.name.length}/${LIMITS.name}`}>
              <input
                value={form.name}
                maxLength={LIMITS.name}
                placeholder="Maria"
                onChange={(event) => updateField('name', event.target.value)}
              />
            </Field>

            <div className="field-row">
              <Field label="Age" help={`${LIMITS.ageMin}-${LIMITS.ageMax}`}>
                <input
                  value={form.age}
                  inputMode="numeric"
                  placeholder="21"
                  onChange={(event) => updateField('age', event.target.value.replace(/\D/g, ''))}
                />
              </Field>

              <Field label="Birthdate optional" help="Shown on notes">
                <input
                  value={form.birthdate}
                  type="date"
                  onChange={(event) => updateField('birthdate', event.target.value)}
                />
              </Field>
            </div>

            <Field label="From" help={`${form.from.length}/${LIMITS.from}`}>
              <input
                value={form.from}
                maxLength={LIMITS.from}
                placeholder="Friends"
                onChange={(event) => updateField('from', event.target.value)}
              />
            </Field>

            <div className="notes-header">
              <div>
                <h2>Wish notes</h2>
                <p>{filledNotes}/{LIMITS.noteCount} short notes for the celebrant.</p>
              </div>
              <button className="icon-button" type="button" onClick={addNote} disabled={form.notes.length >= LIMITS.noteCount} title="Add note">
                +
              </button>
            </div>

            <div className="note-list">
              {form.notes.map((note, index) => (
                <label className="note-field" key={index}>
                  <span>Note {index + 1}</span>
                  <textarea
                    value={note}
                    maxLength={LIMITS.noteLength}
                    rows="3"
                    placeholder={'Wishing you a bright and beautiful year.\n- from sender'}
                    onChange={(event) => updateNote(index, event.target.value)}
                  />
                  <small>{note.length}/{LIMITS.noteLength}</small>
                  {form.notes.length > 1 && (
                    <button type="button" className="text-button" onClick={() => removeNote(index)}>
                      Remove
                    </button>
                  )}
                </label>
              ))}
            </div>

            {errors.length > 0 && (
              <div className="error-box" role="alert">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}

            <div className="action-row">
              <button type="button" className="primary-button" onClick={generateLink}>
                Generate link
              </button>
              <button type="button" className="secondary-button" onClick={() => setForm(defaultGreeting)}>
                Reset
              </button>
            </div>
          </form>

          <aside className="share-panel" aria-label="Generated birthday link">
            <div className="cake-preview" aria-hidden="true">
              <div className="preview-room">
                <span className="preview-light" />
                <span className="preview-gift" />
                <span className="preview-flame" />
                <div className="preview-cake">
                  <span>{form.age ? ordinalAge(form.age) : '21st'}</span>
                </div>
              </div>
            </div>

            <h2>Share link</h2>
            <p className="muted">Copy the link when your birthday surprise is ready.</p>

            <div className="url-meter">
              <span>Link size</span>
              <strong>{previewUrlLength.length}/{LIMITS.urlLength}</strong>
            </div>

            {shareUrl ? (
              <>
                <textarea className="share-url" value={shareUrl} readOnly rows="5" aria-label="Birthday share link" />
                <div className="action-row stacked">
                  <button type="button" className="primary-button" onClick={copyLink}>
                    {copyState === 'copied' ? 'Copied' : 'Copy link'}
                  </button>
                  {nativeShareAvailable && (
                    <button type="button" className="secondary-button" onClick={nativeShare}>
                      Native share
                    </button>
                  )}
                </div>
                {copyState === 'manual' && (
                  <p className="small-warning">Clipboard was blocked. Select and copy the link manually.</p>
                )}
                <p className="link-note">
                  Ready for another friend? Use New greeting from the birthday page.
                </p>
              </>
            ) : (
              <div className="empty-share">
                <p>Generate a link when the greeting is ready.</p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({ label, help, children }) {
  return (
    <label className="field">
      <span>
        {label}
        <small>{help}</small>
      </span>
      {children}
    </label>
  );
}

function CelebrantExperience({ greeting, onCreateNew }) {
  const [giftOpen, setGiftOpen] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [micState, setMicState] = useState('idle');
  const [micLevel, setMicLevel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [musicState, setMusicState] = useState('idle');
  const [tapProgress, setTapProgress] = useState(0);
  const [cardOpen, setCardOpen] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState({});
  const [noteOffsets, setNoteOffsets] = useState({});
  const [draggingNote, setDraggingNote] = useState(null);
  const detectorRef = useRef(null);
  const audioRef = useRef(null);
  const lastTapRef = useRef(0);
  const tapCountRef = useRef(0);
  const tapResetTimerRef = useRef(null);
  const balloonTimersRef = useRef({});
  const dragRef = useRef(null);

  useEffect(() => {
    return () => {
      detectorRef.current?.stop();
      window.clearTimeout(tapResetTimerRef.current);
      Object.values(balloonTimersRef.current).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const blowCandle = () => {
    if (candleBlown) return;
    detectorRef.current?.stop();
    detectorRef.current = null;
    window.clearTimeout(tapResetTimerRef.current);
    lastTapRef.current = 0;
    tapCountRef.current = 0;
    setTapProgress(0);
    setMicState('complete');
    setMicLevel(0);
    setCountdown(null);
    setCandleBlown(true);
    setCardOpen(false);
    playBirthdayAudio(audioRef, muted, setMusicState);
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted && candleBlown) {
        playBirthdayAudio(audioRef, false, setMusicState);
      }
    }
  };

  const openGift = () => {
    if (giftOpen) return;
    setGiftOpen(true);
    startMicCountdown(blowCandle, detectorRef, setCountdown, setMicState, setMicLevel);
  };

  const handleTapFallback = () => {
    if (!giftOpen || candleBlown) return;

    const now = Date.now();
    const isFastTap = now - lastTapRef.current <= TAP_BLOW_WINDOW_MS;
    const nextProgress = isFastTap ? tapCountRef.current + 1 : 1;
    lastTapRef.current = now;
    tapCountRef.current = nextProgress;

    window.clearTimeout(tapResetTimerRef.current);

    if (nextProgress >= TAP_BLOW_TARGET) {
      blowCandle();
      return;
    }

    setTapProgress(nextProgress);
    setMicLevel(Math.min(nextProgress / TAP_BLOW_TARGET, 0.92));
    tapResetTimerRef.current = window.setTimeout(() => {
      lastTapRef.current = 0;
      tapCountRef.current = 0;
      setTapProgress(0);
      setMicLevel(0);
    }, TAP_PROGRESS_RESET_MS);
  };

  const handleSceneTap = (event) => {
    if (event.target.closest('button, input, textarea, a, .sticky-note, .birthday-card, .bunting')) return;
    if (!giftOpen) {
      openGift();
      return;
    }
    handleTapFallback();
  };

  const popBalloon = (index) => {
    setPoppedBalloons((current) => ({ ...current, [index]: true }));
    window.clearTimeout(balloonTimersRef.current[index]);
    balloonTimersRef.current[index] = window.setTimeout(() => {
      setPoppedBalloons((current) => {
        const next = { ...current };
        delete next[index];
        return next;
      });
    }, 1800);
  };

  const startNoteDrag = (event, index) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = noteOffsets[index] || { x: 0, y: 0 };
    dragRef.current = {
      index,
      startX: event.clientX,
      startY: event.clientY,
      baseX: current.x,
      baseY: current.y,
    };
    setDraggingNote(index);
  };

  const moveNote = (event) => {
    if (!dragRef.current) return;
    const { index, startX, startY, baseX, baseY } = dragRef.current;
    const maxX = Math.max(80, window.innerWidth * 0.32);
    const maxY = Math.max(80, window.innerHeight * 0.28);
    const x = clamp(baseX + event.clientX - startX, -maxX, maxX);
    const y = clamp(baseY + event.clientY - startY, -maxY, maxY);
    setNoteOffsets((current) => ({ ...current, [index]: { x, y } }));
  };

  const endNoteDrag = () => {
    dragRef.current = null;
    setDraggingNote(null);
  };

  const birthdateLabel = formatBirthdate(greeting.birthdate);

  return (
    <main
      className={`celebrant-page ${giftOpen ? 'gift-is-open' : ''} ${candleBlown ? 'candle-is-out' : ''}`}
      onPointerDown={handleSceneTap}
    >
      <ConfettiCanvas active={candleBlown} />
      <audio ref={audioRef} src="/audio/happy-birthday.wav" loop preload="auto" />

      {candleBlown && (
        <>
          <div className="top-actions" aria-label="Celebration controls">
            <button type="button" className="round-icon-button" onClick={onCreateNew} title="New greeting" aria-label="New greeting">
              <PlusIcon />
            </button>
            <button type="button" className="round-icon-button" onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <MutedIcon /> : <VolumeIcon />}
            </button>
          </div>
          <section className="celebration-scene" aria-label="Birthday celebration decorations">
            <div className="balloon-bar" aria-label="Pop the balloons">
              {Array.from({ length: BALLOON_COUNT }, (_, index) => (
                <button
                  type="button"
                  className={`balloon-button ${poppedBalloons[index] ? 'is-popped' : ''}`}
                  key={index}
                  onClick={() => popBalloon(index)}
                  aria-label={`Pop balloon ${index + 1}`}
                  style={{
                    '--balloon-color': BALLOON_COLORS[index % BALLOON_COLORS.length],
                    '--balloon-y': `${(index % 5) * 8}px`,
                    '--balloon-rotate': `${-8 + (index % 5) * 4}deg`,
                  }}
                />
              ))}
            </div>

            <div className="bunting" aria-label="Happy Birthday banner">
              {BUNTING_TEXT.split('').map((letter, index) => (
                <span
                  className={`bunting-letter ${letter === ' ' ? 'space' : ''}`}
                  key={`${letter}-${index}`}
                  style={{
                    '--flag-color': BALLOON_COLORS[index % BALLOON_COLORS.length],
                    '--hang': `${8 + (index % 5) * 5}px`,
                    '--tilt': `${-6 + (index % 4) * 4}deg`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="birthday-stage" aria-label={`Birthday greeting for ${greeting.name}`}>
        {!candleBlown && (
          <button
            type="button"
            className="gift-box"
            onClick={openGift}
            aria-label="Open birthday gift"
            disabled={giftOpen}
          >
            <span className="gift-bow" />
            <span className="gift-lid" />
            <span className="gift-ribbon vertical" />
            <span className="gift-ribbon horizontal" />
            <span className="gift-base" />
          </button>
        )}

        <div className="cake-scene" aria-hidden={!giftOpen}>
          {giftOpen && !candleBlown && (
            <CurvedWishMessage />
          )}
          <div className="cake">
            <div className="cake-plate" />
            <div className="cake-layer bottom-layer">
              <span className="icing-drip drip-one" />
              <span className="icing-drip drip-two" />
              <span className="icing-drip drip-three" />
            </div>
            <div className="cake-layer top-layer">
              <div className="cake-top">
                <div className="candle-field" aria-hidden="true">
                  <span
                    className="candle"
                    style={{
                      '--blow-level': micLevel,
                    }}
                  >
                    {!candleBlown && <i className="flame" />}
                  </span>
                </div>
                <span className="sprinkle sprinkle-one" />
                <span className="sprinkle sprinkle-two" />
                <span className="sprinkle sprinkle-three" />
                <span className="sprinkle sprinkle-four" />
                <span className="sprinkle sprinkle-five" />
              </div>
              <span className="icing-drip drip-four" />
              <span className="icing-drip drip-five" />
            </div>
            {candleBlown && (
              <button
                type="button"
                className={`birthday-card ${cardOpen ? 'is-open' : ''}`}
                onClick={() => setCardOpen((open) => !open)}
                aria-expanded={cardOpen}
                aria-label="Open birthday card"
              >
                <span className="card-cover">
                  <span>Open</span>
                </span>
                <span className="card-inside">
                  {birthdateLabel && <small className="card-date">{birthdateLabel}</small>}
                  <strong className="card-message">
                    Happy {greeting.age} Birthday {greeting.name}!
                  </strong>
                  <small className="card-from">-{greeting.from}</small>
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {candleBlown && (
        <section className="sticky-notes" aria-label="Birthday wish notes">
          {greeting.notes.length ? (
            <div className="sticky-note-grid">
              {greeting.notes.map((note, index) => (
                <article
                  className={`sticky-note ${draggingNote === index ? 'is-dragging' : ''}`}
                  key={`${note}-${index}`}
                  onPointerDown={(event) => startNoteDrag(event, index)}
                  onPointerMove={moveNote}
                  onPointerUp={endNoteDrag}
                  onPointerCancel={endNoteDrag}
                  style={{
                    '--note-left': NOTE_LAYOUT[index % NOTE_LAYOUT.length].left,
                    '--note-top': NOTE_LAYOUT[index % NOTE_LAYOUT.length].top,
                    '--note-rotate': NOTE_LAYOUT[index % NOTE_LAYOUT.length].rotate,
                    '--note-color': NOTE_COLORS[index % NOTE_COLORS.length],
                    '--drag-x': `${noteOffsets[index]?.x || 0}px`,
                    '--drag-y': `${noteOffsets[index]?.y || 0}px`,
                  }}
                >
                  <p>{note}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="no-notes">No extra notes were added, just a bright birthday wish.</p>
          )}
          {musicState === 'blocked' && (
            <p className="small-warning">Music was blocked by the browser. Tap Unmute or Tap to Blow again.</p>
          )}
        </section>
      )}

    </main>
  );
}

function CurvedWishMessage() {
  const message = 'Make a wish, and blow the candle!';
  const midpoint = (message.length - 1) / 2;

  return (
    <p className="wish-message" aria-label={message}>
      {message.split('').map((character, index) => (
        <span
          aria-hidden="true"
          key={`${character}-${index}`}
          style={{
            '--curve-index': index - midpoint,
            '--curve-lift': `${Math.abs(index - midpoint) * -0.55}px`,
          }}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </p>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l6 5V5l-6 5H4z" />
      <path d="M17 9c1.4 1.6 1.4 4.4 0 6" />
      <path d="M19.5 6.5c3 3.2 3 7.8 0 11" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l6 5V5l-6 5H4z" />
      <path d="M18 9l4 6M22 9l-4 6" />
    </svg>
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatBirthdate(value) {
  if (!value) return '';

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

async function playBirthdayAudio(audioRef, muted, setMusicState) {
  const audio = audioRef.current;
  if (!audio) return;

  audio.loop = true;
  audio.muted = muted;

  try {
    await audio.play();
    setMusicState('playing');
  } catch {
    setMusicState('blocked');
  }
}

function startMicCountdown(blowCandle, detectorRef, setCountdown, setMicState, setMicLevel) {
  setMicState('countdown');
  setCountdown(3);
  let next = 3;

  const timer = window.setInterval(async () => {
    next -= 1;
    setCountdown(next);

    if (next > 0) return;

    window.clearInterval(timer);
    setCountdown(null);
    setMicState('listening');

    try {
      detectorRef.current = await createBlowDetector({
        onLevel: setMicLevel,
        onBlow: blowCandle,
      });
    } catch {
      setMicState('unavailable');
      setMicLevel(0);
    }
  }, 900);
}
