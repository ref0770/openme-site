const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MAX_JSON_BODY_BYTES = 8192;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== '/verify-recaptcha') {
      return jsonResponse({ success: false, score: 0, action: null }, 404);
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...jsonHeaders(),
          Allow: 'POST, OPTIONS',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'content-type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ success: false, score: 0, action: null }, 405, {
        Allow: 'POST'
      });
    }

    let payload;
    try {
      payload = await readJsonBody(request);
    } catch (error) {
      return jsonResponse({ success: false, score: 0, action: null }, error.status || 400);
    }

    const token = typeof payload.token === 'string' ? payload.token.trim() : '';
    if (!token) {
      return jsonResponse({ success: false, score: 0, action: null }, 400);
    }

    const secretKey = typeof env.RECAPTCHA_SECRET_KEY === 'string' ? env.RECAPTCHA_SECRET_KEY : '';
    if (!secretKey) {
      return jsonResponse({ success: false, score: 0, action: null }, 500);
    }

    const params = new URLSearchParams();
    params.set('secret', secretKey);
    params.set('response', token);

    let googleResponse;
    try {
      googleResponse = await fetch(RECAPTCHA_VERIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
    } catch (error) {
      return jsonResponse({ success: false, score: 0, action: null }, 502);
    }

    if (!googleResponse.ok) {
      return jsonResponse({ success: false, score: 0, action: null }, 502);
    }

    let verification;
    try {
      verification = await googleResponse.json();
    } catch (error) {
      return jsonResponse({ success: false, score: 0, action: null }, 502);
    }

    return jsonResponse({
      success: verification.success === true,
      score: typeof verification.score === 'number' ? verification.score : 0,
      action: typeof verification.action === 'string' ? verification.action : null
    });
  }
};

async function readJsonBody(request) {
  if (!request.body) {
    throw new HttpError(400);
  }

  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    size += value.byteLength;
    if (size > MAX_JSON_BODY_BYTES) {
      await reader.cancel();
      throw new HttpError(413);
    }

    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch (error) {
    throw new HttpError(400);
  }
}

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...jsonHeaders(),
      ...headers
    }
  });
}

function jsonHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
}

class HttpError extends Error {
  constructor(status) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}
