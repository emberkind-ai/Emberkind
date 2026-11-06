/* Emberkind web settings.
   Companion conversations go through Emberkind's own secure server (a Cloudflare Worker that holds the
   AI key). The app checks that server on start-up: if it isn't set up or can't be reached, companions
   simply show "Live conversations are coming soon" and nothing is sent anywhere. */
window.EK_CONFIG = {
  liveAI: true,
  apiBase: "https://emberkind-api.emberkindai.workers.dev",
  /* Every AI call uses this one model: companion conversations and the small jobs alike (titles, step breakdowns,
     the line to carry). Leigh, Nov 2026: Sonnet only, never Haiku, for depth in emotional conversations. */
  claudeModel: "claude-sonnet-5-5"
};
