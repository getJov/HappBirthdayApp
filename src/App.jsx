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
      <section className="creator-hero" aria-labelledby="creator-title">
        <p className="eyebrow">Frontend-only birthday link</p>
        <h1 id="creator-title">Create a birthday surprise</h1>
        <p>
          Add the greeting details, keep notes short, and share one independent link for each
          friend. Old links keep working because their data lives inside the URL.
        </p>
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
                  placeholder="Wishing you a bright and beautiful year."
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
            <div className="preview-flame" />
            <div className="preview-cake">
              <span>{form.age ? ordinalAge(form.age) : '21st'}</span>
            </div>
          </div>

          <h2>Share link</h2>
          <p className="muted">
            Each generated link is independent. Data is encoded in the URL hash, and local browser
            state is only used for this draft form.
          </p>

          <div className="url-meter">
            <span>URL length</span>
            <strong>{previewUrlLength.length}/{LIMITS.urlLength}</strong>
          </div>

          {shareUrl ? (
            <>
              <textarea className="share-url" value={shareUrl} readOnly rows="5" />
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
                You can create another greeting after copying this. This link will still open the same
                birthday page later.
              </p>
            </>
          ) : (
            <div className="empty-share">
              <p>Generate a link when the greeting is ready.</p>
            </div>
          )}
        </aside>
      </section>
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
  const detectorRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      detectorRef.current?.stop();
    };
  }, []);

  const blowCandle = () => {
    detectorRef.current?.stop();
    detectorRef.current = null;
    setMicState('complete');
    setMicLevel(0);
    setCountdown(null);
    setCandleBlown(true);
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

  return (
    <main className={`celebrant-page ${giftOpen ? 'gift-is-open' : ''} ${candleBlown ? 'candle-is-out' : ''}`}>
      <ConfettiCanvas active={candleBlown} />
      {candleBlown && (
        <div className="party-decorations" aria-hidden="true">
          <span className="party-hat hat-one" />
          <span className="party-hat hat-two" />
          <span className="party-popper popper-one" />
          <span className="party-popper popper-two" />
        </div>
      )}
      <audio ref={audioRef} src="/audio/happy-birthday.wav" loop preload="auto" />

      <button type="button" className="quiet-link" onClick={onCreateNew}>
        New greeting
      </button>

      <section className="birthday-stage" aria-label={`Birthday greeting for ${greeting.name}`}>
        {!giftOpen && (
          <>
            <div className="gift-cue" aria-hidden="true">
              <span className="curly-arrow">↝</span>
              <span>open it</span>
            </div>
            <button type="button" className="gift-box" onClick={openGift} aria-label="Open birthday gift">
              <span className="gift-lid" />
              <span className="gift-ribbon vertical" />
              <span className="gift-ribbon horizontal" />
              <span className="gift-base" />
            </button>
          </>
        )}

        <div className="cake-scene" aria-hidden={!giftOpen}>
          <div
            className="candle"
            style={{
              '--blow-level': micLevel,
              '--flame-scale': 1 + micLevel * 0.65,
            }}
          >
            <span className="wick" />
            {!candleBlown && <span className="flame" />}
          </div>
          <div className="cake">
            <div className="frosting" />
            <div className="cake-body">
              <div className="cake-decorations" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="cake-inscription" aria-live="polite">
                {candleBlown && (
                  <>
                    <span>Happy {ordinalAge(greeting.age)} Birthday, {greeting.name}!</span>
                    <small>from: {greeting.from}</small>
                  </>
                )}
              </div>
            </div>
            <div className="cake-plate" />
          </div>
        </div>
      </section>

      {giftOpen && (
        <section className="interaction-dock" aria-label="Candle controls">
          <div className="mic-status">
            <span>{statusText(micState, countdown, candleBlown)}</span>
            <div className="meter" aria-label="Microphone sensitivity meter">
              <span style={{ width: `${Math.round(micLevel * 100)}%` }} />
            </div>
          </div>
          <button type="button" className="primary-button" onClick={blowCandle} disabled={candleBlown}>
            Tap to Blow
          </button>
          {candleBlown && (
            <button type="button" className="secondary-button" onClick={toggleMute}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
          )}
        </section>
      )}

      {candleBlown && (
        <section className="wish-note-panel" aria-label="Birthday wish notes">
          {greeting.birthdate && <span className="birthdate-tag">{formatBirthdate(greeting.birthdate)}</span>}
          <h2>Wish notes</h2>
          {greeting.notes.length ? (
            <div className="wish-note-list">
              {greeting.notes.map((note, index) => (
                <p key={`${note}-${index}`}>{note}</p>
              ))}
            </div>
          ) : (
            <p className="muted">No extra notes were added, just a bright birthday wish.</p>
          )}
          {musicState === 'blocked' && (
            <p className="small-warning">Music was blocked by the browser. Tap Unmute or Tap to Blow again.</p>
          )}
        </section>
      )}
    </main>
  );
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

function statusText(micState, countdown, candleBlown) {
  if (candleBlown) return 'Candle blown out';
  if (micState === 'countdown') return `Make a wish. Listening starts in ${countdown}`;
  if (micState === 'listening') return 'Make a wish first, then blow the candle';
  if (micState === 'unavailable') return 'Mic unavailable. Use Tap to Blow.';
  if (micState === 'complete') return 'Wish made';
  return 'Open the gift to start';
}

function formatBirthdate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
