# The live check

Tests prove the pieces. The live check proves the product: the real server, the real front end and a real
client, used the way a person would use them.

## Contents

- Set up
- Walk the flows
- What to capture
- By product type

## Set up

1. Start the real server or router and the built front end on one local origin, so cookies, redirects and
   cross-origin rules behave as they will in production.
2. Point it at a throwaway database and cache, seeded with synthetic data. Never at production, a shared
   staging database with real data, or a customer's account.
3. Use the browser or client your users use. Some security settings (for example secure cookies on plain
   http) behave differently between browsers; note which one you used.

## Walk the flows

- Every flow in the slice, start to finish, as each role that uses it.
- The edge cases from the feature doc that can be reproduced by hand: empty state, a full list, an invalid
  input, a permission denied, a slow or failed request.
- The screens at a narrow phone width and a wide desktop width, in the light and dark themes.

## What to capture

Save to the slice's evidence folder:

- screenshots of each flow step and each edge case, named by flow and step;
- request and response samples for each new endpoint (redacted);
- relevant database rows as text (redacted);
- console and server log excerpts for any warning or error, with what you did about it.

## By product type

- **Web:** a real browser; keyboard-only pass; screen reader spot check on new controls.
- **Mobile:** a simulator or emulator for the smallest and largest supported screens; offline and poor-network
  behaviour; permission prompts.
- **Backend only:** call the real endpoints with a client (curl or a test script) against the running server;
  check idempotent retries and error bodies.
- **AI or agent:** run real model calls on a few eval cases end to end through the product, and check what the
  user sees when the model is slow or returns invalid output.
