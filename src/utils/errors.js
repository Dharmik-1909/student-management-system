export function describeError(err, fallback = 'Something went wrong. Please try again.') {
  if (err && err.response) {
    const { status, data } = err.response;
    if (data && typeof data.message === 'string') return data.message;
    if (status === 404) return 'The requested record was not found.';
    if (status >= 500) return 'The server reported a problem. Please try again later.';
    return fallback;
  }
  if (err && err.request) {
    return 'Cannot reach the server. Make sure the API is running (npm run server).';
  }
  return fallback;
}

export const isUnauthorized = (err) => Boolean(err && err.response && err.response.status === 401);
