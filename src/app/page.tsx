'use client';

import { motion } from 'framer-motion';
import { SERVICES, SITE, UI_TEXT, type Service } from '../config/site';

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { name, subdomain, description, url, iconUrl } = service;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
      className="premium-card group flex flex-col items-center p-10 w-full max-w-sm"
    >
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={iconUrl}
          alt={name}
          className="relative h-16 w-16 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?sz=64&domain=${subdomain}`;
          }}
        />
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
        {name}
      </h3>

      <p className="text-slate-500 text-sm leading-relaxed text-center mb-6">
        {description}
      </p>

      <div className="mt-auto pt-5 border-t border-slate-100 w-full flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
          {subdomain}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </motion.a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <div className="bg-mesh" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="container-max flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
            <span className="text-xl font-black tracking-tight text-slate-900">
              {SITE.name}
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              {UI_TEXT.operationalRigor}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="container-max">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-8"
            >
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                {UI_TEXT.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8"
            >
              {UI_TEXT.heroHeadline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              {UI_TEXT.heroSubheadline}
            </motion.p>
          </div>

          {/* Service Cards */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {UI_TEXT.servicesHeading}
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-2">
              {UI_TEXT.servicesSubheading}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-4xl mx-auto">
            {SERVICES.map((service, index) => (
              <ServiceCard key={service.subdomain} service={service} index={index} />
            ))}
          </div>

          <section className="max-w-4xl mx-auto mt-20 text-left border-t border-slate-100 pt-10">
            <h3 className="text-lg font-bold text-slate-900">{UI_TEXT.privacyHeading}</h3>
            <p className="text-sm text-slate-500 mt-2">{UI_TEXT.privacySubheading}</p>
            <div className="mt-6 text-sm text-slate-600 leading-relaxed space-y-4">
              <p>
                当サイト（{SITE.name}）では、第三者配信の広告サービス（Google AdSense）を利用しています。
              </p>
              <p>
                Google などの第三者配信事業者は Cookie を使用し、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。
              </p>
              <p>
                Google が広告 Cookie を使用することにより、Google およびそのパートナーは、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づいて、適切な広告をユーザーに表示できます。
              </p>
              <p>
                ユーザーは、広告設定でパーソナライズド広告を無効にできます。あるいは www.aboutads.info にアクセスすれば、第三者配信事業者の Cookie 使用によるパーソナライズド広告配信を無効にできます。
              </p>
              <p>
                当サイトでの広告配信時に、第三者配信事業者または広告ネットワークの Cookie が使用される可能性があります。
              </p>
              <p>
                EEA/英国/スイス等のユーザーに対しては、Cookie 等（ローカルストレージ含む）の使用や広告パーソナライズのための個人データの収集・共有・利用について必要な開示を行い、法令上必要な場合は同意を取得します。
              </p>
              <p>
                日本の外部送信規律に基づき、外部送信がある場合は、通知・公表・オプトアウト・同意取得のいずれかの措置を適切に実施します。
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="container-max flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm font-semibold text-slate-900">
            © {new Date().getFullYear()} {SITE.legalName}
          </span>
        </div>
      </footer>
    </div>
  );
}

