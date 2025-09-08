
'use client'

import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let mouse = { x: width / 2, y: height / 2 };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        const colors = ['#ADD8E6'];

        class Particle {
            x: number;
            y: number;
            z: number;
            xProjected: number;
            yProjected: number;
            scaleProjected: number;
            color: string;
            
            constructor() {
                this.x = Math.random() * width - width / 2;
                this.y = Math.random() * height - height / 2;
                this.z = Math.random() * 4000;
                this.xProjected = 0;
                this.yProjected = 0;
                this.scaleProjected = 0;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            project() {
                const fov = 400;
                const perspective = fov / (fov + this.z);
                this.xProjected = this.x * perspective + width / 2;
                this.yProjected = this.y * perspective + height / 2;
                this.scaleProjected = Math.max(0, perspective * 2);
            }

            draw() {
                this.project();
                if (ctx) {
                    ctx.beginPath();
                    const alpha = Math.min(1, this.scaleProjected * 2);
                    // A simple way to convert hex to rgba for transparency
                    const r = parseInt(this.color.slice(1, 3), 16);
                    const g = parseInt(this.color.slice(3, 5), 16);
                    const b = parseInt(this.color.slice(5, 7), 16);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    ctx.arc(this.xProjected, this.yProjected, this.scaleProjected, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            update(mousePos: {x:number, y:number}) {
                this.z -= 1.5;
                if (this.z < 1) {
                    this.z = Math.random() * 4000;
                    this.x = Math.random() * width - width / 2;
                    this.y = Math.random() * height - height / 2;
                }
            }
        }
        
        const particles = Array.from({ length: 800 }, () => new Particle());
        
        let animationFrameId: number;

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update(mouse);
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            
            <div className="container relative z-10 px-4 sm:px-6 md:px-8 text-center">
                <div className="flex flex-col items-center space-y-6 sm:space-y-8 md:space-y-10">
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                        <div className="relative inline-block">
                            <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight">
                                CognivexAI
                            </h1>
                            <span className="absolute -right-1 -top-1 text-sm sm:-right-2 sm:text-base md:-right-3 md:text-lg lg:-right-4 lg:text-xl xl:-right-6 xl:text-2xl">©</span>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <p className="text-sm text-gray-300/80 sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-4">
                            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                              Empowering minds,{' '}
                              <span className="inline-block p-2 sm:p-2.5 md:p-3 rounded-lg bg-orange-500/20 text-orange-300 font-semibold text-sm sm:text-base md:text-lg animate-pulse border border-orange-400/30 mt-2 sm:mt-3">
                                engineering magic.
                              </span>
                            </span>
                          </p>
                        </div>
                    </div>
                </div>
            </div>
            <a
                href="#products"
                className="absolute bottom-6 sm:bottom-8 md:bottom-10 z-20 flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 sm:px-4 py-2 text-xs sm:text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
            >
                <span className="hidden sm:inline">Scroll to explore</span>
                <span className="sm:hidden">Explore</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </a>
        </section>
    );
}
