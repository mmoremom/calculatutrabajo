import { CALCULATOR_SEO_CONTENT, DEFAULT_CALCULATOR_SEO_CONTENT } from '../data/calculatorContent';

type DynamicCalculatorGuideProps = {
  activeCalculator: string;
};

export default function DynamicCalculatorGuide({ activeCalculator }: DynamicCalculatorGuideProps) {
  const content = CALCULATOR_SEO_CONTENT[activeCalculator] ?? DEFAULT_CALCULATOR_SEO_CONTENT;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section key={activeCalculator} className="calculator-guide-transition mt-12 rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8" aria-live="polite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-5xl">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{content.badge}</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{content.title}</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 text-base leading-7 text-slate-600">
            {content.mainText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-bold text-slate-900">Claves del cálculo</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600">
              {content.bulletPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </aside>
        </div>
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-slate-900">Preguntas frecuentes</h3>
          <div className="mt-5 space-y-3">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-lg shadow-slate-200/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="text-xl font-normal text-blue-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="border-t border-slate-700 px-5 pb-5 pt-4 text-sm leading-6 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
