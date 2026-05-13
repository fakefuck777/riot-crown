'use client';
import { useRef, useState, useCallback, useEffect, useId } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { useFocusTrap } from '~/hooks/useFocusTrap';

type Step = 'contact' | 'shipping' | 'payment' | 'confirm';
const STEPS: Step[] = ['contact', 'shipping', 'payment', 'confirm'];

interface CheckoutPortalProps {
  isOpen:  boolean;
  onClose: () => void;
  total:   string;
}

export function CheckoutPortal({ isOpen, onClose, total }: CheckoutPortalProps) {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep]   = useState<Step>('contact');
  const portalRef         = useRef<HTMLDivElement>(null);
  const panelRef          = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen, portalRef);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button',
      );
      first?.focus();
    }, 80);
    return () => clearTimeout(id);
  }, [isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [isOpen, onClose]);

  useEffect(() => {
    const el = portalRef.current;
    if (!el) return;
    if (isOpen) {
      if (reducedMotion) {
        gsap.set(el, { display: 'flex', opacity: 1, y: 0, pointerEvents: 'auto' });
      } else {
        gsap.set(el, { display: 'flex', opacity: 0, y: 20, pointerEvents: 'auto' });
        gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      }
      setStep('contact');
    } else {
      gsap.set(el, { pointerEvents: 'none' });
      if (reducedMotion) {
        gsap.set(el, { display: 'none', opacity: 0, y: 10, pointerEvents: 'auto' });
      } else {
        gsap.to(el, {
          opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
          onComplete: () => gsap.set(el, { display: 'none', pointerEvents: 'auto' }),
        });
      }
    }
  }, [isOpen, reducedMotion]);

  const goTo = useCallback((next: Step) => {
    const panel = panelRef.current;
    if (!panel) { setStep(next); return; }
    if (reducedMotion) {
      setStep(next);
      gsap.set(panel, { opacity: 1, x: 0 });
      return;
    }
    gsap.timeline()
      .to(panel, { opacity: 0, x: -24, duration: 0.22, ease: 'power2.in' })
      .call(() => setStep(next))
      .set(panel, { x: 24 })
      .to(panel, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' });
  }, [reducedMotion]);

  const nextStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) goTo(STEPS[idx + 1]);
  }, [step, goTo]);

  const stepIndex = STEPS.indexOf(step);
  const stepLabels: Record<Step, string> = t.checkout.steps;

  return (
    <div
      ref={portalRef}
      className="fixed inset-0 z-[300] flex min-h-0 flex-col h-dvh max-h-dvh"
      style={{
        display: 'none',
        background: '#030303',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-step-title"
    >
      {/* Progress seam */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(242,242,242,0.06)' }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, #C9A84C, #F2F2F2)',
          width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 0 8px rgba(201,168,76,0.6)',
        }} />
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between px-8 md:px-16 pb-8"
        style={{ paddingTop: 'max(2.5rem, calc(env(safe-area-inset-top, 0px) + 1.25rem))' }}
      >
        <div>
          <p className="text-label text-chrome tracking-ultra-wide opacity-30 mb-2">
            {t.checkout.protocol}
          </p>
          <h2 id="checkout-step-title" className="text-titanium uppercase" style={{
            fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            letterSpacing: '0.12em',
          }}>
            {stepLabels[step]}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Abort checkout"
          className="text-label text-chrome hover:text-titanium transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.2em' }}
        >
          {t.checkout.abort}
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 px-8 md:px-16 mb-12">
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i <= stepIndex ? '24px' : '8px',
            height: '1px',
            background: i <= stepIndex ? '#C9A84C' : 'rgba(242,242,242,0.15)',
            transition: 'all 0.4s ease',
            boxShadow: i === stepIndex ? '0 0 6px rgba(201,168,76,0.5)' : 'none',
          }} />
        ))}
      </div>

      {/* Panel */}
      <div
        ref={panelRef}
        className="flex-1 min-h-0 overflow-y-auto px-8 md:px-16"
        style={{
          scrollbarWidth: 'none',
          paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))',
        }}
      >
        {step === 'contact'  && <ContactStep  onNext={nextStep} />}
        {step === 'shipping' && <ShippingStep onNext={nextStep} />}
        {step === 'payment'  && <PaymentStep  onNext={nextStep} total={total} />}
        {step === 'confirm'  && <ConfirmStep  onClose={onClose} total={total} />}
      </div>
    </div>
  );
}

// ─── Field primitive ──────────────────────────────────────────────────────────

function Field({ label, type = 'text', placeholder, autoComplete }: {
  label: string; type?: string; placeholder: string; autoComplete?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label text-chrome tracking-ultra-wide opacity-50" style={{ fontSize: '0.58rem' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-titanium outline-none border-b"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          letterSpacing: '-0.02em',
          fontWeight: 300,
          padding: '10px 0',
          borderColor: 'rgba(242,242,242,0.12)',
          borderRadius: 0,
          caretColor: '#C9A84C',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'; }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(242,242,242,0.12)'; }}
      />
    </div>
  );
}

function SubmitButton({ label, onClick }: { label: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="w-full md:w-auto px-16 py-4 text-label tracking-ultra-wide mt-12"
      style={{
        background: '#F2F2F2', color: '#050505', border: 'none', cursor: 'pointer',
        fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
        fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.25em',
      }}
      onMouseEnter={() => gsap.to(ref.current, { background: '#C9A84C', duration: 0.25 })}
      onMouseLeave={() => gsap.to(ref.current, { background: '#F2F2F2', duration: 0.25 })}
    >
      {label}
    </button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function ContactStep({ onNext }: { onNext: () => void }) {
  const { t } = useLocale();
  const c = t.checkout.contact;
  return (
    <div className="max-w-lg flex flex-col gap-8">
      <Field label={c.email}  placeholder={c.emailPh}  type="email" autoComplete="email" />
      <Field label={c.name}   placeholder={c.namePh}               autoComplete="name" />
      <Field label={c.phone}  placeholder={c.phonePh}  type="tel"   autoComplete="tel" />
      <SubmitButton label={t.checkout.continue} onClick={onNext} />
    </div>
  );
}

function ShippingStep({ onNext }: { onNext: () => void }) {
  const { t } = useLocale();
  const s = t.checkout.shipping;
  return (
    <div className="max-w-lg flex flex-col gap-8">
      <Field label={s.line1}  placeholder={s.line1Ph}  autoComplete="address-line1" />
      <Field label={s.line2}  placeholder={s.line2Ph}  autoComplete="address-line2" />
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-6">
        <Field label={s.city}   placeholder={s.cityPh}   autoComplete="address-level2" />
        <Field label={s.postal} placeholder={s.postalPh} autoComplete="postal-code" />
      </div>
      <Field label={s.country} placeholder={s.countryPh} autoComplete="country-name" />
      <SubmitButton label={t.checkout.continue} onClick={onNext} />
    </div>
  );
}

function PaymentStep({ onNext, total }: { onNext: () => void; total: string }) {
  const { t } = useLocale();
  const p = t.checkout.payment;
  return (
    <div className="max-w-lg flex flex-col gap-8">
      <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'rgba(242,242,242,0.06)' }}>
        <p className="text-label text-chrome tracking-ultra-wide opacity-40">{p.totalDue}</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '-0.04em', color: '#F2F2F2', fontWeight: 300 }}>
          {total}
        </p>
      </div>
      <Field label={p.card}     placeholder={p.cardPh}     autoComplete="cc-number" />
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-6">
        <Field label={p.expiry} placeholder={p.expiryPh}   autoComplete="cc-exp" />
        <Field label={p.cvc}    placeholder={p.cvcPh}       autoComplete="cc-csc" />
      </div>
      <Field label={p.cardName} placeholder={p.cardNamePh} autoComplete="cc-name" />
      <p className="text-label opacity-20 tracking-ultra-wide" style={{ fontSize: '0.55rem', color: '#A8A8A8' }}>
        {p.security}
      </p>
      <SubmitButton label={p.cta} onClick={onNext} />
    </div>
  );
}

function ConfirmStep({ onClose, total }: { onClose: () => void; total: string }) {
  const { t } = useLocale();
  const c = t.checkout.confirm;
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, [reducedMotion]);

  return (
    <div ref={ref} className="max-w-lg flex flex-col gap-8">
      <div className="divider-gold mb-4" />
      <p className="text-label text-chrome tracking-ultra-wide opacity-40">{c.label}</p>
      <h3 className="text-titanium uppercase leading-tight" style={{
        fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
        letterSpacing: '0.06em',
      }}>
        {c.heading1}<br />{c.heading2}
      </h3>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '-0.02em', color: '#A8A8A8', fontWeight: 300 }}>
        {total} — {c.charged}
      </p>
      <div className="divider-gold mt-4" />
      <SubmitButton label={c.cta} onClick={onClose} />
    </div>
  );
}
