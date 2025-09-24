type TranslateOptions = { source?: string; target: string };

export async function translateText(text: string, options: TranslateOptions): Promise<string> {
  const googleKey = process.env.EXPO_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
  if (googleKey) {
    try {
      const resp = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target: options.target, source: options.source }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        if (translated) return decodeHtmlEntities(String(translated));
      }
    } catch {}
  }
  // Fallback to LibreTranslate (try multiple endpoints and encodings)
  const endpoints = [
    process.env.EXPO_PUBLIC_LIBRE_TRANSLATE_URL,
    'https://libretranslate.com/translate',
    'https://translate.astian.org/translate',
  ].filter(Boolean) as string[];

  const payload = { q: text, source: options.source || 'auto', target: options.target, format: 'text' };
  let lastError: unknown = undefined;

  for (const url of endpoints) {
    // Try JSON first
    try {
      const r1 = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r1.ok) {
        const data = await r1.json();
        const t = data?.translatedText || data?.translation || data?.translated_text || data?.translations?.[0]?.text;
        if (t) return t as string;
      }
    } catch (e) { lastError = e; }

    // Try form-encoded (some instances require this)
    try {
      const body = new URLSearchParams({ q: text, source: payload.source, target: payload.target, format: payload.format }).toString();
      const r2 = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body,
      });
      if (r2.ok) {
        const data = await r2.json();
        const t = data?.translatedText || data?.translation || data?.translated_text || data?.translations?.[0]?.text;
        if (t) return t as string;
      }
    } catch (e) { lastError = e; }
  }

  // Try MyMemory as last resort
  try {
    const src = options.source || 'auto';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(src)}|${encodeURIComponent(options.target)}`;
    const r3 = await fetch(url);
    if (r3.ok) {
      const data = await r3.json();
      const t = data?.responseData?.translatedText;
      if (t) return t as string;
    }
  } catch (e) { lastError = e; }

  throw new Error('Translation failed' + (lastError ? `: ${String((lastError as any)?.message || lastError)}` : ''));
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}


