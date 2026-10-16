export const site = {
  name: 'Lokesh Jangid',
  initials: 'LJ',
  url: 'https://lkrjangid-portfolio.web.app',
  role: 'Senior Mobile Engineer',
  eyebrow: 'Senior Mobile Engineer · Flutter, Android (Kotlin), iOS (SwiftUI)',
  claim: 'I build the layer under the app: native bindings, delivery pipelines, and the Flutter apps on top.',
  claimShort: 'I build the layer under the app.',
  sub: 'Senior engineer at Univest, a fintech app serving 9M+ users. Currently shipping native-api-bindgen, typed Dart and TypeScript bindings generated from the SDKs already on your machine.',
  description:
    'Lokesh Jangid is a senior mobile engineer building Flutter, Android and iOS apps at fintech scale, plus the native bindings and delivery pipelines underneath them.',
  bio: [
    'Senior mobile engineer at Univest, where I build brokerage order flows, mutual funds, payments and the in-house Scalper charting terminal for 9M+ users.',
    'Outside work I build the tooling layer: native-api-bindgen, a self-hosted Flutter code push that became PushPatch, and 24 packages on pub.dev.',
  ],
  availability: 'Open to senior mobile and platform engineering roles · replies within 2 days',
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

export interface Metric {
  label: string;
  value: string;
  note: string;
  sourceUrl: string;
}

const UNIVEST_PLAY = 'https://play.google.com/store/apps/details?id=com.univest.capp';

export const metrics: Metric[] = [
  { label: 'Users served', value: '9M+', note: 'Univest, Play Store', sourceUrl: UNIVEST_PLAY },
  { label: 'Cold start', value: '5.5s → 2.0s', note: '64% faster at Univest', sourceUrl: '/work/univest' },
  { label: 'Infra cost saved', value: '₹14L+/yr', note: 'Self-hosted code push', sourceUrl: '/work/self-hosted-code-push' },
  { label: 'pub.dev packages', value: '24', note: 'Publisher lkrjangid.tech', sourceUrl: site.links.pubdev },
];

export const secondaryMetrics: Metric[] = [
  { label: 'Crash-free users', value: '70% → 95%', note: 'Univest', sourceUrl: '/work/univest' },
  { label: 'Libgen downloads', value: '600K+', note: 'Solo-built, Play Store', sourceUrl: 'https://play.google.com/store/apps/details?id=com.yaaratech.libgen' },
  { label: 'Native call latency', value: '~1 µs', note: 'vs ~270 µs MethodChannel', sourceUrl: '/work/native-api-bindgen' },
  { label: 'Derivative trades', value: '+20%', note: 'Scalper chart engine', sourceUrl: '/work/scalper' },
];

/** Category per project slug. Anything missing falls back to the heuristic in projects.ts. */
export const categoryOverrides: Record<string, string> = {
  univest: 'production',
  scalper: 'production',
  'self-hosted-code-push': 'production',
  'finsight-ai': 'production',
  pushpatch: 'product',
  libgen: 'apps',
  'remote-jobs': 'apps',
  'mbm-e-learning': 'apps',
  'incognito-vault': 'apps',
  'oi-visualizer': 'apps',
  raksha: 'ai-iot',
  'greenhouse-monitoring-control': 'ai-iot',
  'ai-based-research-paper-search-summarization-and-chat-application': 'ai-iot',
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

export const timeline = [
  { label: 'Senior Software Engineer, Univest', detail: 'Brokerage, mutual funds, payments, Scalper, code push', period: '04/2024 – now' },
  { label: 'Platform tooling', detail: 'native-api-bindgen, PushPatch, 24 pub.dev packages', period: '2025 – now' },
  // TODO(Lokesh): confirm title and dates for Timemarks and the indie-apps period.
  { label: 'Timemarks', detail: 'Buckrate livestock marketplace and computer-vision weight estimator', period: 'Flutter Web' },
  { label: 'Indie apps', detail: 'Libgen (600K+ downloads), Remote Jobs, MBM E-Learning', period: 'self-published' },
  { label: 'Learning builds', detail: 'WhatsApp clone, Agora video, Web3 voting, Hacktoberfest 2020 and 2021', period: '2020 – 2023' },
];

export const education = [
  { label: 'MCA', detail: 'Final project: AI research-paper search, summarization and chat' },
  { label: 'B.Tech', detail: 'Final project: greenhouse monitoring and control over IoT' },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Dart', 'Kotlin', 'Swift', 'Python', 'JavaScript', 'TypeScript'] },
  { group: 'Mobile', items: ['Flutter', 'Android SDK', 'Jetpack Compose', 'SwiftUI', 'UIKit', 'BLE'] },
  { group: 'Native interop', items: ['JNI', 'package:jni', 'Objective-C runtime', 'JSI', 'libclang', 'Pigeon'] },
  { group: 'Architecture', items: ['BLoC', 'Riverpod', 'Provider', 'GetX', 'MVVM', 'Clean Architecture'] },
  { group: 'Real-time & networking', items: ['WebSockets', 'REST', 'RabbitMQ', 'Firebase (Auth, Firestore, FCM)'] },
  { group: 'Payments & fintech', items: ['Juspay headless', 'Razorpay', 'BSE', 'UPI Intent / Collect', 'RevenueCat'] },
  { group: 'Performance & delivery', items: ['Cold-start tuning', 'R8 / ProGuard', 'OTA code push', 'CI/CD', 'GitHub Actions'] },
  { group: 'Data & tools', items: ['SQLite', 'Room', 'OpenCV', 'AppsFlyer', 'CleverTap', 'Figma', 'ESP32'] },
];

export interface Post {
  title: string;
  date: string;
  url: string;
  series?: string;
}

/** Selected FlutDev posts (177 total). Each links to the canonical Blogspot original. */
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

export const writingTotal = 177;
