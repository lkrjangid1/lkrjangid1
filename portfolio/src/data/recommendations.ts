import { z } from 'zod';
import { readRepoJson } from './source';

/** LinkedIn recommendations, from recommendations.json at the profile repo root. */
export const RecommendationSchema = z.object({
  title: z.string().min(1),
  profile: z.string().url(),
  subtitle: z.string().default(''),
  recommendation: z.string().min(1),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

let cache: Promise<Recommendation[]> | undefined;

export function getRecommendations(): Promise<Recommendation[]> {
  cache ??= readRepoJson('recommendations.json').then((d) => z.array(RecommendationSchema).parse(d));
  return cache;
}
