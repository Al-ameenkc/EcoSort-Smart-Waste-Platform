import React from 'react';
import PageWrapper from '../components/PageWrapper';
import Reveal from '../components/Reveal';
import { WEEKLY_PICKUP_FEE_NGN } from '../constants/serviceAreas';

const Terms = () => (
  <PageWrapper>
    <main className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h1 className="text-3xl md:text-5xl font-bold text-[#1a4032] mb-4">Terms of Service</h1>
          <p className="text-slate-500 text-sm mb-10">Last updated: June 2026</p>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Pickup service</h2>
              <p>
                KanemWaste provides weekly door-to-door plastic waste pickup in designated Abuja
                service areas only. The fee is ₦{WEEKLY_PICKUP_FEE_NGN.toLocaleString()} per week,
                payable in cash on pickup. This fee covers logistics and fuel to sustain the service.
                It is not charged for profit.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Drop-off rewards</h2>
              <p>
                Customers who bring PET bottles directly to our collection point receive cash payment
                based on weight/volume. Drop-off rates and pickup fees are separate services.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Hazard reports</h2>
              <p>
                Community members may report drainage blockages or flooding in our service areas.
                Verified info tips may qualify for a cash reward. Rewards are for accurate information,
                not for cleanup labour performed by the reporter.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Service availability</h2>
              <p>
                Pickups occur on the scheduled day for each service area. If your area is not listed
                in our dropdown, we do not currently operate there. KanemWaste may expand or adjust
                coverage without prior notice.
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </main>
  </PageWrapper>
);

export default Terms;
