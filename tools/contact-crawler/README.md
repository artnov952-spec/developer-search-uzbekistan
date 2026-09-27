# Public contact crawler

A deterministic, LLM-free crawler for public candidate listings and candidate-owned pages. It parses HTML and follows a bounded discovery chain from listing/profile → portfolio/GitHub/social profile → personal/contact page. Every contact includes its exact source URL and full discovery chain. Candidates without a public contact are excluded.

## Sources and priority

Inputs are processed in this order: **hh.uz**, **OLX Uzbekistan**, **Talent Park**, **IT Market**, public Telegram resume channels, public GitHub profiles, then stack communities/schools (Stack Overflow, DEV, freeCodeCamp, Najot Ta'lim, Mohirdev, Astrum). Unknown public-web URLs are also supported.

The crawler does not bypass login, CAPTCHA, robots rules, rate limits, closed APIs, or private pages. `sourceReports` explicitly records `robots-disallowed`, `login-required`, `login-or-challenge`, `access-blocked`, `rate-limited`, HTTP errors, timeout, and network errors. A source being listed here means an adapter/classifier exists—not that its operator guarantees anonymous automated access.

GitHub discovery is public-page discovery: provide public profile/search-result URLs you are allowed to crawl. The crawler can follow the profile's public website/portfolio links; it does not use tokens, scrape private data, or call paid search APIs.

## Run

```bash
npm run crawl -- --input sources.json --output contacts.json --depth 3 --pages 30 --listing-pages 3 --candidates 50 --timeout 8000 --delay 150
npm test
```

Input is a JSON array. `type: "source"` (alias `kind: "listing"`) asks an adapter to discover candidate links from bounded listing pages. Omitting it preserves the original direct-candidate behavior:

```json
[
  { "id": "hh-search", "type": "source", "url": "https://hh.uz/search/resume?text=typescript" },
  { "id": "olx-seekers", "type": "source", "url": "https://www.olx.uz/rabota/ischu-rabotu/" },
  { "id": "telegram-resumes", "type": "source", "url": "https://t.me/s/public_resume_channel" },
  { "id": "github-users", "type": "source", "url": "https://github.com/search?q=location%3AUzbekistan&type=users" },
  { "id": "direct-candidate", "name": "Optional display name", "url": "https://github.com/public-user" }
]
```

Adapter candidate rules cover hh.uz `/resume/…`, OLX public advert/job-seeker pages, IT Market specialist/profile cards, Telegram public channel post pages, GitHub user links from public user/search/list pages, and profile-like links on generic community/school listings. Pagination follows same-origin `rel=next`, localized next labels, and conventional `page`/`p` parameters within `--listing-pages`. Candidate URLs are deduplicated before crawling and capped by `--candidates`.

Output uses schema version 3. `discoveryReports` records every source listing, pages visited, candidate count, failures, and unsupported/restricted status. `sourceReports` records deep-crawl outcomes. Contact `discoveryChain` begins at the original listing and includes listing pagination pages, candidate profile and subsequent contact pages. Contacts have `type` (`email`, `phone`, `telegram`, `social`), original and normalized values and `sourceUrl`. The checked-in example output is synthetic and only documents the format.

## Static app / GitHub Pages

Cross-origin crawling cannot safely or reliably run in a static browser app. Generate a JSON snapshot with the CLI on a machine/backend, then import it at `/search`. Once imported, real snapshot rows **replace** demo rows; they are not mixed. The browser stores imported data locally. No demo profile is represented as a live result.

Only crawl public pages you are permitted to access. Public availability does not remove privacy, data-protection, employment, anti-discrimination, retention, or outreach obligations.
