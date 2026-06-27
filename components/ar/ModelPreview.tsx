'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  Bounds,
  useGLTF,
  Html,
  useProgress,
} from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Spinner } from '@/components/ui/Spinner';

/**
 * In-page interactive 3D preview using React Three Fiber + drei.
 * Drag to rotate, pinch/scroll to zoom, and a Reset control re-frames the model.
 * (The fullscreen "place in your room" AR is handled by ARViewer/model-viewer.)
 */

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <Spinner size={34} />
        <span className="text-xs text-muted">{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

function Model({ url, rotationY = 0 }: { url: string; rotationY?: number }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} rotation={[0, (rotationY * Math.PI) / 180, 0]} />
    </Center>
  );
}

export function ModelPreview({
  url,
  rotationY = 0,
}: {
  url: string;
  rotationY?: number;
}) {
  const controls = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="relative h-full w-full">
      <Canvas shadows camera={{ position: [0, 0.6, 3.2], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow />
        <Suspense fallback={<Loader />}>
          {/* Bounds auto-frames the model regardless of its native scale */}
          <Bounds fit clip observe margin={1.1}>
            <Model url={url} rotationY={rotationY} />
          </Bounds>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={8} blur={2.6} far={3} />
        <OrbitControls
          ref={controls}
          enablePan={false}
          minDistance={1.4}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>

      <button
        onClick={() => controls.current?.reset()}
        className="absolute bottom-3 left-3 rounded-full border border-hairline bg-black/50 px-3 py-1.5 text-xs text-ink backdrop-blur hover:border-gold/40"
      >
        ↺ Reset view
      </button>
    </div>
  );
}
