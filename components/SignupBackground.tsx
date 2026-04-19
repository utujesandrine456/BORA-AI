'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function SignupBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 100 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 50;
            const y = (clientY / window.innerHeight - 0.5) * 50;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-dark">
            <motion.div
                style={{ x: dx, y: dy }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-cream/10 blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cream/5 blur-[150px] mix-blend-screen" />
                <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] rounded-full bg-cream/10 blur-[130px] mix-blend-screen" />
            </motion.div>
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
        </div>
    );
}
