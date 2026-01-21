'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background Ambience - NO BLUE/PURPLE */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <main className="z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 select-none">
            MEGADRAWK
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary mt-2"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-neutral-400 font-light tracking-widest uppercase mb-12"
        >
          Refining the Future
        </motion.p>

        <motion.a
          href="https://drawk.com" // Placeholder link
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative px-12 py-4 bg-transparent border border-neutral-700 overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
          <span className="relative z-10 text-lg font-bold tracking-widest text-white group-hover:text-accent transition-colors">
            ENTER SYSTEM
          </span>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-accent opacity-80" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:border-accent opacity-80" />
        </motion.a>
      </main>

      <footer className="absolute bottom-8 text-neutral-600 text-sm tracking-wide">
        <p>&copy; {new Date().getFullYear()} MegaDrawk Industries. All rights reserved.</p>
      </footer>
    </div>
  );
}
