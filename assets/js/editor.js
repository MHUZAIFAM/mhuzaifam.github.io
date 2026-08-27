/* ------------------------------------------------------------------
   Content editor for the portfolio.
   Reads the `const <name> = [ ... ]` blocks out of the existing data
   files, lets you reorder / edit / add items, then writes the arrays
   back into the same files leaving the rendering code untouched.

   Local tool. Not linked from the site; excluded in robots.txt.
------------------------------------------------------------------- */
"use strict";

/* ---------- what we can edit ---------- */

const DATASETS = [
  { id: "projects", group: "Projects", label: "Projects",
    file: "assets/js/project.js", varName: "projects", page: "projects.html",
    imageDir: "assets/images/project-page", titleField: "title", subField: "description",
    fields: [
      { k: "title",       label: "Title",           type: "text" },
      { k: "cardImage",   label: "Card image",      type: "image" },
      { k: "description", label: "Description",     type: "textarea",
        hint: "Stored in the data but the current card template does not render it - see notes." },
      { k: "tagimg",      label: "Tech icon URL",   type: "text", hint: "Small logo shown on the card." },
      { k: "Previewlink", label: "Live demo URL",   type: "text" },
      { k: "Githublink",  label: "GitHub URL",      type: "text" }
    ] },

  { id: "research", group: "Research", label: "Papers",
    file: "assets/js/research.js", varName: "research", page: "research.html",
    imageDir: "assets/images/research-page", titleField: "title", subField: "conferences",
    fields: [
      { k: "title",       label: "Title",        type: "text" },
      { k: "authors",     label: "Authors",      type: "text" },
      { k: "conferences", label: "Venue",        type: "text" },
      { k: "researchYr",  label: "Year",         type: "number" },
      { k: "image",       label: "Image",        type: "image" },
      { k: "abstract",    label: "Abstract",     type: "textarea" },
      { k: "citation.vancouver", label: "Citation (Vancouver)", type: "textarea" },
      { k: "citebox",     label: "Cite popup id", type: "text", hint: "Must be unique, e.g. popup7." },
      { k: "absbox",      label: "Abstract popup id", type: "text", hint: "Must be unique, e.g. absPopup7." }
    ] },

  { id: "exp", group: "Experience", label: "Roles",
    file: "assets/js/experience.js", varName: "exp", page: "experience.html",
    imageDir: "assets/images/experience-page", titleField: "title", subField: "place",
    fields: [
      { k: "title",     label: "Job title",  type: "text" },
      { k: "cardImage", label: "Logo",       type: "image" },
      { k: "place",     label: "Employer",   type: "text" },
      { k: "time",      label: "Dates",      type: "text", hint: "e.g. (Oct 2025 - Present)" },
      { k: "desp",      label: "Bullets",    type: "textarea",
        hint: "HTML. One <li>...</li> per bullet." }
    ] },

  { id: "volunteershipcards", group: "Experience", label: "Volunteering",
    file: "assets/js/experience.js", varName: "volunteershipcards", page: "experience.html",
    imageDir: "assets/images/experience-page", titleField: "title", subField: "description",
    fields: [
      { k: "title",       label: "Title",       type: "text" },
      { k: "cardImage",   label: "Image",       type: "image" },
      { k: "description", label: "Description", type: "textarea" }
    ] },

  { id: "mentor", group: "Experience", label: "Mentorship",
    file: "assets/js/experience.js", varName: "mentor", page: "experience.html",
    imageDir: "assets/images/experience-page", titleField: "title", subField: "subtitle",
    fields: [
      { k: "title",    label: "Title",    type: "text" },
      { k: "subtitle", label: "Subtitle", type: "text" },
      { k: "image",    label: "Image",    type: "image" },
      { k: "desp",     label: "Description", type: "textarea" },
      { k: "href",     label: "Link",     type: "text" }
    ] },

  { id: "moocscards", group: "Education", label: "Certifications",
    file: "assets/js/education.js", varName: "moocscards", page: "education.html",
    imageDir: "assets/images/education-page", titleField: "title", subField: "moocLink",
    fields: [
      { k: "title",     label: "Course",      type: "text" },
      { k: "cardImage", label: "Certificate", type: "image" },
      { k: "moocLink",  label: "Link",        type: "text" }
    ] },

  { id: "badgesection", group: "Education", label: "Badges",
    file: "assets/js/education.js", varName: "badgesection", page: "education.html",
    imageDir: "assets/images/education-page", titleField: "title", subField: "description",
    fields: [
      { k: "title",       label: "Title",       type: "text" },
      { k: "image",       label: "Badge image", type: "image" },
      { k: "description", label: "Description", type: "textarea" }
    ] },

  { id: "techStack", group: "Skills", label: "Tech stack",
    file: "assets/js/techstack.js", varName: "techStack", page: "techstack.html",
    imageDir: "assets/images/techstack-page", titleField: "langName", subField: "langDesc",
    fields: [
      { k: "langImage", label: "Logo",        type: "image" },
      { k: "langName",  label: "Name",        type: "text" },
      { k: "langDesc",  label: "Description", type: "textarea" }
    ] }
];

/* ---------- state ---------- */

const state = {
  root: null,           // FileSystemDirectoryHandle once connected
  files: {},            // path -> original source text
  data: {},             // dataset id -> array
  dirtyFiles: new Set(),
  active: null,         // dataset id
  sel: -1,              // selected index
  sizes: new Map()      // image path -> bytes
};

const $ = (s) => document.querySelector(s);
const ds = (id) => DATASETS.find((d) => d.id === id);

/* ---------- JS literal slicing / parsing / printing ---------- */

// Finds `const <varName> = [ ... ];` and returns the exact span of the array
// literal, skipping over strings and comments so brackets inside text
// cannot throw the bracket counter off.
function findArrayLiteral(src, varName) {
  const re = new RegExp("(?:^|[\\n;])\\s*(?:const|let|var)\\s+" +
                        varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*=\\s*\\[");
  const m = re.exec(src);
  if (!m) return null;

  const start = m.index + m[0].length - 1; // position of '['
  let depth = 0, quote = null, esc = false;

  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i++; continue; }
    if (c === "[" || c === "{" || c === "(") depth++;
    else if (c === "]" || c === "}" || c === ")") {
      depth--;
      if (depth === 0) return { start, end: i + 1, text: src.slice(start, i + 1) };
    }
  }
  return null;
}

function parseLiteral(text) {
  // eslint-disable-next-line no-new-func
  return new Function('"use strict"; return (' + text + ");")();
}

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function print(v, ind) {
  const pad = "  ".repeat(ind), pad2 = "  ".repeat(ind + 1);
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    return "[\n" + v.map((x) => pad2 + print(x, ind + 1)).join(",\n") + "\n" + pad + "]";
  }
  const keys = Object.keys(v);
  if (!keys.length) return "{}";
  return "{\n" + keys.map((k) =>
    pad2 + (IDENT.test(k) ? k : JSON.stringify(k)) + ": " + print(v[k], ind + 1)
  ).join(",\n") + "\n" + pad + "}";
}

/* ---------- nested field access ("citation.vancouver") ---------- */

function getPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj, path, val) {
  const parts = path.split(".");
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof o[parts[i]] !== "object" || o[parts[i]] === null) o[parts[i]] = {};
    o = o[parts[i]];
  }
  o[parts[parts.length - 1]] = val;
}

/* ---------- file IO (directory handle if connected, else fetch) ---------- */

async function readText(path) {
  if (state.root) {
    const h = await handleFor(path, false);
    return (await h.getFile()).text();
  }
  const r = await fetch(path + "?t=" + Date.now());
  if (!r.ok) throw new Error(path + " -> " + r.status);
  return r.text();
}

async function handleFor(path, create) {
  const parts = path.split("/");
  let dir = state.root;
  for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i], { create });
  return dir.getFileHandle(parts[parts.length - 1], { create });
}

async function writeText(path, text) {
  const h = await handleFor(path, true);
  const w = await h.createWritable();
  await w.write(text);
  await w.close();
}

async function writeBlob(path, blob) {
  const h = await handleFor(path, true);
  const w = await h.createWritable();
  await w.write(blob);
  await w.close();
}

/* ---------- image compression ---------- */

const MAX_EDGE = 1400;
const QUALITY = 0.82;

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("could not load image"));
    img.src = src;
  });
}

async function compress(blobOrUrl) {
  const url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  try {
    const img = await loadImage(url);
    let { naturalWidth: w, naturalHeight: h } = img;
    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    w = Math.round(w * scale); h = Math.round(h * scale);

    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    const out = await new Promise((res) => c.toBlob(res, "image/webp", QUALITY));
    return { blob: out, w, h };
  } finally {
    if (typeof blobOrUrl !== "string") URL.revokeObjectURL(url);
  }
}

function slug(s) {
  return String(s || "item").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "item";
}

function fmtBytes(n) {
  if (n == null) return "?";
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(0) + " KB";
  return (n / 1048576).toFixed(1) + " MB";
}

async function sizeOf(path) {
  if (!path || /^https?:/i.test(path)) return null;
  if (state.sizes.has(path)) return state.sizes.get(path);
  try {
    const r = await fetch(path, { method: "HEAD" });
    const n = r.ok ? Number(r.headers.get("content-length")) : null;
    state.sizes.set(path, n);
    return n;
  } catch { return null; }
}

/* ---------- toast ---------- */

let toastT;
function toast(msg, isErr) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.toggle("err", !!isErr);
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- load ---------- */

async function loadAll() {
  const paths = [...new Set(DATASETS.map((d) => d.file))];
  for (const p of paths) state.files[p] = await readText(p);

  for (const d of DATASETS) {
    const found = findArrayLiteral(state.files[d.file], d.varName);
    if (!found) { console.warn("no array for", d.varName, "in", d.file); state.data[d.id] = []; continue; }
    try {
      state.data[d.id] = parseLiteral(found.text);
    } catch (e) {
      console.error("parse failed for", d.varName, e);
      state.data[d.id] = [];
    }
  }
  renderTabs();
  select(DATASETS[0].id, -1);
}

/* ---------- render: tabs ---------- */

function renderTabs() {
  const nav = $("#tabs");
  nav.innerHTML = "";
  let group = null;
  for (const d of DATASETS) {
    if (d.group !== group) {
      group = d.group;
      const g = document.createElement("div");
      g.className = "grp"; g.textContent = group;
      nav.appendChild(g);
    }
    const el = document.createElement("div");
    el.className = "tab" + (d.id === state.active ? " active" : "");
    el.innerHTML = '<span>' + d.label + '</span><span class="n">' + (state.data[d.id] || []).length + '</span>';
    el.onclick = () => select(d.id, -1);
    nav.appendChild(el);
  }
}

/* ---------- render: list ---------- */

function visibleIndices() {
  const arr = state.data[state.active] || [];
  const q = $("#filter").value.trim().toLowerCase();
  const d = ds(state.active);
  return arr.map((_, i) => i).filter((i) => {
    if (!q) return true;
    const it = arr[i];
    return String(getPath(it, d.titleField) || "").toLowerCase().includes(q) ||
           String(getPath(it, d.subField) || "").toLowerCase().includes(q);
  });
}

function renderList() {
  const d = ds(state.active);
  const arr = state.data[state.active] || [];
  const list = $("#list");
  const canDrag = !$("#filter").value.trim();
  list.innerHTML = "";

  for (const i of visibleIndices()) {
    const it = arr[i];
    const title = String(getPath(it, d.titleField) || "(untitled)");
    const sub = String(getPath(it, d.subField) || "").replace(/<[^>]*>/g, "").slice(0, 70);
    const imgField = d.fields.find((f) => f.type === "image");
    const src = imgField ? getPath(it, imgField.k) : "";

    const el = document.createElement("div");
    el.className = "item" + (i === state.sel ? " sel" : "");
    el.dataset.index = i;
    el.draggable = canDrag;
    el.innerHTML =
      (canDrag ? '<span class="grip" title="Drag to reorder">&#8942;&#8942;</span>' : '<span class="grip" style="opacity:.25">&#8942;&#8942;</span>') +
      (src ? '<img loading="lazy" src="' + escAttr(src) + '" onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'no-img\',textContent:\'?\'}))">'
           : '<div class="no-img">&#9633;</div>') +
      '<div class="meta"><div class="t"></div><div class="s"></div></div>';
    el.querySelector(".t").textContent = title;
    el.querySelector(".s").textContent = sub;
    el.onclick = () => select(state.active, i);

    if (canDrag) wireDrag(el);
    list.appendChild(el);
  }

  if (!list.children.length) {
    list.innerHTML = '<div style="color:#5f5f68;text-align:center;padding:30px 10px;font-size:13px">No items.</div>';
  }
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/* ---------- drag to reorder ---------- */

let dragFrom = -1;

function wireDrag(el) {
  el.addEventListener("dragstart", (e) => {
    dragFrom = Number(el.dataset.index);
    el.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(dragFrom));
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    document.querySelectorAll(".item.over").forEach((n) => n.classList.remove("over"));
  });
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".item.over").forEach((n) => n.classList.remove("over"));
    el.classList.add("over");
  });
  el.addEventListener("drop", (e) => {
    e.preventDefault();
    el.classList.remove("over");
    const to = Number(el.dataset.index);
    if (dragFrom < 0 || dragFrom === to) return;
    const arr = state.data[state.active];
    const [moved] = arr.splice(dragFrom, 1);
    arr.splice(to, 0, moved);
    state.sel = to;
    markDirty();
    renderList();
    renderEditor();
    toast("Moved to position " + (to + 1));
  });
}

/* ---------- render: editor pane ---------- */

function select(dsId, idx) {
  state.active = dsId;
  state.sel = idx;
  renderTabs();
  renderList();
  renderEditor();
}

function renderEditor() {
  const pane = $("#editPane");
  const d = ds(state.active);
  const arr = state.data[state.active] || [];
  const it = arr[state.sel];

  if (!it) {
    pane.innerHTML = '<div class="empty">' + arr.length + ' item' + (arr.length === 1 ? "" : "s") +
      ' in <b>' + d.label + '</b>.<br>Select one to edit, drag by the handle to reorder.</div>';
    return;
  }

  pane.innerHTML = "";

  const head = document.createElement("div");
  head.className = "editHead";
  head.innerHTML = '<h2></h2>';
  head.querySelector("h2").textContent = String(getPath(it, d.titleField) || "(untitled)");

  const dup = document.createElement("button");
  dup.className = "ghost"; dup.textContent = "Duplicate";
  dup.onclick = () => {
    arr.splice(state.sel + 1, 0, JSON.parse(JSON.stringify(it)));
    state.sel++; markDirty(); renderTabs(); renderList(); renderEditor();
  };

  const del = document.createElement("button");
  del.className = "danger"; del.textContent = "Delete";
  del.onclick = () => {
    if (!confirm("Delete “" + String(getPath(it, d.titleField) || "this item") + "”?")) return;
    arr.splice(state.sel, 1);
    state.sel = Math.min(state.sel, arr.length - 1);
    markDirty(); renderTabs(); renderList(); renderEditor();
    toast("Deleted");
  };

  head.append(dup, del);
  pane.appendChild(head);

  for (const f of d.fields) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const lab = document.createElement("label");
    lab.textContent = f.label;
    wrap.appendChild(lab);

    if (f.type === "image") {
      wrap.appendChild(imageField(it, f, d));
    } else {
      const el = document.createElement(f.type === "textarea" ? "textarea" : "input");
      if (f.type === "number") el.type = "number";
      const cur = getPath(it, f.k);
      el.value = cur == null ? "" : String(cur);
      el.oninput = () => {
        setPath(it, f.k, f.type === "number" ? (el.value === "" ? "" : Number(el.value)) : el.value);
        markDirty();
        if (f.k === d.titleField) { head.querySelector("h2").textContent = el.value || "(untitled)"; renderList(); }
        else if (f.k === d.subField) renderList();
      };
      wrap.appendChild(el);
    }

    if (f.hint) {
      const h = document.createElement("div");
      h.className = "hint"; h.textContent = f.hint;
      wrap.appendChild(h);
    }
    pane.appendChild(wrap);
  }
}

/* ---------- image field: drop, pick, compress ---------- */

function imageField(item, f, d) {
  const box = document.createElement("div");
  box.className = "drop";

  const thumb = document.createElement("img");
  const info = document.createElement("div");
  info.className = "info";
  const pathEl = document.createElement("div");
  pathEl.className = "path";
  const szEl = document.createElement("div");
  szEl.className = "sz";
  const btns = document.createElement("div");
  btns.style.cssText = "display:flex;gap:8px;margin-top:9px;flex-wrap:wrap";

  const pick = document.createElement("button");
  pick.className = "ghost"; pick.textContent = "Choose image";
  const shrink = document.createElement("button");
  shrink.className = "ghost"; shrink.textContent = "Compress this";

  btns.append(pick, shrink);
  info.append(pathEl, szEl, btns);
  box.append(thumb, info);

  const refresh = async () => {
    const v = getPath(item, f.k) || "";
    thumb.src = v || "";
    thumb.style.display = v ? "" : "none";
    pathEl.textContent = v || "no image set - drop one here";
    const n = await sizeOf(v);
    if (n == null) {
      szEl.innerHTML = /^https?:/i.test(v) ? '<span style="color:#9a9aa4">external URL</span>' : "";
      shrink.disabled = true;
    } else {
      const big = n > 400 * 1024;
      szEl.innerHTML = '<span class="' + (big ? "big" : "good") + '">' + fmtBytes(n) +
                       (big ? " - oversized for a card" : " - fine") + "</span>";
      shrink.disabled = false;
    }
  };
  refresh();

  const apply = async (blobOrUrl, baseName) => {
    if (!state.root) { toast("Connect the repo folder first so the image can be written.", true); return; }
    try {
      const before = typeof blobOrUrl === "string" ? await sizeOf(blobOrUrl) : blobOrUrl.size;
      const { blob, w, h } = await compress(blobOrUrl);
      const name = slug(baseName || getPath(item, d.titleField)) + ".webp";
      const path = d.imageDir + "/" + name;
      await writeBlob(path, blob);
      state.sizes.set(path, blob.size);
      setPath(item, f.k, path);
      markDirty();
      await refresh();
      renderList();
      toast(fmtBytes(before) + " -> " + fmtBytes(blob.size) + "  (" + w + "x" + h + ")");
    } catch (e) {
      console.error(e);
      toast("Image failed: " + e.message, true);
    }
  };

  pick.onclick = () => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*";
    inp.onchange = () => inp.files[0] && apply(inp.files[0], inp.files[0].name.replace(/\.[^.]+$/, ""));
    inp.click();
  };

  shrink.onclick = () => {
    const v = getPath(item, f.k);
    if (v) apply(v, v.split("/").pop().replace(/\.[^.]+$/, ""));
  };

  box.addEventListener("dragover", (e) => { e.preventDefault(); box.classList.add("hot"); });
  box.addEventListener("dragleave", () => box.classList.remove("hot"));
  box.addEventListener("drop", (e) => {
    e.preventDefault();
    box.classList.remove("hot");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) apply(file, file.name.replace(/\.[^.]+$/, ""));
  });

  return box;
}

/* ---------- dirty tracking + save ---------- */

function markDirty() {
  state.dirtyFiles.add(ds(state.active).file);
  $("#dirtyBadge").hidden = false;
  $("#saveBtn").disabled = !state.root;
}

function buildFile(path) {
  let src = state.files[path];
  // Rewrite each array that lives in this file. Work back-to-front so
  // earlier offsets stay valid.
  const inThis = DATASETS.filter((d) => d.file === path)
    .map((d) => ({ d, at: findArrayLiteral(src, d.varName) }))
    .filter((x) => x.at)
    .sort((a, b) => b.at.start - a.at.start);

  for (const { d, at } of inThis) {
    src = src.slice(0, at.start) + print(state.data[d.id], 0) + src.slice(at.end);
  }
  return src;
}

async function save() {
  if (!state.root) { toast("Connect the repo folder first.", true); return; }
  const files = [...state.dirtyFiles];
  if (!files.length) { toast("Nothing to save."); return; }
  try {
    for (const p of files) {
      const out = buildFile(p);
      // sanity check: it must still parse
      for (const d of DATASETS.filter((x) => x.file === p)) {
        const at = findArrayLiteral(out, d.varName);
        if (!at) throw new Error("lost " + d.varName + " while rewriting " + p);
        parseLiteral(at.text);
      }
      await writeText(p, out);
      state.files[p] = out;
    }
    state.dirtyFiles.clear();
    $("#dirtyBadge").hidden = true;
    $("#saveBtn").disabled = true;
    toast("Saved " + files.length + " file" + (files.length === 1 ? "" : "s"));
  } catch (e) {
    console.error(e);
    toast("Save failed: " + e.message, true);
  }
}

/* ---------- sheet (preview / review) ---------- */

function openSheet(title, mode, payload) {
  $("#sheetTitle").textContent = title;
  const fr = $("#sheetFrame"), pre = $("#sheetPre");
  fr.hidden = mode !== "iframe";
  pre.hidden = mode !== "text";
  $("#sheetReload").hidden = mode !== "iframe";
  if (mode === "iframe") fr.src = payload + "?t=" + Date.now();
  else pre.textContent = payload;
  $("#sheet").classList.add("open");
}

/* ---------- wiring ---------- */

$("#connectBtn").onclick = async () => {
  if (!window.showDirectoryPicker) {
    toast("This browser has no File System Access API - use Chrome or Edge.", true);
    return;
  }
  try {
    state.root = await window.showDirectoryPicker({ mode: "readwrite" });
    // confirm we actually landed on the repo root
    try { await state.root.getDirectoryHandle("assets"); }
    catch { state.root = null; toast("That folder has no assets/ - pick the repo root.", true); return; }

    $("#repoBadge").textContent = state.root.name;
    $("#repoBadge").className = "badge on";
    $("#saveBtn").disabled = state.dirtyFiles.size === 0;
    toast("Connected. Saving and image compression are live.");
  } catch { /* user cancelled */ }
};

$("#saveBtn").onclick = save;
$("#addBtn").onclick = () => {
  const d = ds(state.active);
  const blank = {};
  for (const f of d.fields) setPath(blank, f.k, f.type === "number" ? new Date().getFullYear() : "");
  setPath(blank, d.titleField, "New " + d.label.replace(/s$/, ""));
  state.data[state.active].unshift(blank);
  state.sel = 0;
  $("#filter").value = "";
  markDirty(); renderTabs(); renderList(); renderEditor();
};

$("#filter").oninput = () => renderList();

$("#previewBtn").onclick = () => {
  const d = ds(state.active);
  openSheet("Preview - " + d.page + (state.dirtyFiles.size ? "  (save first to see edits)" : ""), "iframe", d.page);
};

$("#diffBtn").onclick = () => {
  const files = [...state.dirtyFiles];
  if (!files.length) { toast("No pending changes."); return; }
  const out = files.map((p) => "/* ==== " + p + " ==== */\n\n" + buildFile(p)).join("\n\n");
  openSheet("Pending changes (" + files.length + " file" + (files.length === 1 ? "" : "s") + ")", "text", out);
};

$("#sheetClose").onclick = () => { $("#sheet").classList.remove("open"); $("#sheetFrame").src = "about:blank"; };
$("#sheetReload").onclick = () => { const f = $("#sheetFrame"); f.src = f.src.split("?")[0] + "?t=" + Date.now(); };

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); }
  if (e.key === "Escape") $("#sheetClose").click();
});

window.addEventListener("beforeunload", (e) => {
  if (state.dirtyFiles.size) { e.preventDefault(); e.returnValue = ""; }
});

loadAll().catch((e) => {
  console.error(e);
  toast("Could not load data files: " + e.message + " - is this served over http?", true);
});
