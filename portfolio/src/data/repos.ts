export type RepoStatus = 'flagship' | 'production' | 'showcase' | 'in-progress' | 'learning';

export interface Repo {
  slug: string;
  name: string;
  repo: string;
  desc: string;
  tech: string[];
  year: number;
  status: RepoStatus;
  live?: string;
  caseStudy?: boolean;
  /** Filter chip on /work; defaults by status (learning builds, otherwise open source). */
  category?: string;
}

export const statusLabels: Record<RepoStatus, string> = {
  flagship: 'Flagship',
  production: 'Published',
  showcase: 'Showcase',
  'in-progress': 'In progress',
  learning: 'Learning build',
};

const gh = (r: string) => `https://github.com/lkrjangid1/${r}`;

/** Descriptions are written here, not copied from the repos' READMEs. */
export const repos: Repo[] = [
  {
    slug: 'native-api-bindgen',
    name: 'native-api-bindgen',
    repo: gh('native-api-bindgen'),
    desc: 'Typed Dart and TypeScript bindings generated from the Android and Apple SDKs already on your machine. 97.1% of android.jar generated.',
    tech: ['Dart', 'JNI', 'libclang', 'JSI', 'TypeScript'],
    year: 2026,
    status: 'flagship',
    live: 'https://lkrjangid1.github.io/native-api-bindgen-docs/',
    caseStudy: true,
    category: 'tooling',
  },
  {
    slug: 'flutter-account-manager',
    name: 'flutter_account_manager',
    repo: gh('flutter_account_manager'),
    desc: 'Flutter plugin for native accounts, auth tokens and background sync: Android AccountManager and SyncAdapter, iOS Keychain and BGTaskScheduler.',
    tech: ['Dart', 'Kotlin', 'Swift', 'Pigeon'],
    year: 2026,
    status: 'production',
    live: 'https://pub.dev/packages/flutter_account_manager',
    category: 'tooling',
  },
  {
    slug: 'organic-chemistry-map',
    name: 'Organic chemistry map',
    repo: gh('Organic-Chemistry-Map'),
    desc: 'Zoomable map of organic reactions for JEE Advanced: compounds as nodes, reactions as edges, structures drawn from SMILES.',
    tech: ['React', 'TypeScript', 'React Flow', 'SMILES Drawer'],
    category: 'web',
    year: 2025,
    status: 'showcase',
  },
  {
    slug: 'fcm-admin',
    name: 'FCM admin',
    repo: gh('fcm_admin'),
    desc: 'Self-hosted push campaign panel: composer, scheduling, targeting, analytics and roles on top of Firebase Cloud Messaging. Backend first; frontend in progress.',
    tech: ['NestJS', 'BullMQ', 'Next.js', 'Firebase'],
    category: 'web',
    year: 2026,
    status: 'in-progress',
  },
  {
    slug: 'whiteboard-flutter',
    name: 'Whiteboard',
    repo: gh('whiteboard-flutter'),
    desc: 'Shared drawing canvas with real-time stroke sync over Firebase.',
    tech: ['Flutter', 'Firebase'],
    year: 2021,
    status: 'learning',
  },
  {
    slug: 'agora-in-flutter',
    name: 'Agora in Flutter',
    repo: gh('Agora-in-Flutter'),
    desc: 'Video calling in Flutter using the Agora UI kit.',
    tech: ['Flutter', 'Agora'],
    year: 2021,
    status: 'learning',
  },
  {
    slug: 'election-flutter-web3',
    name: 'Election dApp',
    repo: gh('Election-Flutter-Web3'),
    desc: 'Voting dApp: a Flutter client talking to a Solidity election contract.',
    tech: ['Flutter', 'Solidity', 'Web3'],
    year: 2023,
    status: 'learning',
  },
  {
    slug: 'google-personal-safety',
    name: 'Personal safety UI',
    repo: gh('Google-Personal-Safety'),
    desc: 'Jetpack Compose and Material 3 recreation of the Google Personal Safety home screen.',
    tech: ['Kotlin', 'Jetpack Compose', 'Material 3'],
    year: 2023,
    status: 'learning',
  },
  {
    slug: 'blob-file-downloader',
    name: 'Blob file downloader',
    repo: gh('Blob-file-downloader'),
    desc: 'Chrome extension that saves blob: URLs to disk.',
    tech: ['JavaScript', 'Chrome extension'],
    year: 2024,
    status: 'learning',
  },
  {
    slug: 'local-file-manager',
    name: 'local_file_manager',
    repo: gh('local_file_manager'),
    desc: 'Android file helpers for Flutter: regex search, sort, filter, copy, rename and delete. Builds on flutter_file_utils.',
    tech: ['Flutter', 'Dart'],
    year: 2021,
    status: 'learning',
  },
  {
    slug: 'telegram-index-api',
    name: 'telegram-index-api',
    repo: gh('telegram-index-api'),
    desc: 'Indexes Telegram channels and serves their files for browsing and download. Based on odysseusmax/tg-index.',
    tech: ['Python'],
    year: 2021,
    status: 'learning',
  },
  {
    slug: 'flask-basic-rest-api',
    name: 'flask-basic-rest-api',
    repo: gh('flask-basic-rest-api'),
    desc: 'Minimal REST API with Flask and a small database layer.',
    tech: ['Python', 'Flask'],
    year: 2023,
    status: 'learning',
  },
  {
    slug: 'wh-clone',
    name: 'WhatsApp clone',
    repo: gh('wh-clone'),
    desc: 'Early Flutter UI clone of WhatsApp.',
    tech: ['Flutter'],
    year: 2022,
    status: 'learning',
  },
  {
    slug: 'mysql-flutter',
    name: 'mysql-flutter',
    repo: gh('mysql-flutter'),
    desc: 'Experiment connecting a Dart client directly to MySQL.',
    tech: ['Dart', 'MySQL'],
    year: 2022,
    status: 'learning',
  },
];

const order: RepoStatus[] = ['flagship', 'production', 'showcase', 'in-progress', 'learning'];
export const sortedRepos = [...repos].sort(
  (a, b) => order.indexOf(a.status) - order.indexOf(b.status) || b.year - a.year,
);
