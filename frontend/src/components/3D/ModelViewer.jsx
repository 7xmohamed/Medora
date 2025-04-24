/* eslint-disable no-unused-vars */
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    useGLTF,
    Environment,
    OrbitControls,
    useProgress,
    Html,
    Float
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
                <p className="text-white/80 text-sm font-medium">
                    {Math.round(progress)}% loaded
                </p>
            </div>
        </Html>
    );
}

function Model({ onLoaded }) {
    const { scene } = useGLTF('/models/free_download_male_surgical_doctor_working_222.glb');
    const { gl } = useThree();

    useEffect(() => {
        gl.physicallyCorrectLights = true;
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.frustumCulled = true;
            }
        });
        onLoaded?.();
    }, [scene, gl, onLoaded]);

    return (
        <Float
            speed={0.3}
            rotationIntensity={0.2}
            floatIntensity={0.1}
        >
            <primitive
                object={scene}
                scale={0.0451}  // Increased scale by 2%
                position={[0, -3.8, 0]}  // Slightly lowered vertical position
                rotation={[0, Math.PI * 0.25, 0]}
                dispose={null}
            />
        </Float>
    );
}

export default function ModelViewer() {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Canvas
            camera={{
                position: [0, 3, 9], // Moved camera further back and higher to fit the larger model
                fov: 55, // Wider field of view to accommodate the larger model
                near: 0.1,
                far: 100
            }}
            style={{ width: '100%', height: '100%', maxHeight: '600px' }} // Increased Canvas height to 600px
            dpr={[1, 2]}
        >
            <Suspense fallback={<Loader />}>
                <Model onLoaded={() => setIsLoaded(true)} />
                <Environment preset="city" intensity={0.5} />
                <ambientLight intensity={0.8} />
                <spotLight
                    position={[5, 5, 5]}
                    angle={0.15}
                    penumbra={1}
                    intensity={0.6}
                />
            </Suspense>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 2.5}
            />
        </Canvas>
    );
}

useGLTF.preload('/models/free_download_male_surgical_doctor_working_222.glb');
