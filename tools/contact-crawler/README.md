# Public contact crawler

Deterministic, LLM-free crawler for candidate-owned public pages. It follows same-site pages and public social profiles to a bounded depth, respects `robots.txt`, uses per-request timeouts and page/delay limits, and returns only candidates with contacts.

```bash
npm run crawl -- --input tools/contact-crawler/example-input.json --output contacts.json --depth 2 --pages 20 --timeout 8000
npm test
```

Input is a JSON array of `{ "id": string, "url": string }`. Output contacts have `type` (`email`, `phone`, `telegram`, `social`), original and normalized values, `sourceUrl`, and the complete `discoveryChain`. The checked-in example is an explicitly synthetic schema example—not a live-search result. Crawl only public pages you are permitted to access and handle personal data under applicable law.
