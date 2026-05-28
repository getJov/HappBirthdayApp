import { useEffect, useMemo, useState } from 'react';
import {
  LIMITS,
  buildShareUrl,
  defaultGreeting,
  loadDraft,
  ordinalAge,
  readGreetingFromHash,
  saveDraft,
  validateGreeting,
} from './lib/shareData.js';

export default function App() {
  const [sharedGreeting, setSharedGreeting] = useState(() => readGreetingFromHash());

  useEffect(() => {
    const handleHashChange = () => setSharedGreeting(readGreetingFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (sharedGreeting) {
    return <PreviewGreeting greeting={sharedGreeting} onCreateNew={() => window.location.assign('./')} />;
  }

  return <Creator />;
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
          Add the greeting details, keep notes short, and share one link. No backend, no account,
          no database.
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
            Data is encoded in the URL hash. Local browser state is only used for this draft form.
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

function PreviewGreeting({ greeting, onCreateNew }) {
  return (
    <main className="celebrant-page is-preview">
      <section className="preview-message">
        <p className="eyebrow">Birthday link loaded</p>
        <h1>Happy {ordinalAge(greeting.age)} Birthday, {greeting.name}!</h1>
        <p>from: {greeting.from}</p>
        {greeting.birthdate && <p className="birthdate-preview">Birthdate: {greeting.birthdate}</p>}
        {greeting.notes.length > 0 && (
          <div className="preview-notes">
            {greeting.notes.map((note, index) => (
              <p key={`${note}-${index}`}>{note}</p>
            ))}
          </div>
        )}
        <button type="button" className="primary-button" onClick={onCreateNew}>
          Create another
        </button>
      </section>
    </main>
  );
}
