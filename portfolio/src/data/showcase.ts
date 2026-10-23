import type { ImageMetadata } from 'astro';
import libgen from '../assets/showcase/libgen.png';
import libgenLight from '../assets/showcase/libgen-light.png';
import univest from '../assets/showcase/univest.png';
import scalper from '../assets/showcase/scalper.png';
import pushpatch from '../assets/showcase/pushpatch.png';
import vault from '../assets/showcase/incognito-vault.png';
import bindgen from '../assets/showcase/native-api-bindgen.png';

/** Promo film for a home showcase slide: a 16:9 poster plus the clip it opens (served from public/showcase). */
export interface ShowcaseMedia {
  thumb: ImageMetadata;
  /** Poster for the light theme, when the film has one. */
  thumbLight?: ImageMetadata;
  video: string;
  /** Seconds. */
  duration: number;
}

export const showcaseMedia: Record<string, ShowcaseMedia> = {
  libgen: { thumb: libgen, thumbLight: libgenLight, video: '/showcase/libgen.mp4', duration: 20 },
  univest: { thumb: univest, video: '/showcase/univest.mp4', duration: 38 },
  scalper: { thumb: scalper, video: '/showcase/scalper.mp4', duration: 30 },
  pushpatch: { thumb: pushpatch, video: '/showcase/pushpatch.mp4', duration: 35 },
  'incognito-vault': { thumb: vault, video: '/showcase/incognito-vault.mp4', duration: 32 },
  'native-api-bindgen': { thumb: bindgen, video: '/showcase/native-api-bindgen.mp4', duration: 35 },
};

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
