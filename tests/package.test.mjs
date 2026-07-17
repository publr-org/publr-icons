import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));
const source = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");
const zig = await readFile(new URL("../publr_icons.zig", import.meta.url), "utf8");
const gallery = await readFile(new URL("../index.html", import.meta.url), "utf8");
const figmaManifest = JSON.parse(
  await readFile(new URL("../figma-plugin/manifest.json", import.meta.url), "utf8"),
);
const figmaPlugin = await readFile(new URL("../figma-plugin/code.js", import.meta.url), "utf8");

test("the package contains UI icons but no social brands", () => {
  const names = manifest.icons.map(({ name }) => name);
  assert.ok(names.includes("plus"));
  assert.ok(names.includes("settings"));
  for (const social of ["facebook", "github", "instagram", "linkedin", "tiktok", "x", "youtube"])
    assert.ok(!names.includes(social), `${social} leaked into the UI package`);
});

test("the gallery contains every manifest icon on one page", () => {
  for (const { name } of manifest.icons)
    assert.ok(gallery.includes(`data-name="${name}"`), `gallery is missing ${name}`);
  assert.equal((gallery.match(/class="icon-card"/g) ?? []).length, manifest.icons.length);
});

test("the offline Figma plugin contains every manifest icon", () => {
  assert.deepEqual(figmaManifest.editorType, ["figma"]);
  assert.deepEqual(figmaManifest.networkAccess.allowedDomains, ["none"]);
  assert.equal((figmaPlugin.match(/\"name\":/g) ?? []).length, manifest.icons.length);
  for (const { name } of manifest.icons)
    assert.ok(figmaPlugin.includes(`\"name\":\"${name}\"`), `Figma plugin is missing ${name}`);
});

test("committed adapters cover the manifest", () => {
  for (const { name } of manifest.icons) {
    assert.ok(source.includes(`${JSON.stringify(name)}:`), `TypeScript is missing ${name}`);
    assert.ok(zig.includes(`pub const ${name.replaceAll("-", "_")}:`), `Zig is missing ${name}`);
  }
});
