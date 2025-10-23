import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Changelog - The Fusion Space Inc',
  description: 'Notable changes and updates to the platform.'
};

function getChangelog(): string | null {
  try {
    const p = path.join(process.cwd(), 'CHANGELOG.md');
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

export default function ChangelogPage() {
  const content = getChangelog();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Changelog</h1>
      {!content ? (
        <p className="mt-6 text-indigo-200/80">No changelog found.</p>
      ) : (
        <pre className="mt-6 whitespace-pre-wrap rounded-lg border border-indigo-900/30 bg-indigo-950/30 p-4 text-indigo-100">
          {content}
        </pre>
      )}
    </main>
  );
}
