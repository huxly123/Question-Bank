#!/usr/bin/env node
// Recomputes the progress bars and counts in DSA/TODO.md from its checkboxes.
// Run after ticking a problem:  node DSA/progress.js

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "TODO.md");
let text = fs.readFileSync(file, "utf8");

const bar = (done, total, width) => {
  const filled = total === 0 ? 0 : Math.round((done / total) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
};
const pct = (done, total) => (total === 0 ? 0 : Math.round((done / total) * 100));

// split into sections on "## N. Title"
const parts = text.split(/(?=^## \d+\. )/m);
let head = parts[0];
const sections = parts.slice(1).map((sec) => {
  const num = sec.match(/^## (\d+)\. /)[1];
  const done = (sec.match(/^- \[x\]/gm) || []).length;
  const total = done + (sec.match(/^- \[ \]/gm) || []).length;
  const stats = `_${done} / ${total} · \`${bar(done, total, 10)}\` ${pct(done, total)}%_`;
  sec = sec.replace(/^_\d+ \/ \d+.*_$/m, stats);
  return { num, done, total, sec };
});

const done = sections.reduce((s, x) => s + x.done, 0);
const total = sections.reduce((s, x) => s + x.total, 0);

// overall line + big bar
head = head.replace(/^\*\*Progress: .*\*\*$/m, `**Progress: ${done} / ${total} solved (${pct(done, total)}%)**`);
head = head.replace(/^`[█░]+` \d+%$/m, `\`${bar(done, total, 30)}\` ${pct(done, total)}%`);

// sections table rows: | n | [Title](#anchor) | done / total | bar pct |
for (const s of sections) {
  const row = new RegExp(`^(\\| ${s.num} \\| \\[.+?\\]\\(#.+?\\) \\| )\\d+ / \\d+ \\|.*$`, "m");
  head = head.replace(row, `$1${s.done} / ${s.total} | \`${bar(s.done, s.total, 10)}\` ${pct(s.done, s.total)}% |`);
}
// table header: make sure the Progress column exists
head = head.replace(/^\| # \| Section \| Solved \|$/m, "| # | Section | Solved | Progress |");
head = head.replace(/^\| --- \| --- \| --- \|$/m, "| --- | --- | --- | --- |");

fs.writeFileSync(file, head + sections.map((s) => s.sec).join(""));
console.log(`DSA progress: ${done} / ${total} (${pct(done, total)}%)`);
