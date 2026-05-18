'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { CardPageConfig } from '@/types/page';

const markdownComponents = {
  p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
  ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
  li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
  a: ({ ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10" />
  ),
  blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
    <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">{children}</blockquote>
  ),
  strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
  code: ({ children }: React.ComponentProps<'code'>) => (
    <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
  ),
};

export default function ResearchPageClient({ config }: { config: CardPageConfig }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Collect all unique tags
  const allCategories = useMemo(() => {
    const tags = new Set<string>();
    config.items.forEach(item => {
      item.tags?.forEach(tag => tags.add(tag));
    });
    return ['All', ...Array.from(tags)];
  }, [config.items]);

  // Filter items by active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return config.items;
    return config.items.filter(item => item.tags?.includes(activeCategory));
  }, [config.items, activeCategory]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: config.items.length };
    config.items.forEach(item => {
      item.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [config.items]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setExpandedItems(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">{config.title}</h1>
        {config.description && (
          <p className="text-neutral-600 dark:text-neutral-500">{config.description}</p>
        )}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar — Categories */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:w-56 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-24">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
              Categories
            </h3>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    activeCategory === category
                      ? 'bg-accent/10 text-accent'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary'
                  )}
                >
                  <span>{category}</span>
                  <span className={cn(
                    'ml-2 text-xs rounded-full px-1.5 py-0.5 min-w-[1.5rem] text-center',
                    activeCategory === category
                      ? 'bg-accent/20 text-accent'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                  )}>
                    {categoryCounts[category] || 0}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main — Research Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-neutral-400"
              >
                <p className="text-lg">No notes in this category yet.</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {filteredItems.map((item, index) => {
                  const isExpanded = expandedItems.has(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Header — always visible */}
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-primary group-hover:text-accent transition-colors duration-200">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {item.subtitle && (
                              <span className="text-sm text-accent font-medium">{item.subtitle}</span>
                            )}
                            {item.date && (
                              <span className="text-xs text-neutral-400">{item.date}</span>
                            )}
                          </div>
                          {item.tags && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.tags.map(tag => (
                                <span
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryChange(tag);
                                  }}
                                  className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-100 dark:border-neutral-700 cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex-shrink-0 mt-1"
                        >
                          <ChevronDownIcon className="h-5 w-5 text-neutral-400 group-hover:text-accent transition-colors" />
                        </motion.div>
                      </button>

                      {/* Expanded content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                              <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed prose-sm max-w-none">
                                <ReactMarkdown components={markdownComponents}>
                                  {item.content || ''}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
