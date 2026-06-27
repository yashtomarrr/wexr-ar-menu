/**
 * JSX typing for Google's <model-viewer> web component so we can use it
 * directly inside TSX. We expose only the attributes this project uses.
 */
import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          poster?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'auto-rotate-delay'?: number;
          'rotation-per-second'?: string;
          'shadow-intensity'?: string | number;
          'shadow-softness'?: string | number;
          'environment-image'?: string;
          exposure?: string | number;
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'interaction-prompt'?: string;
          'touch-action'?: string;
          loading?: string;
          reveal?: string;
          scale?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
