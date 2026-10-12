const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nextDir = path.join(rootDir, '.next');
const prismaClientDir = path.join(rootDir, 'node_modules', '.prisma', 'client');

// 1. Clean stale Next.js build cache to prevent chunk ID mismatches (Cannot find module './xxxx.js')
if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('[clean-next] Cleaned .next build directory.');
  } catch (err) {
    console.warn('[clean-next] Note: Could not fully remove .next directory:', err.message);
  }
}

// 2. Clean any orphaned Prisma tmp engine files left by Windows/OneDrive locks
if (fs.existsSync(prismaClientDir)) {
  try {
    const files = fs.readdirSync(prismaClientDir);
    for (const file of files) {
      if (file.includes('.tmp')) {
        try {
          fs.rmSync(path.join(prismaClientDir, file), { force: true });
        } catch {}
      }
    }
  } catch {}
}
