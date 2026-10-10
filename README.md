# SolderJoint.in

Marketing website for **SolderJoint.in** — special purpose machines, testing jigs and
instruments, SPC and industrial data systems, plus educational kits for engineering
students and hobbyists.

Plain static HTML, one stylesheet, one script. **No build step, no dependencies, no
framework.** Every page is a normal `.html` file you can edit in place.

---

## How the site is deployed

| | |
|---|---|
| Host | GitHub Pages |
| Source | `main` branch, repository **root** |
| Domain | `solderjoint.in`, via the [`CNAME`](./CNAME) file |
| Build | none — files are served exactly as committed |

Push to `main` and the change goes live in about a minute.

Two things keep this working, so **do not delete them**:

- **`CNAME`** — contains `solderjoint.in`. Without it the custom domain stops working.
- **`.nojekyll`** — tells GitHub Pages to serve files directly instead of running Jekyll.
  Files and folders beginning with `_` (like `products/_template.html`) are published
  because of this file.

---

## Structure

```
index.html                  Home — positioning, offerings, featured products, contact
products.html               All products, grouped into the five categories
portfolio.html              Selected project write-ups
about.html                  Company story, capabilities, process
contact.html                How to reach us, and how to get a useful answer faster
404.html                    Not-found page (self-contained: no external assets)
sitemap.xml, robots.txt     Search engine basics
site.webmanifest            Add-to-home-screen name, colours and icons

products/
  _template.html            Copy-me template for adding a product (not linked, noindex)
  spm-*.html                Special Purpose Machines
  test-*.html               Testing Jigs & Instruments
  spc-*.html                SPC & Quality Analytics
  data-*.html               Industrial Data Collectors & Gateways
  edu-*.html                Educational Kits

css/style.css               Everything: design tokens, components, responsive rules
js/main.js                  Navigation, QR code, product filter, analytics events
js/vendor/qrcode.min.js     Third-party QR library (MIT) — vendored, see its LICENSE file

images/
  og-image.png              Social share card (1200x630)
  icon-192.png, icon-512.png App icons
  solderjoint_logo_transparent.png
  products/, portfolio/     Illustrations
```

The five offering categories and their `#anchors` — `spm`, `test`, `spc`, `data`, `edu` —
are used across the navigation, the products page and the footer.

---

## Adding a product

1. Copy [`products/_template.html`](./products/_template.html) to
   `products/<your-product-slug>.html` (lowercase, hyphens, no spaces).
2. Work through the file, replacing every block marked `EDIT` and the `<title>` /
   `<meta name="description">` near the top. Each block is commented.
3. Search the file for `TODO` — when there are none left, you are done.
4. Add a card for it in `products.html`, inside the matching
   `<section class="category-block">`. Copy an existing card and change the link, title,
   summary and image.
5. Add a `<url>` entry to `sitemap.xml`.
6. Add a real photo to `images/products/` and point the two `<img>` tags at it.

To delete a product, do the reverse: remove its page, its card, and its sitemap entry.

> Every product page carries a visible **"Sample content"** note and an illustrative
> placeholder image. Remove the note and swap in real photography before you present the
> site to customers.

---

## Editing text

Most copy is real and ready; the parts that are still placeholders are marked so you
cannot miss them. Search the repository for:

- `Sample content` — visible notes on the pages that still need real writing
- `EDIT:` — inline comments marking a specific value to replace
- `YOUR PRODUCT NAME` — only inside `products/_template.html`

### Changing the WhatsApp number

The number appears in the links on every page. To change it:

1. Search and replace `918956761543` across all `.html` files (this is the
   international format with no `+` or spaces, as required by the `wa.me` links).
2. Search and replace `+91 89567 61543` for the human-readable version in the footer
   and on the contact page.

The QR code encodes the link automatically, so it needs no separate update.

---

## WhatsApp and the QR code

- **Chat link** — `https://wa.me/918956761543?text=...`. The `?text=` part pre-fills the
  message, which is what makes product enquiries arrive already labelled.
- **Catalog link** — `https://wa.me/c/918956761543`. Digits only; a leading `+` breaks it.
- **QR code** — drawn in the browser by the vendored library from the `data-qr-url`
  attribute on the `#qrcode` element. If that library ever fails to load, `js/main.js`
  replaces the QR with a normal "Chat on WhatsApp" button, so the page still converts.
  Only one element per page may have `id="qrcode"`.

CTA taps are reported to Google Analytics (`G-DF49PDMRF1`) as `whatsapp_click` events,
including which CTA position was used and, on product pages, which product.

---

## Previewing locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Serving over HTTP (rather than opening the files
directly) is important, because the pages use the same relative paths that GitHub Pages
serves.

In VS Code you can also just use the Live Preview extension (`.vscode/settings.json`
already points it at `index.html`).

---

## Conventions

- **Relative paths.** Root pages link `css/style.css`; pages in `products/` link
  `../css/style.css`. This keeps the site working both on the custom domain and if it is
  ever served from a `github.io` sub-path, where root-absolute paths would break.
- **One `<h1>` per page.** Everything below it is `<h2>` or `<h3>`.
- **Design tokens.** Colours, spacing, radii and type sizes are CSS variables defined at
  the top of `css/style.css` — change them there rather than hard-coding values.
- **Mobile first.** Base styles are for phones; media queries at 640px, 780px and 900px
  add columns and switch on the horizontal navigation.

---

## Third-party code

`js/vendor/qrcode.min.js` is [qrcodejs](https://github.com/davidshimjs/qrcodejs) by
davidshimjs, redistributed unmodified under the MIT License. The full licence text and
the file's SHA-256 hash are in
[`js/vendor/LICENSE-qrcodejs.txt`](./js/vendor/LICENSE-qrcodejs.txt).

It is bundled locally rather than loaded from a CDN so the QR code keeps working
regardless of any third-party service staying online.
