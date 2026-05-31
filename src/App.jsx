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
const CARTOON_CANDLE_COUNT = 3;

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
  const detectorRef = useRef(null);
  const audioRef = useRef(null);
  const lastTapRef = useRef(0);
  const tapCountRef = useRef(0);
  const tapResetTimerRef = useRef(null);
  const candles = Array.from({ length: CARTOON_CANDLE_COUNT }, (_, index) => index);

  useEffect(() => {
    return () => {
      detectorRef.current?.stop();
      window.clearTimeout(tapResetTimerRef.current);
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
    if (event.target.closest('button, input, textarea, a, .sticky-note')) return;
    handleTapFallback();
  };

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
              +
            </button>
            <button type="button" className="round-icon-button" onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'} aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? 'U' : 'M'}
            </button>
          </div>
          <div className="celebration-balloons" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
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
                  {candles.map((candle) => (
                    <span
                      className="candle"
                      key={candle}
                      style={{
                        '--candle-index': candle,
                        '--blow-level': micLevel,
                      }}
                    >
                      {!candleBlown && <i className="flame" />}
                    </span>
                  ))}
                </div>
                <span className="sprinkle sprinkle-one" />
                <span className="sprinkle sprinkle-two" />
                <span className="sprinkle sprinkle-three" />
                <span className="sparkle sparkle-one" />
                <span className="sparkle sparkle-two" />
              </div>
              <span className="icing-drip drip-four" />
              <span className="icing-drip drip-five" />
            </div>
            {candleBlown && (
              <div className="cake-card" aria-live="polite">
                <span>Happy {ordinalAge(greeting.age)} Birthday</span>
                <strong>{greeting.name}</strong>
                <small>- {greeting.from}</small>
              </div>
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
                  className={`sticky-note sticky-${index + 1}`}
                  key={`${note}-${index}`}
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
