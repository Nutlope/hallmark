import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const metadata = readFileSync(join(ROOT, 'agents', 'openai.yaml'), 'utf8');

test('OpenAI agent metadata uses one Codex prompt and omits empty optional dependencies', () => {
  assert.match(metadata, /^  default_prompt:\s*(?:"[^"\n]+"|'[^'\n]+'|[^#\n]+)$/m);
  assert.doesNotMatch(metadata, /^  default_prompts:/m);
  assert.doesNotMatch(metadata, /^dependencies:\s*\[\s*\]\s*$/m);
});
