#!/usr/bin/env node
// Refreshes every checklist's counts and progress bars, plus the dashboard in TODO.md.
// Run from the repo root after ticking anything:  node progress.js
//
// A checklist is any .md file (outside the root) that contains "- [ ]" / "- [x]" items.
// If the file has a "**Progress:" header line, its header, bar and per-section stats are
// rewritten; a table row containing "](#<section-anchor>)" followed by "| d / t |" is updated too.

const fs = require("fs");
const path = require("path");

const root = __dirname;
const SKIP = new Set([".git", ".claude", "graphify-out", "node_modules", "scratch"]);

const bar = (d, t, w) => {
  const f = t === 0 ? 0 : Math.round((d / t) * w);
  return "█".repeat(f) + "░".repeat(w - f);
};
const pct = (d, t) => (t === 0 ? 0 : Math.round((d / t) * 100));
const slug = (h) => h.toLowerCase().replace(/[^\w\- ]/g, "").replace(/ /g, "-");
const count = (s) => {
  const done = (s.match(/^- \[x\]/gim) || []).length;
  return { done, total: done + (s.match(/^- \[ \]/gm) || []).length };
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md") && !(dir === root && e.name === "TODO.md")) out.push(p);
  }
  return out;
}

function refresh(file) {
  let text = fs.readFileSync(file, "utf8");
  const { done, total } = count(text);
  if (total === 0) return null;

  if (/^\*\*Progress: /m.test(text)) {
    // split on H2 headings, keep the preamble
    const parts = text.split(/(?=^## )/m);
    let head = parts[0];
    const sections = parts.slice(1).map((sec) => {
      const title = sec.match(/^## (.+)$/m)[1];
      const c = count(sec);
      const stats = `_${c.done} / ${c.total} · \`${bar(c.done, c.total, 10)}\` ${pct(c.done, c.total)}%_`;
      const lines = sec.split("\n");
      // stats line sits right after the heading (and its blank line); replace or insert
      let i = 1;
      while (i < lines.length && lines[i].trim() === "") i++;
      if (/^_\d+ \/ \d+/.test(lines[i] || "")) lines[i] = stats;
      else lines.splice(1, 0, "", stats);
      return { title, ...c, sec: lines.join("\n") };
    });
    head = head.replace(/^\*\*Progress: .*\*\*$/m, `**Progress: ${done} / ${total} done (${pct(done, total)}%)**`);
    head = head.replace(/^`[█░]+` \d+%$/m, `\`${bar(done, total, 30)}\` ${pct(done, total)}%`);
    for (const s of sections) {
      const row = new RegExp(`^(\\|.*\\]\\(#${slug(s.title)}\\) \\| )\\d+ / \\d+ \\|.*$`, "m");
      head = head.replace(row, `$1${s.done} / ${s.total} | \`${bar(s.done, s.total, 10)}\` ${pct(s.done, s.total)}% |`);
    }
    text = head + sections.map((s) => s.sec).join("");
    fs.writeFileSync(file, text);
  }

  const h1 = (text.match(/^# (.+)$/m) || [, path.basename(file)])[1].split(" — ")[0].trim();
  return { file: path.relative(root, file), label: h1, done, total };
}

const areas = walk(root).map(refresh).filter(Boolean).sort((a, b) => a.label.localeCompare(b.label));
const done = areas.reduce((s, a) => s + a.done, 0);
const total = areas.reduce((s, a) => s + a.total, 0);

const rows = areas.map((a) => `| [${a.label}](${a.file}) | ${a.done} / ${a.total} | \`${bar(a.done, a.total, 12)}\` ${pct(a.done, a.total)}% |`);
const dash = [
  "<!-- progress:start -->",
  `**Overall: ${done} / ${total} done (${pct(done, total)}%)**`,
  "",
  `\`${bar(done, total, 30)}\` ${pct(done, total)}%`,
  "",
  "| Area | Done | Progress |",
  "| --- | --- | --- |",
  ...rows,
  "<!-- progress:end -->",
].join("\n");

const todo = path.join(root, "TODO.md");
const t = fs.readFileSync(todo, "utf8");
fs.writeFileSync(todo, t.replace(/<!-- progress:start -->[\s\S]*?<!-- progress:end -->/, dash));

for (const a of areas) console.log(`${a.label.padEnd(44)} ${String(a.done).padStart(3)} / ${a.total}`);
console.log(`${"Overall".padEnd(44)} ${String(done).padStart(3)} / ${total} (${pct(done, total)}%)`);
