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

function Loader({ setIsLoaded }) {
    const { progress } = useProgress();

    useEffect(() => {
        if (progress === 100) {
            setIsLoaded(true);
        }
    }, [progress, setIsLoaded]);

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

function Model() {
    const { scene } = useGLTF('/models/free_download_male_surgical_doctor_working_222.glb');
    const { gl } = useThree();

    useEffect(() => {
        if (!scene) return;

        gl.physicallyCorrectLights = true;
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.frustumCulled = true;
            }
        });
    }, [scene, gl]);

    return scene ? (
        <Float
            speed={0.3}
            rotationIntensity={0.2}
            floatIntensity={0.1}
        >
            <primitive
                object={scene}
                scale={0.0451}
                position={[0, -3.8, 0]}
                rotation={[0, Math.PI * 0.25, 0]}
                dispose={null}
            />
        </Float>
    ) : null;
}

export default function ModelViewer() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verify model file exists
        fetch('/models/free_download_male_surgical_doctor_working_222.glb')
            .then(response => {
                if (!response.ok) throw new Error('Model not found');
            })
            .catch(err => setError(err.message));
    }, []);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center text-red-400">
                Error loading 3D model: {error}
            </div>
        );
    }

    return (
        <Canvas
            camera={{
                position: [0, 3, 9],
                fov: 55,
                near: 0.1,
                far: 100
            }}
            style={{ width: '100%', height: '100%', maxHeight: '600px' }}
            dpr={[1, 2]}
        >
            <Suspense fallback={<Loader setIsLoaded={setIsLoaded} />}>
                <Model />
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