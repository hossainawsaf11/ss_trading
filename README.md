# SS Trading website

Company website for **S.S. Trading**, Chattogram, Bangladesh: shipbuilding project management, newbuilds at Bangladeshi yards, and supply of pontoons, barges and small vessels.

Live domain: **https://sst-tsdhel.com**

A static site (plain HTML, CSS and JavaScript). No build step, no framework, no server. It runs on GitHub Pages for free.

## What's inside

```
sst-website/
├── index.html              All pages (Home, Build with us, Consulting, Supply, Projects, Insights, Company, Contact)
├── assets/
│   ├── css/style.css       Design tokens (brand blues), layout, light and dark themes
│   ├── js/articles.js      Insights articles: edit this file to publish new articles
│   ├── js/main.js          Page routing, build-berth animation, newbuild cost estimator, share buttons, enquiry form
│   └── img/                Enhanced project photos (JPG)
├── favicon.svg             SS Trading logo mark
├── CNAME                   Custom domain for GitHub Pages (sst-tsdhel.com)
├── .nojekyll               Tells GitHub Pages to serve files as they are
└── robots.txt
```

## Features

- **Instant newbuild cost estimator** on the home page. A shipowner enters the vessel type, dimensions, speed or power, class, outfit and delivery terms, and gets an indicative USD price range, a cost breakdown, build time and payment milestones. "Request a firm quote" sends the full specification into the contact form.
- **Build-berth animation** in the hero: keel and frames, block erection, outfitting and paint, launch, then the ship sails away.
- **Insights** section with articles that have LinkedIn, WhatsApp and copy-post share buttons for lead generation.
- Project credentials from the 2026 company profile, with enhanced photos.
- Works on phones, and follows the visitor's light or dark mode.

## Common edits

**Publish a new article.** Open `assets/js/articles.js`, copy one article block, paste it at the top of the list and edit the text. The `slug` must be unique and start with `a-` (for example `a-tug-buyers-guide`). Save, commit, and it is live in about a minute.

**Change estimator cost rates.** Open `assets/js/main.js` and find `var TYPES=`. Each vessel type has:

| Field | Meaning |
|---|---|
| `L` | default length (m) |
| `st` | steel weight per cubic metre of L × B × D (t/m³) |
| `hr` | hull cost per tonne of steel, fabricated and painted (USD) |
| `ok` | outfitting cost as a multiple of hull cost |
| `C` | Admiralty coefficient used to estimate power from speed |
| `V` | default service speed (knots) |

Machinery is priced per kW in the line starting `var rate=`. Class, overhead, delivery and series discounts are set a few lines below it.

**Change contact details.** Search `index.html` for `sabbab@sst-tsdhel.com` and `+88 0131721637`.

**Replace a photo.** Put the new JPG in `assets/img/` with the same file name, or change the `src` in `index.html`. Keep photos around 1000 to 1600 px wide, in a 3:2 shape.

## Deploying on GitHub Pages

1. Create a new repository on GitHub and upload the contents of this folder (not the folder itself) to the main branch.
2. In the repository, go to **Settings → Pages**, set **Source** to "Deploy from a branch", and choose `main` and `/ (root)`.
3. Under **Custom domain**, enter `sst-tsdhel.com` and save.
4. In the domain's DNS settings (for example at GoDaddy), point the domain to GitHub Pages:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `<your-github-username>.github.io`
5. When the DNS check passes in Settings → Pages, tick **Enforce HTTPS**.

DNS changes can take from a few minutes to a few hours to take effect.

## Notes

- The contact form opens the visitor's email app with the enquiry filled in. To receive enquiries directly in an inbox without the email app step, connect the form to a form service such as Formspree or Web3Forms.
- Article links use page anchors (for example `sst-tsdhel.com/#a-refund-guarantees`). For rich LinkedIn previews per article, each article can be moved to its own HTML page later.
- Estimator figures are indicative. Review the cost rates with the management team before relying on them in sales conversations.

© 2026 S.S. Trading. All rights reserved.
