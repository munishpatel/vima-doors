import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const PRIMARY_EMAIL = 'vimadoors@gmail.com';
const WA_HREF =
  'https://wa.me/918106802929?text=Hi%2C%20I%27m%20interested%20in%20Vima%20Doors';

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: 'Call Us',
    lines: [
      { text: '+91 99490 92929', href: 'tel:+919949092929' },
      { text: '+91 81068 02929', href: 'tel:+918106802929' },
    ],
  },
  {
    icon: Mail,
    label: 'Email Us',
    lines: [
      { text: 'vimadoors@gmail.com', href: 'mailto:vimadoors@gmail.com' },
      { text: 'info@vimadoors.in', href: 'mailto:info@vimadoors.in' },
    ],
  },
  {
    icon: MapPin,
    label: 'Visit Showroom',
    lines: [
      {
        text: '23-29, Jyothi Nagar, Ramachandra Puram, Hyderabad, Telangana 502032',
        href: 'https://www.google.com/maps/search/Vima+Doors+Showroom,+Ramachandrapuram,+Hyderabad,+Telangana',
      },
    ],
  },
  {
    icon: Clock,
    label: 'Working Hours',
    lines: [
      { text: 'Mon – Sat : 9 AM – 8 PM' },
      { text: 'Sunday : By appointment' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  WhatsApp glyph                                                      */
/* ------------------------------------------------------------------ */

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Form types                                                          */
/* ------------------------------------------------------------------ */

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: '', phone: '', email: '', message: '' };

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = 'Please enter your name.';

  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number.';
  else if (phoneDigits.length < 10)
    errors.phone = 'Please enter a valid phone number.';

  if (!form.email.trim()) errors.email = 'Please enter your email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = 'Please enter a valid email address.';

  if (!form.message.trim()) errors.message = 'Please tell us a little more.';

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('sending');

    // No backend is wired up — compose a pre-filled email so the enquiry
    // reaches the showroom inbox directly from the visitor's mail client.
    const subject = `New enquiry from ${form.name.trim()}`;
    const body = [
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Email: ${form.email.trim()}`,
      '',
      form.message.trim(),
    ].join('\n');

    const mailto = `mailto:${PRIMARY_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    setStatus('sent');
    setForm(EMPTY_FORM);
  };

  return (
    <>
      <title>Contact Us — Vima Doors</title>
      <meta
        name="description"
        content="Get in touch with Vima Doors. Call, email, WhatsApp, or send us a message and our team will help you find the perfect door for your home or project."
      />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: '#1a0f08' }}
      >
        {/* Ambient amber glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary/[0.06] blur-3xl" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative container mx-auto px-6 lg:px-10 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-[0.3em] uppercase text-amber-300/90 mb-5 font-semibold"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight"
          >
            Let&rsquo;s Build Something<br />Worth Opening.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-stone-300 leading-relaxed"
          >
            Whether you&rsquo;re furnishing a new home, renovating a space, or
            sourcing for a project — our team is here to help you find the
            perfect door. Reach out and we&rsquo;ll get back to you shortly.
          </motion.p>
        </motion.div>
      </section>

      {/* ─── CONTACT + FORM ───────────────────────────────────────────── */}
      <section className="relative bg-background py-20 md:py-28 overflow-hidden">
        <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-primary/[0.05] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* ── Left : contact methods ─────────────────────────────── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="lg:col-span-2"
            >
              <motion.p
                variants={fadeUp}
                className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-semibold"
              >
                Reach Us Directly
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-3xl md:text-4xl text-foreground leading-tight mb-4"
              >
                We&rsquo;d Love to
                <br />
                Hear From You
              </motion.h2>
              <motion.div
                variants={fadeUp}
                className="mb-10 h-px w-16 bg-gradient-to-r from-primary/70 to-transparent"
              />

              <div className="space-y-6">
                {CONTACT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.div
                      key={method.label}
                      variants={fadeUp}
                      className="flex items-start gap-4"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <div>
                        <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground font-semibold mb-1.5">
                          {method.label}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          {method.lines.map((line) =>
                            'href' in line && line.href ? (
                              <a
                                key={line.text}
                                href={line.href}
                                target={
                                  line.href.startsWith('http')
                                    ? '_blank'
                                    : undefined
                                }
                                rel={
                                  line.href.startsWith('http')
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                                className="text-sm text-foreground/80 hover:text-primary transition-colors leading-relaxed"
                              >
                                {line.text}
                              </a>
                            ) : (
                              <span
                                key={line.text}
                                className="text-sm text-foreground/80 leading-relaxed"
                              >
                                {line.text}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* WhatsApp CTA */}
              <motion.a
                variants={fadeUp}
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="mt-10 inline-flex items-center gap-3 rounded-lg px-6 py-3.5 text-white shadow-[0_6px_24px_rgba(37,211,102,0.35)]"
                style={{
                  background:
                    'linear-gradient(135deg, #075E54 0%, #128C7E 45%, #25D366 100%)',
                }}
              >
                <WhatsAppIcon size={18} />
                <span className="text-[12px] tracking-[0.14em] uppercase font-semibold">
                  Chat on WhatsApp
                </span>
              </motion.a>
            </motion.div>

            {/* ── Right : form card ──────────────────────────────────── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="lg:col-span-3"
            >
              <div className="relative rounded-2xl border border-border bg-card p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                {status === 'sent' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                      <Check size={30} strokeWidth={2.5} />
                    </span>
                    <h3 className="font-heading text-2xl text-foreground mb-3">
                      Thank You!
                    </h3>
                    <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
                      Your message is on its way. Our team will get back to you
                      as soon as possible. For anything urgent, feel free to
                      call or WhatsApp us.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-primary border-b border-primary pb-0.5 hover:gap-4 transition-all duration-200"
                    >
                      Send Another Message
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-2">
                      Send Us a Message
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8">
                      Fill in the form below and we&rsquo;ll respond within one
                      business day.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                      {/* Name + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field
                          id="name"
                          label="Name"
                          placeholder="Your full name"
                          value={form.name}
                          onChange={update('name')}
                          error={errors.name}
                          autoComplete="name"
                        />
                        <Field
                          id="phone"
                          label="Phone Number"
                          type="tel"
                          placeholder="+91 00000 00000"
                          value={form.phone}
                          onChange={update('phone')}
                          error={errors.phone}
                          autoComplete="tel"
                        />
                      </div>

                      {/* Email */}
                      <Field
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={update('email')}
                        error={errors.email}
                        autoComplete="email"
                      />

                      {/* Message */}
                      <div>
                        <Label
                          htmlFor="message"
                          className="text-xs tracking-[0.15em] uppercase text-foreground/70 font-semibold"
                        >
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your project, the doors you're looking for, or any questions you have…"
                          value={form.message}
                          onChange={update('message')}
                          rows={5}
                          className={`mt-2 resize-none ${
                            errors.message
                              ? 'border-destructive focus-visible:ring-destructive'
                              : ''
                          }`}
                        />
                        {errors.message && (
                          <p className="mt-1.5 text-xs text-destructive">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="group inline-flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground text-sm tracking-widest uppercase font-medium px-8 py-4 hover:bg-primary/90 transition-colors duration-200 disabled:opacity-70"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight
                              size={15}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-muted-foreground pt-1">
                        Prefer to talk? Call us at{' '}
                        <a
                          href="tel:+918106802929"
                          className="text-primary hover:underline"
                        >
                          +91 81068 02929
                        </a>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable labelled field                                            */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="text-xs tracking-[0.15em] uppercase text-foreground/70 font-semibold"
      >
        {label}
      </Label>
      <Input
        id={id}
        className={`mt-2 h-11 ${
          error ? 'border-destructive focus-visible:ring-destructive' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
