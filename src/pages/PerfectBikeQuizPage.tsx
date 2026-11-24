import { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PERFECT_BIKE_QUESTIONS } from '../data/catalog';
import { useStore } from '../context/StoreContext';

export function PerfectBikeQuizPage() {
  const { quizAnswers, setQuizAnswers, language, t, navigate } = useStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [calculating, setCalculating] = useState(false);

  const currentQuestion = PERFECT_BIKE_QUESTIONS[stepIndex];
  const totalSteps = PERFECT_BIKE_QUESTIONS.length;
  const selectedValue = quizAnswers[currentQuestion.id];

  const handleSelectOption = (value: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    if (stepIndex < totalSteps - 1) {
      window.setTimeout(() => {
        setStepIndex((idx) => idx + 1);
      }, 180);
    } else {
      setCalculating(true);
      window.setTimeout(() => {
        setCalculating(false);
        navigate('perfect-bike-result');
      }, 750);
    }
  };

  return (
    <section className="max-w-[920px] mx-auto px-4 sm:px-8 py-12 min-h-[70vh] flex flex-col justify-between gap-8">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (stepIndex > 0 ? setStepIndex((i) => i - 1) : navigate('home'))}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{stepIndex > 0 ? t('quizBack') : t('backToHome')}</span>
        </button>

        <span className="font-mono-tabular text-xs font-bold text-red-600 dark:text-red-500">
          {t('quizStep')} {stepIndex + 1} {t('quizOf')} {totalSteps}
        </span>
      </div>

      {/* Kinetic Step Progress Bar */}
      <div className="grid grid-cols-5 gap-2">
        {PERFECT_BIKE_QUESTIONS.map((q, idx) => (
          <div
            key={q.id}
            className={`h-1.5 rounded-full transition-colors duration-300 ${
              idx <= stepIndex ? 'bg-red-600' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {calculating ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 gap-4">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
          <p className="font-display text-2xl font-extrabold text-zinc-950 dark:text-white">
            {t('quizCalculating')}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 space-y-8"
          >
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-600 dark:text-red-500">
                {t('quizTitle')}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white text-balance">
                {language === 'ar' ? currentQuestion.titleAr : currentQuestion.title}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {language === 'ar' ? currentQuestion.subtitleAr : currentQuestion.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedValue === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`group text-start p-5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-red-600 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white hover:border-red-600 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-display text-base font-bold block">
                        {language === 'ar' ? opt.labelAr : opt.label}
                      </span>
                      <span
                        className={`text-xs block ${
                          isSelected
                            ? 'text-zinc-300 dark:text-zinc-700'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {language === 'ar' ? opt.hintAr : opt.hint}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:rotate-180 transition-transform" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}
