import { StyleSpecification } from 'maplibre-gl';

declare module 'maplibre-google-maps' {
  export function googleProtocol(
    params: { url: string },
    abortController?: AbortController
  ): Promise<{ data: ArrayBuffer }>;

  export function createGoogleStyle(
    id: string,
    mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain' | string,
    key: string
  ): StyleSpecification;
}
