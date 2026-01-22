'use client';

import { motion } from 'framer-motion';

// megadrawk.comのサブドメインにあるサービス一覧
const SUBDOMAIN_SERVICES = [
  {
    name: 'MeetPicks',
    subdomain: 'meetpicks',
    description: '効率的なミーティング管理ツール',
    icon: '📅',
  },
  // 今後追加されるサービスはここに追加
];

interface ServiceCardProps {
  name: string;
  subdomain: string;
  description: string;
  icon: string;
  index: number;
}

function ServiceCard({ name, subdomain, description, icon, index }: ServiceCardProps) {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'megadrawk.com';
  const baseDomain = host.includes('localhost') ? 'megadrawk.com' : host.replace(/^[^.]+\./, '').replace(/^www\./, '') || 'megadrawk.com';
  const serviceUrl = `https://${subdomain}.${baseDomain}`;

  return (
    <motion.a
      href={serviceUrl}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 + index * 0.15, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative p-6 bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm overflow-hidden cursor-pointer rounded-lg min-w-[280px]"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-3">
        <span className="text-4xl">{icon}</span>
        <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
          {description}
        </p>
        <span className="text-xs text-neutral-600 font-mono">
          {subdomain}.megadrawk.com
        </span>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/50 transition-all duration-300 group-hover:border-accent opacity-80" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/50 transition-all duration-300 group-hover:border-accent opacity-80" />
    </motion.a>
  );
}

export default function Home() {
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

        {/* サブドメインサービス一覧 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-lg text-neutral-500 font-medium tracking-wider uppercase mb-6">
            Our Services
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
          {SUBDOMAIN_SERVICES.map((service, index) => (
            <ServiceCard
              key={service.subdomain}
              name={service.name}
              subdomain={service.subdomain}
              description={service.description}
              icon={service.icon}
              index={index}
            />
          ))}
        </div>
      </main>

      <footer className="absolute bottom-8 text-neutral-600 text-sm tracking-wide">
        <p>&copy; {new Date().getFullYear()} MegaDrawk Industries. All rights reserved.</p>
      </footer>
    </div>
  );
}
