const HASH_VERSION = '1';
const DRAFT_KEY = 'happy-birthday-draft-v1';

export const LIMITS = {
  name: 40,
  from: 40,
  ageMin: 1,
  ageMax: 120,
  noteCount: 5,
  noteLength: 120,
  urlLength: 2000,
};

export const defaultGreeting = {
  name: '',
  age: '',
  from: 'Friends',
  birthdate: '',
  notes: [''],
};

export function cleanGreeting(input) {
  return {
    name: String(input.name || '').trim().slice(0, LIMITS.name),
    age: String(input.age || '').trim(),
    from: String(input.from || 'Friends').trim().slice(0, LIMITS.from) || 'Friends',
    birthdate: String(input.birthdate || '').trim(),
    notes: (input.notes || [])
      .map((note) => String(note || '').trim().slice(0, LIMITS.noteLength))
      .filter(Boolean)
      .slice(0, LIMITS.noteCount),
  };
}

export function validateGreeting(input, origin = window.location.href) {
  const data = cleanGreeting(input);
  const errors = [];
  const age = Number(data.age);

  if (!data.name) {
    errors.push('Add the celebrant name.');
  }

  if (!Number.isInteger(age) || age < LIMITS.ageMin || age > LIMITS.ageMax) {
    errors.push(`Age must be a whole number from ${LIMITS.ageMin} to ${LIMITS.ageMax}.`);
  }

  if (String(input.name || '').trim().length > LIMITS.name) {
    errors.push(`Name must be ${LIMITS.name} characters or fewer.`);
  }

  if (String(input.from || '').trim().length > LIMITS.from) {
    errors.push(`From label must be ${LIMITS.from} characters or fewer.`);
  }

  const overlongNote = (input.notes || []).find(
    (note) => String(note || '').trim().length > LIMITS.noteLength,
  );
  if (overlongNote) {
    errors.push(`Each wish note must be ${LIMITS.noteLength} characters or fewer.`);
  }

  if ((input.notes || []).filter((note) => String(note || '').trim()).length > LIMITS.noteCount) {
    errors.push(`Use ${LIMITS.noteCount} wish notes or fewer.`);
  }

  const url = buildShareUrl(data, origin);
  if (url.length > LIMITS.urlLength) {
    errors.push(`The share link is too long. Keep it under ${LIMITS.urlLength} characters.`);
  }

  return { data, errors, url };
}

export function buildShareUrl(input, origin = window.location.href) {
  const url = new URL(origin);
  const data = cleanGreeting(input);
  const payload = encodePayload(data);
  url.search = '';
  url.hash = `v=${HASH_VERSION}&data=${payload}`;
  return url.toString();
}

export function readGreetingFromHash(hash = window.location.hash) {
  const rawHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(rawHash);
  if (params.get('v') !== HASH_VERSION || !params.get('data')) {
    return null;
  }

  try {
    const decoded = decodePayload(params.get('data'));
    const data = cleanGreeting(decoded);
    if (!data.name || !data.age) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveDraft(input) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(input));
  } catch {
    // Draft storage is optional convenience only.
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Draft storage is optional convenience only.
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...defaultGreeting, ...JSON.parse(raw) } : defaultGreeting;
  } catch {
    return defaultGreeting;
  }
}

export function ordinalAge(ageValue) {
  const age = Number(ageValue);
  if (!Number.isFinite(age)) {
    return String(ageValue);
  }

  const lastTwo = age % 100;
  if (lastTwo >= 11 && lastTwo <= 13) {
    return `${age}th`;
  }

  const last = age % 10;
  if (last === 1) return `${age}st`;
  if (last === 2) return `${age}nd`;
  if (last === 3) return `${age}rd`;
  return `${age}th`;
}

function encodePayload(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function decodePayload(payload) {
  const normalized = payload.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
