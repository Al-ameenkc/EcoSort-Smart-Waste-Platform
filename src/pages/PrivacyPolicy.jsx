import React from 'react';
import { Shield, MapPin, Phone, User, Camera, Database } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Reveal from '../components/Reveal';

const PrivacyPolicy = () => (
  <PageWrapper>
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <Shield size={14} className="text-[#1a4032]" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legal</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-[#1a4032] mb-4">Privacy Policy</h1>
            <p className="text-slate-500 text-sm">Last updated: June 2026</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Who we are</h2>
              <p>
                KanemWaste (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a smart waste management and flood
                resilience platform in Abuja, Nigeria. Our office is at B39, Standard Estate, Galadimawa,
                FCT-Abuja. Contact: kanemwaste@gmail.com · +234 808 021 0809.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Database size={20} className="text-[#1a4032]" /> What data we collect
              </h2>
              <p className="mb-4">When you use our website, we may collect:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <User size={18} className="text-[#1a4032] shrink-0 mt-0.5" />
                  <span><strong>Full name:</strong> to identify your pickup or hazard report.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-[#1a4032] shrink-0 mt-0.5" />
                  <span><strong>Phone number:</strong> so our team can confirm pickups, payouts, or follow up on reports.</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#1a4032] shrink-0 mt-0.5" />
                  <span><strong>Location data:</strong> your selected service area, street address, landmark, and GPS coordinates when you choose &quot;Locate Me&quot; for pickups or hazard reports.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Camera size={18} className="text-[#1a4032] shrink-0 mt-0.5" />
                  <span><strong>Photos:</strong> optional images you upload with a pickup request.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Why we collect it</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Schedule and fulfil weekly waste pickups in your area.</li>
                <li>Verify and respond to drainage blockage and flood reports.</li>
                <li>Process cash rewards for verified community info tips.</li>
                <li>Contact you about your request status.</li>
                <li>Improve our logistics and flood-response operations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">How we store and protect data</h2>
              <p>
                Your information is stored securely in Firebase (Google Cloud Firestore). Access is
                restricted to authorised KanemWaste administrators. We do not sell your personal data
                to third parties. Location data is used solely for operational purposes: routing
                pickups, mapping hazard reports, and coordinating drainage clearance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Location & GPS consent</h2>
              <p>
                When you tap &quot;Locate Me&quot;, your browser requests permission to access your device&apos;s
                GPS. This is optional. You can instead select your area from our dropdown and type
                your address manually. By submitting a form with location data, you consent to us
                using that information for the purposes described above.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">How long we keep data</h2>
              <p>
                Pickup and hazard report records are retained for as long as needed to fulfil the
                service, resolve disputes, and maintain operational records. You may request deletion
                of your data by contacting us at kanemwaste@gmail.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Your rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your data, subject to legal and operational requirements.</li>
                <li>Withdraw consent by contacting us (this may limit our ability to serve you).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Third-party services</h2>
              <p>
                We use Firebase for data storage, EmailJS for notification emails, OpenWeather for
                rain forecasts (admin operations), and OpenAI for Eco-AI features. These providers
                process data according to their own privacy policies. We do not share your phone
                number or address with marketing companies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Changes to this policy</h2>
              <p>
                We may update this policy as our services evolve. Continued use of the website after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Contact us</h2>
              <p className="text-sm">
                Questions about your data? Email{' '}
                <a href="mailto:kanemwaste@gmail.com" className="text-[#1a4032] font-bold underline">
                  kanemwaste@gmail.com
                </a>{' '}
                or WhatsApp{' '}
                <a href="https://wa.me/2348080210809" className="text-[#1a4032] font-bold underline">
                  +234 808 021 0809
                </a>
                .
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </main>
  </PageWrapper>
);

export default PrivacyPolicy;
