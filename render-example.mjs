#!/usr/bin/env node
// A small terminal handoff to the existing, separately downloaded Drawbly kit.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
async function run(command, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {stdio: 'inherit', windowsHide: true, shell: false});
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`${path.basename(command)} exited ${code}`)));
  });
}
async function main() {
  const [kitArg, outputArg, recipeArg, ...extra] = process.argv.slice(2);
  if (!kitArg || !outputArg || extra.length) {
    throw new Error('Usage: node render-example.mjs <renderer-kit-folder> <new-output-folder> [recipe.video.json]');
  }
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 14)) throw new Error('Use Node.js 22.14 or newer.');
  const kit = path.resolve(kitArg), output = path.resolve(outputArg);
  const recipe = recipeArg ? path.resolve(recipeArg) : path.join(here, 'api-request.video.json');
  await fs.access(path.join(kit, 'render-recipe.mjs'));
  await fs.access(recipe);
  const input = JSON.parse(await fs.readFile(recipe, 'utf8'));
  if (input.kind !== 'drawbly-video' || input.version !== 1) throw new Error('Expected a Drawbly version 1 video recipe.');
  // Refuse an existing directory, even when it appears empty. Retain failed runs for diagnosis.
  await fs.mkdir(output);
  const video = path.join(output, 'api-request.mp4');
  await run(process.execPath, [path.join(kit, 'render-recipe.mjs'), recipe, video]);
  await run(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-n', '-sseof', '-0.1', '-i', video,
    '-frames:v', '1', path.join(output, 'preview.png'),
  ]);
  console.log(`Ready: ${output}\nOpen api-request.drawing.json through Files in Drawbly to edit the diagram.`);
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
