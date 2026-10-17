// Identity, copy and curated config. Project content itself comes from projects.json.

export const site = {
  name: 'Lokesh Jangid',
  first: 'Lokesh',
  last: 'Jangid',
  initials: 'LJ',
  handle: 'lkrjangid',
  url: 'https://lkrjangid-portfolio.web.app',
  role: 'Senior Mobile Engineer',
  stack: 'Flutter · Android (Kotlin) · iOS (SwiftUI)',
  location: 'Gurgaon, India',
  timezone: 'Asia/Kolkata',
  email: 'lkrjangid1@gmail.com',
  status: 'Open to senior mobile roles',
  statusSub: 'Full-time · Consulting · Code review',
  intro:
    'Senior Mobile Engineer at Univest. I build Flutter, Android and iOS apps for 9M+ users, and the tooling underneath them.',
  description:
    'Lokesh Jangid is a Senior Mobile Engineer at Univest building Flutter, Android and iOS apps for 9M+ users, plus native bindings, code push and 24 pub.dev packages.',
  currently: [
    { label: 'Senior Software Engineer', at: '@ Univest' },
    { label: 'Building', at: 'native-api-bindgen' },
    { label: 'Shipping', at: 'PushPatch' },
  ],
  bio: [
    'Senior Mobile Engineer with 4+ years shipping high-scale consumer apps across Flutter, native Android (Kotlin) and native iOS (Swift/SwiftUI).',
    'At Univest I build brokerage order flows, mutual funds, payments and the Scalper trading terminal for 9M+ users. The rest of the time I build the layer underneath: native-api-bindgen, a self-hosted code push that became PushPatch, and packages on pub.dev.',
  ],
  availability: 'Open to senior mobile and platform roles · replies within 2 days',
  resume: '/resume.pdf',
  links: {
    github: 'https://github.com/lkrjangid1',
    linkedin: 'https://www.linkedin.com/in/lkrjangid',
    x: 'https://x.com/lkrjangid',
    gdev: 'https://g.dev/lkrjangid',
    pubdev: 'https://pub.dev/publishers/lkrjangid.tech/packages',
    blog: 'https://flutdev.blogspot.com/',
    holopin: 'https://holopin.io/@lkrjangid',
  },
} as const;

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/open-source', label: 'Open source' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
] as const;

/** Big numbers under the hero. `packages` and `articles` are filled in at build time. */
export const proof = [
  { value: 9, suffix: 'M+', label: 'Users served', href: 'https://play.google.com/store/apps/details?id=com.univest.capp' },
  { value: 10, suffix: 'M+', label: 'Play downloads', href: 'https://play.google.com/store/apps/details?id=com.univest.capp' },
  { value: 600, suffix: 'K+', label: 'Libgen downloads', href: 'https://play.google.com/store/apps/details?id=com.yaaratech.libgen' },
  { key: 'packages', value: 24, suffix: '', label: 'pub.dev packages', href: 'https://pub.dev/publishers/lkrjangid.tech/packages' },
  { key: 'articles', value: 177, suffix: '+', label: 'Articles written', href: 'https://flutdev.blogspot.com/' },
] as const;

export const wins = [
  ['Cold start', '5.5s → 2.0s'],
  ['Crash-free', '70% → 95%'],
  ['₹14L/yr', 'saved with self-hosted code push'],
  ['~1 µs', 'native calls vs ~270 µs'],
  ['+20%', 'derivative trades with Scalper'],
  ['₹1.06 Cr+', 'mutual funds processed'],
  ['Hotfixes', 'days → minutes'],
  ['97.1%', 'of android.jar generated'],
  ['−50%', 'API calls at Univest'],
] as const;

/** Per-product presentation: brand accent, icon file in src/assets/icons, monogram fallback. */
export const appMeta: Record<string, { accent: string; icon?: string; mono: string }> = {
  univest: { accent: '#2fb36e', icon: 'univest', mono: 'U' },
  scalper: { accent: '#f4b63a', icon: 'scalper', mono: 'S' },
  'self-hosted-code-push': { accent: '#ff7a45', mono: 'CP' },
  pushpatch: { accent: '#4c7dff', icon: 'pushpatch', mono: 'P' },
  'native-api-bindgen': { accent: '#3db9ff', mono: 'nb' },
  'incognito-vault': { accent: '#5fd3a8', icon: 'incognito-vault', mono: 'iV' },
  'finsight-ai': { accent: '#2fb36e', mono: 'Fi' },
  'oi-visualizer': { accent: '#19c3b4', mono: 'OI' },
  libgen: { accent: '#5b8def', icon: 'libgen', mono: 'L' },
  searchly: { accent: '#8b7cf6', icon: 'searchly', mono: 'Se' },
  'remote-jobs': { accent: '#f2c230', icon: 'remote-jobs', mono: 'R' },
  'mbm-e-learning': { accent: '#c8234a', icon: 'mbm-e-learning', mono: 'M' },
  raksha: { accent: '#ff4f81', mono: 'Ra' },
  buckrate: { accent: '#f5c218', mono: 'B' },
  weblm: { accent: '#8a95a8', mono: 'W' },
  'greenhouse-monitoring-control': { accent: '#57c46b', mono: 'G' },
  'research-assistant': { accent: '#5f8cff', mono: 'AI' },
  seedfuel: { accent: '#d79a3b', icon: 'seedfuel', mono: 'Sf' },
};

/** Shorter names for tiles and dock tooltips when the projects.json title is long. */
export const shortNames: Record<string, string> = {
  'research-assistant': 'AI research assistant',
  'greenhouse-monitoring-control': 'Greenhouse IoT',
};

/** Projects whose screenshots are store graphics that already include a device frame. */
export const framedShots = new Set(['searchly', 'remote-jobs', 'mbm-e-learning']);

/** The "Now shipping" reel on the home page, in order. Copy and links come from projects.json. */
export const reel = [
  { slug: 'univest', platform: 'Android · iOS · Flutter, Kotlin, SwiftUI', tagline: 'Trading and investing for 9M+ people.', visual: 'phones' },
  { slug: 'scalper', platform: 'Inside Univest · Flutter custom rendering', tagline: 'A trading terminal, built from scratch in under a month.', visual: 'phone' },
  { slug: 'pushpatch', platform: 'Desktop · CLI · Web dashboard', tagline: 'Fix production Flutter apps in minutes, not review cycles.', visual: 'laptop' },
  { slug: 'native-api-bindgen', platform: 'Open source · Dart, JNI, libclang, JSI', tagline: 'Use native APIs directly. No MethodChannel.', visual: 'terminal' },
  { slug: 'libgen', platform: 'Android · iPhone (Quillshelf) · Flutter', tagline: 'Every book source, one beautiful reader.', visual: 'phone' },
  { slug: 'incognito-vault', platform: 'Chrome extension · macOS app', tagline: 'Keep the chats you meant to keep.', visual: 'browser' },
] as const;

export type ReelVisual = (typeof reel)[number]['visual'];

/** Category per project slug. Anything missing falls back to the heuristic in projects.ts. */
export const categoryOverrides: Record<string, string> = {
  univest: 'production',
  scalper: 'production',
  'self-hosted-code-push': 'production',
  'finsight-ai': 'production',
  pushpatch: 'product',
  libgen: 'apps',
  searchly: 'apps',
  'remote-jobs': 'apps',
  'mbm-e-learning': 'apps',
  'incognito-vault': 'apps',
  'oi-visualizer': 'apps',
  raksha: 'ai-iot',
  'greenhouse-monitoring-control': 'ai-iot',
  'research-assistant': 'ai-iot',
  weblm: 'ai-iot',
  buckrate: 'ai-iot',
  seedfuel: 'web',
};

export const categoryLabels: Record<string, string> = {
  production: 'Production',
  product: 'Product',
  apps: 'Apps',
  'ai-iot': 'AI & IoT',
  web: 'Web',
  tooling: 'Tooling',
  'open-source': 'Open source',
  learning: 'Learning builds',
  other: 'Other',
};

export const featured = ['univest', 'scalper', 'self-hosted-code-push', 'pushpatch'];

/** From the résumé (public/resume.pdf). */
export const experience = [
  {
    role: 'Senior Software Engineer',
    company: 'Univest Communication Pvt. Ltd.',
    place: 'Gurgaon',
    period: '04/2024 – Present',
    current: true,
    summary: 'Brokerage, mutual funds, payments and platform engineering for a 9M+ user trading app.',
    points: [
      'Architected brokerage order placement and management, built for security, scale and low latency.',
      'Raised crash-free users from 70% to 95% and cut cold start from 5.5s to 2.0s (64%).',
      'Delivered mutual funds end to end on BSE across four payment modes: 3K+ orders, ₹1.06 Cr+.',
      'Built Scalper, a TradingView-style chart engine, from scratch in under a month (~20% more derivative trades).',
      'Reverse-engineered Shorebird into a self-hosted code push: hotfixes in minutes, ₹14L+ a year saved.',
      'Set up CI/CD from zero, Appium E2E for QA, and mentored two junior engineers.',
    ],
  },
  {
    role: 'Software Developer',
    company: 'Timemarks Examiner Pvt. Ltd.',
    place: 'Jaipur',
    period: '02/2021 – 03/2024',
    current: false,
    summary: 'Early engineer at a bootstrapped EdTech startup; led 4 interns across 6 products.',
    points: [
      'Studyem: white-label Flutter LMS for ~5 institutes and 1,000+ students, with RabbitMQ chat, video calls and a live whiteboard.',
      'Live quiz platform sustaining ~400 peak concurrent users; API usage cut 70% with SQLite caching.',
      'Studyem Web as an installable Flutter PWA; Timevictor edu-gaming; Buckrate livestock marketplace with AI weight estimation.',
    ],
  },
] as const;

export const education = [
  { degree: 'Master of Computer Applications', school: 'Uttaranchal University, Dehradun', period: '2024 – 2026', note: 'Pursuing' },
  { degree: 'B.E. Electrical Engineering', school: 'MBM University, Jodhpur', period: '2019 – 2023', note: 'CGPA 8.28' },
] as const;

export const achievements = [
  'Winner, Incubation & Funding Round (SSIP), IIIT Surat, for Raksha',
  'Hacktoberfest 2020 and 2021 open-source contributor',
  '600K+ cumulative downloads across self-published Play Store apps',
] as const;

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Dart', 'Kotlin', 'Swift', 'Python', 'JavaScript'] },
  { group: 'Mobile', items: ['Flutter', 'Android SDK', 'Jetpack Compose', 'SwiftUI', 'UIKit', 'PWA', 'BLE'] },
  { group: 'Architecture', items: ['BLoC', 'Riverpod', 'Provider', 'GetX', 'MVVM', 'Clean Architecture', 'GetIt'] },
  { group: 'Real-time', items: ['WebSockets', 'RabbitMQ', 'REST', 'Firebase'] },
  { group: 'Payments', items: ['Juspay headless', 'Razorpay', 'BSE', 'UPI Intent / Collect', 'RevenueCat'] },
  { group: 'Performance', items: ['Cold start', 'Memory leaks', 'Rendering', 'R8 / ProGuard', 'App size'] },
  { group: 'Delivery', items: ['CI/CD', 'GitHub Actions', 'OTA code push', 'Appium', 'Shell'] },
  { group: 'Native interop', items: ['JNI', 'package:jni', 'Objective-C runtime', 'JSI', 'libclang', 'Pigeon'] },
];

/**
 * Skills radar. Level is a tier, not a percentage: 3 = core (daily, shipped at scale), 2 = strong
 * (shipped in production), 1 = working knowledge. Tiers were drafted from résumé emphasis;
 * TODO(Lokesh): adjust any that feel off.
 */
export type SkillLevel = 1 | 2 | 3;
export const skillTiers: Record<SkillLevel, string> = { 3: 'Core', 2: 'Strong', 1: 'Working' };
export const radar: { group: string; color: string; blurb: string; skills: { name: string; level: SkillLevel }[] }[] = [
  {
    group: 'Mobile', color: '#3db9ff', blurb: 'Flutter first, with native Android and iOS when the app needs it.',
    skills: [
      { name: 'Flutter', level: 3 }, { name: 'Dart', level: 3 }, { name: 'Kotlin · Compose', level: 2 },
      { name: 'Swift · SwiftUI', level: 2 }, { name: 'Flutter Web · PWA', level: 2 }, { name: 'UIKit', level: 1 },
    ],
  },
  {
    group: 'Native interop', color: '#9a7cff', blurb: 'The layer under the app: bindings, channels and runtimes.',
    skills: [
      { name: 'JNI · package:jni', level: 3 }, { name: 'Pigeon · channels', level: 3 }, { name: 'Obj-C runtime', level: 2 },
      { name: 'libclang', level: 2 }, { name: 'JSI · React Native', level: 1 },
    ],
  },
  {
    group: 'Fintech', color: '#2fb36e', blurb: 'Order flows, payments and live market data for 9M+ users.',
    skills: [
      { name: 'WebSockets', level: 3 }, { name: 'Juspay headless', level: 3 }, { name: 'BSE · UPI', level: 3 },
      { name: 'Razorpay', level: 2 }, { name: 'RabbitMQ', level: 2 },
    ],
  },
  {
    group: 'Delivery', color: '#ff7a45', blurb: 'Shipping fast and safely: code push, CI and performance.',
    skills: [
      { name: 'OTA code push', level: 3 }, { name: 'Cold start · perf', level: 3 }, { name: 'GitHub Actions', level: 2 },
      { name: 'R8 · Gradle', level: 2 }, { name: 'Appium', level: 1 },
    ],
  },
  {
    group: 'Backend & data', color: '#f4b63a', blurb: 'Enough backend to ship products end to end.',
    skills: [
      { name: 'Firebase', level: 3 }, { name: 'SQLite · Room', level: 2 }, { name: 'Python · FastAPI', level: 2 },
      { name: 'NestJS', level: 1 }, { name: 'MongoDB', level: 1 },
    ],
  },
  {
    group: 'AI & IoT', color: '#ff4f81', blurb: 'Computer vision, LLM apps and hardware side projects.',
    skills: [
      { name: 'ESP32 · IoT', level: 2 }, { name: 'Gemini · LangChain', level: 1 }, { name: 'OpenCV', level: 1 }, { name: 'PaddleOCR', level: 1 },
    ],
  },
];

export interface Post {
  title: string;
  date: string;
  url: string;
  series?: string;
}

/** Selected FlutDev posts. Each links to the canonical Blogspot original. */
export const writing: Post[] = [
  { series: 'Shorebird internals', title: 'Part 4: The science behind Shorebird — how a .so file becomes a running app', date: '2026-05-14', url: 'https://flutdev.blogspot.com/2026/05/part-4-shorebird-science-behind.html' },
  { series: 'Shorebird internals', title: 'Part 3: shorebird.cc and updater.rs', date: '2026-05-14', url: 'https://flutdev.blogspot.com/2026/05/part-3-shorebird-shorebirdcc-updaterrs.html' },
  { series: 'Shorebird internals', title: 'Part 2: bidiff algorithm and zstd compression', date: '2026-05-14', url: 'https://flutdev.blogspot.com/2026/05/part-2-bidiff-algorithm-zstd-compression.html' },
  { series: 'Shorebird internals', title: 'Part 1: How Shorebird actually works — complete internal flow', date: '2026-05-14', url: 'https://flutdev.blogspot.com/2026/05/part-1-how-shorebird-actually-works.html' },
  { title: 'UIKit iOS development from first principles — a SecureRoom deep dive', date: '2026-02-23', url: 'https://flutdev.blogspot.com/2026/02/uikit-ios-development-from-first.html' },
  { title: 'iOS development with SwiftUI — a FinSightAI deep dive', date: '2026-02-23', url: 'https://flutdev.blogspot.com/2026/02/ios-development-from-first-principles.html' },
  { title: 'Android activity alias in Flutter', date: '2026-02-08', url: 'https://flutdev.blogspot.com/2026/02/android-activity-alias-in-flutter.html' },
  { title: 'Understanding Pigeon methods in Flutter for native communication', date: '2026-02-03', url: 'https://flutdev.blogspot.com/2026/02/understanding-pigeon-methods-in-flutter.html' },
  { title: 'Embedding a Flutter screen inside an existing Android and iOS app', date: '2026-02-03', url: 'https://flutdev.blogspot.com/2026/02/embedding-flutter-screen-inside.html' },
  { title: 'Tracking users from ad campaigns with Install Referrer and deferred deep links', date: '2025-12-18', url: 'https://flutdev.blogspot.com/2025/12/tracking-users-from-ads-campaigns-in.html' },
  { title: 'Reducing Flutter app size: essential tips and techniques', date: '2024-05-31', url: 'https://flutdev.blogspot.com/2024/05/reducing-flutter-app-size-essential.html' },
  { title: 'Optimize your Flutter app with tree shaking', date: '2024-05-26', url: 'https://flutdev.blogspot.com/2024/05/optimize-your-flutter-app-for.html' },
  { title: 'How to find memory leaks in Flutter', date: '2024-02-13', url: 'https://flutdev.blogspot.com/2024/02/how-to-find-memory-leaks-in-flutter.html' },
  { title: 'How to read the Flutter frame chart in DevTools', date: '2023-12-21', url: 'https://flutdev.blogspot.com/2023/12/how-to-read-flutter-frame-chart-in.html' },
];

/** Fallback when the FlutDev feed can't be reached at build time. */
export const writingTotal = 177;
