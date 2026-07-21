// Generate a VAPID key pair for Web Push. Run: `npm run gen-vapid`
// Put the PUBLIC key in VITE_VAPID_PUBLIC_KEY (frontend) and set both keys as
// edge-function secrets: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY.
import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();
console.log('\nVAPID keys generated — store these securely.\n');
console.log('VITE_VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
console.log('\nThen: supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:you@deadlinemate.com\n');
