
'use client'

import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';

export default function Hero() {
    const { t } = useLanguage();
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
            
            <div className="container relative z-10 px-4 md:px-6 text-center">
                <div className="flex flex-col items-center space-y-4 md:space-y-6">
                    <div className="space-y-3 md:space-y-4">
                        <div className="relative inline-block">
                            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
                                CognivexAI
                            </h1>
                            <span className="absolute -right-2 -top-1 text-lg sm:-right-3 sm:text-xl md:-right-4 md:text-2xl lg:-right-6 lg:text-3xl xl:-right-8 xl:text-4xl">©</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-base text-gray-300/80 sm:text-lg md:text-xl">
                            <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                              {t('hero.tagline.empowering')}{' '}
                              <span className="p-1.5 md:p-2 rounded-md bg-orange-500/20 text-orange-300 font-semibold text-sm md:text-base animate-pulse border border-orange-400/30">
                                {t('hero.tagline.engineering')}
                              </span>
                            </span>
                          </p>
                        </div>
                    </div>
                </div>
            </div>
            <a
                href="#products"
                className="absolute bottom-10 z-20 flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
            >
                {t('hero.scroll')}
                <ChevronDown className="h-4 w-4" />
            </a>
        </section>
    );
}
