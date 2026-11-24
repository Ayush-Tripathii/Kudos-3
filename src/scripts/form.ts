/* Enquiry form — inline validation in brand voice, honeypot, configurable endpoint.
   No endpoint configured → the enquiry is composed into a WhatsApp message. */
export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const endpoint = form.dataset.endpoint || '';
  const wa = form.dataset.wa || '';
  const date = form.querySelector<HTMLInputElement>('#f-date');

  // earliest bookable day = today in Udaipur
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
  if (date) date.min = today;

  let touched = false;

  const check = (el: HTMLInputElement | HTMLSelectElement): boolean => {
    const field = el.closest('.field');
    const err = field?.querySelector<HTMLElement>('.field__err');
    if (!field || !err) return true;
    let ok = true;
    const v = el.value.trim();
    if (el.required && !v) ok = false;
    if (ok && el.name === 'phone') ok = v.replace(/\D/g, '').length >= 10;
    if (ok && el.name === 'date') ok = v >= today;
    field.classList.toggle('is-invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    err.textContent = ok ? '' : err.dataset.msg || 'This one needs a look.';
    return ok;
  };

  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[required], select[required]'));
  fields.forEach((el) => {
    el.addEventListener('blur', () => touched && check(el));
    el.addEventListener('input', () => touched && el.closest('.field')?.classList.contains('is-invalid') && check(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    touched = true;
    const bad = fields.filter((el) => !check(el));
    if (bad.length) {
      status.textContent = bad.length === 1 ? 'Almost — one field needs a look.' : `Almost — ${bad.length} fields need a look.`;
      bad[0].focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    // honeypot: bots fill it, people never see it
    if (data.company) { done('Got it. We\'ll be in touch shortly.'); return; }
    delete data.company;

    submit.disabled = true;
    status.textContent = 'Sending…';

    if (!endpoint) {
      const msg = [
        "Hi Kudos! Here's my enquiry:",
        `Name: ${data.name}`, `Phone: ${data.phone}`, `Date: ${data.date}`, `Time: ${data.time}`,
        `Guests: ${data.guests}`, data.occasion ? `Occasion: ${data.occasion}` : '', data.notes ? `Notes: ${data.notes}` : '',
      ].filter(Boolean).join('\n');
      window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      done('Your enquiry is ready in WhatsApp — hit send and we\'ll be in touch shortly.');
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, source: 'kudos-website' }),
      });
      if (!res.ok) throw new Error(String(res.status));
      done('Got it. We\'ll be in touch shortly.');
    } catch {
      submit.disabled = false;
      status.textContent = 'That didn\'t go through. Try again, or message us on WhatsApp.';
    }
  });

  function done(msg: string) {
    form!.classList.add('is-sent');
    status.textContent = msg;
    status.setAttribute('tabindex', '-1');
    status.focus();
  }
}
