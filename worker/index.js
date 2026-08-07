// Sits in front of the static-asset layer (run_worker_first) to strip
// conditional-request headers. The asset layer answers a matching
// If-None-Match with a 304 — the response class the Approximated.app proxy
// fronting this domain intermittently mangles into an empty 200 (blank
// page). Browsers that previously cached the site hold content-hash
// validators that keep matching, so the request side must be closed too,
// not just the response side (`! ETag` in _headers). Keep both until the
// domain no longer routes through Approximated.
export default {
  async fetch(request, env) {
    const headers = new Headers(request.headers);
    headers.delete('If-None-Match');
    headers.delete('If-Modified-Since');
    return env.ASSETS.fetch(new Request(request, { headers }));
  },
};
