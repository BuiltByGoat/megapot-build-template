import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'templates', 'marketing');
const to = join(root, 'public', 'starter', 'marketing');

mkdirSync(to, { recursive: true });
cpSync(join(from, 'index.html'), join(to, 'index.html'));
cpSync(join(from, 'cribble.css'), join(to, 'cribble.css'));
