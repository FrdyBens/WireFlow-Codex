import { RoutingSegment } from '../../types/project';

export const SLACK_FACTOR = 0.05;
export const MIN_SLACK_METERS = 0.5;

export function estimateSlack(segment: Pick<RoutingSegment, 'length'>): number {
  return Math.max(segment.length * SLACK_FACTOR, MIN_SLACK_METERS);
}
