import { ragAnswer } from '../api/_rag.ts';

async function main() {
  const queries = [
    'Tell me about yourself',
    'What projects have you worked on?',
  ];

  let passed = 0;
  for (const q of queries) {
    const result = await ragAnswer(q);
    if (result.error) {
      console.error(`FAIL: "${q}" -> ${result.error}`);
      process.exit(1);
    }
    if (!result.answer) {
      console.error(`FAIL: "${q}" -> empty answer`);
      process.exit(1);
    }
    console.log(`PASS: "${q}"`);
    console.log(`  → ${result.answer}`);
    if (result.via) console.log(`  (via ${result.via})`);
    passed++;
  }

  console.log(`\n✓ ${passed}/${queries.length} tests passed`);
}

main().catch((e) => {
  console.error('Test crashed:', e);
  process.exit(1);
});
