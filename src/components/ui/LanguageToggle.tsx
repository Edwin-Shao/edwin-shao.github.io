'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface LanguageToggleProps {
  i18n: I18nRuntimeConfig;
}

const LABEL_MAP: Record<string, string> = {
  en: 'EN',
  zh: '中文',
};

export default function LanguageToggle({ i18n }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!i18n.enabled || !i18n.switcher || i18n.locales.length <= 1) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 overflow-hidden h-7">
        <div className="w-8 h-full bg-neutral-200 dark:bg-neutral-600 animate-pulse rounded-full" />
        <div className="w-8 h-full animate-pulse" />
      </div>
    );
  }

  const currentLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  const orderedLocales = [...i18n.locales].sort((a) => a === i18n.defaultLocale ? -1 : 1);
  const activeIndex = orderedLocales.indexOf(currentLocale);

  return (
    <div className="relative flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-[2px] h-7">
      {/* Sliding indicator */}
      <motion.div
        layout
        className="absolute top-[2px] bottom-[2px] rounded-full bg-accent shadow-sm"
        initial={false}
        animate={{
          left: activeIndex === 0 ? '2px' : '50%',
          width: `calc(50% - 4px)`,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      />

      {orderedLocales.map((localeOption) => {
        const isActive = currentLocale === localeOption;
        const label = LABEL_MAP[localeOption] || (i18n.labels[localeOption]) || localeOption;

        return (
          <button
            key={localeOption}
            onClick={() => setLocale(localeOption)}
            className={cn(
              'relative z-10 w-8 h-full flex items-center justify-center text-[11px] font-semibold rounded-full transition-colors duration-150',
              isActive
                ? 'text-white'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
