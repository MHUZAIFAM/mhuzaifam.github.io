# Muhammad Huzaifa

Personal site — machine learning, computer vision, and applied AI.
Live at **https://mhuzaifam.github.io**

Static site: plain HTML/CSS/JS with Bootstrap 4, jQuery, AOS and particles.js.
No build step — GitHub Pages serves the repo as-is.

---

## How the site is put together

Page markup is mostly a shell. The actual content lives in JavaScript arrays,
which are rendered into cards at load time:

| Section | Data file | Array | Page |
|---|---|---|---|
| Projects | `assets/js/project.js` | `projects` | `projects.html` |
| Research | `assets/js/research.js` | `research` | `research.html` |
| Roles | `assets/js/experience.js` | `exp` | `experience.html` |
| Volunteering | `assets/js/experience.js` | `volunteershipcards` | `experience.html` |
| Mentorship | `assets/js/experience.js` | `mentor` | `experience.html` |
| Certifications | `assets/js/education.js` | `moocscards` | `education.html` |
| Badges | `assets/js/education.js` | `badgesection` | `education.html` |
| Tech stack | `assets/js/techstack.js` | `techStack` | `techstack.html` |

The nav bar, footer and scroll-to-top button are injected on every page by
`assets/js/app.js`, so changing them once changes them everywhere.

Two things are written directly into the page rather than driven by an array,
so they are edited by hand and not through the editor:

- `publication.html` — the publications list.
- The degree timeline in `education.html` (KFUPM, NUST, APSACS). Its cards all
  share one structure and the left/right alternation comes from
  `.timeline-item:nth-child(even)` in `education.css`, so inserting a card
  flips the side of every card below it — which is fine, but check it.

## Editing content

Two options.

**1. The editor (recommended)**

`editor.html` is a local visual editor for all of the arrays above: reorder
items by dragging, edit fields in a form, drop in an image and have it
compressed automatically, then write the changes straight back to the data
files. It is not linked from the site and is excluded in `robots.txt`.

```bash
python -m http.server 4321
```

Then open <http://localhost:4321/editor.html> in Chrome or Edge and click
**Connect repo folder**, picking this repository's root. That grant is what
allows the editor to save; without it the editor is read-only.

- **Save** (or Ctrl+S) rewrites only the arrays, leaving the rendering code untouched.
- **Review changes** shows the exact file contents before you save.
- **Preview** opens the real page in a frame.
- Images are resized to max 1400px and converted to WebP at quality 0.82,
  written into the right `assets/images/...` folder and wired to the item.

It needs the File System Access API, so Chrome or Edge — Firefox and Safari
can open it read-only.

**2. By hand**

Edit the arrays in the data files directly. Keep images under ~400 KB and
prefer WebP or JPEG; a card is only ever a few hundred pixels wide.

## Local preview

```bash
python -m http.server 4321
```

## Notes

- Every project in `projects` carries a `description`, but the current card
  template in `project.js` does not render it. The text is stored and editable;
  showing it needs a change to the card markup.
- `ScrollReveal` is called in `education.js` for the timeline reveal animations
  but the library is not loaded on any page, so those animations have never
  run. The call is guarded now; adding the library would switch them on.
- `education.js` holds a five-image certificate slideshow (`c1`-`c5`, 5.9 MB)
  driven by an `#image` element that no longer exists in `education.html`. The
  code is guarded, but the images are dead weight until the markup comes back.
- `design.html`, `event.html`, `reference.html`, `sem_temp.html`,
  `techstack.html` and `travel_temp.html` are not linked from the nav but are
  still deployed and publicly reachable. `reference.html` still contains
  placeholder testimonials inherited from the upstream template.
- Built on the portfolio template by
  [Smaranjit Ghose](https://github.com/smaranjitghose/awesome-portfolio-websites),
  MIT licensed.
