"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function HomePageClient() {
  const [unlockToastVisible, setUnlockToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleUnlock = (taskTitle: string) => {
    setToastMessage(`Unlocked: ${taskTitle} ($0.80 paid from balance). Full brief & datasets loaded!`);
    setUnlockToastVisible(true);

    setTimeout(() => {
      setUnlockToastVisible(false);
    }, 3000);
  };

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xl">
            <Link href="/client/tasks" className="flex items-center gap-space-sm" data-path="find-tasks">
              <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg" data-active-classes="text-primary font-label-lg text-label-lg font-bold">
              <Link href="/client/tasks" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="find-tasks">
                Find Tasks
              </Link>
              <Link href="#how-it-works" className="transition-colors text-primary font-label-lg text-label-lg font-bold" data-path="how-it-works">
                How It Works
              </Link>
              <Link href="/client/tasks/create" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="for-clients">
                For Clients
              </Link>
              <Link href="/worker/tasks" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="for-workers">
                For Workers
              </Link>
              <Link href="#how-it-works" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="pricing">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Wallet</span>
              <span className="font-label-lg text-label-lg text-secondary font-bold">$245.50</span>
            </div>
            <button aria-label="Notifications" className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative flex items-center justify-center" type="button">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
            </button>
            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-surface">
        {/* HERO SECTION */}
        <section className="relative max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop pt-space-xl md:pt-space-2xl pb-space-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-gutter-lg items-center">
            {/* Text & CTAs Left Column */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-space-lg">
              <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide uppercase">Next-Gen Micro-Task Protocol</span>
                <span className="text-outline text-xs">/</span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">142 Gigs Available Now</span>
              </div>
              <h1 className="font-display text-display text-on-surface tracking-tight leading-[1.08]">
                Complete Tasks.<br/>
                <span className="text-primary-container">Build Your Skills.</span><br/>
                Get Paid.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Discover online tasks from clients around the world, unlock the work you qualify for, complete it, and receive payment securely through our escrow guarantee.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                <Link href="/client/tasks" className="w-full sm:w-auto bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg px-space-xl py-space-md rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-space-xs active:scale-[0.98]">
                  <span>Find Tasks</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link href="/client/tasks/create" className="w-full sm:w-auto bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg px-space-xl py-space-md rounded-lg shadow-sm transition-all flex items-center justify-center gap-space-xs active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[18px] text-primary">add_circle</span>
                  <span>Post a Task</span>
                </Link>
              </div>
              {/* Micro Proof Bar */}
              <div className="pt-space-md flex flex-wrap items-center gap-space-lg text-on-surface-variant">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-md text-label-md">Instant Escrow Release</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                  <span className="font-label-md text-label-md">$0.80 Anti-Spam Barrier</span>
                </div>
              </div>
            </div>
            {/* Interactive Live Dashboard Preview Mockup Right Column */}
            <div className="lg:col-span-6 relative mt-space-lg lg:mt-0">
              <div className="relative bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-xl">
                {/* Mock Header Bar */}
                <div className="flex items-center justify-between pb-space-md border-b border-surface-container-high">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-3 h-3 rounded-full bg-error/70"></span>
                    <span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim/70"></span>
                    <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim/70"></span>
                    <span className="ml-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">Live Task Marketplace Engine</span>
                  </div>
                  <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-space-sm py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 99.8% Sync
                  </span>
                </div>
                {/* Task List Interactive Container */}
                <div className="space-y-space-md pt-space-md" id="task_feed_container">
                  {/* Card 1: AI Data Annotation Task */}
                  <div className="group bg-surface-container-low hover:bg-surface-container-high transition-all p-space-md rounded-lg shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-space-sm mb-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-space-xs py-0.5 rounded-md font-semibold">AI & Machine Learning</span>
                        <span className="bg-secondary/15 text-secondary font-label-sm text-label-sm px-space-xs py-0.5 rounded-md font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">$5.00</span>
                        <span className="block font-body-xs text-body-xs text-on-surface-variant">Escrow Guaranteed</span>
                      </div>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                      AI Data Annotation: Bounding Box Vehicle Tags
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                      Label 40 street photography scenes with multi-class vehicle segmentation polygons according to standard taxonomy.
                    </p>
                    {/* Dynamic Progress Slot Metric */}
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container flex flex-wrap items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-md text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">group</span>
                          <span className="font-label-sm text-label-sm">42 Slots Left</span>
                        </div>
                        <div className="flex items-center gap-space-md text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                          <span className="font-label-sm text-label-sm text-secondary font-bold">73 Unlocked</span>
                        </div>
                      </div>
                      {/* Unlock Trigger Button */}
                      <button
                        onClick={() => handleUnlock('AI Data Annotation: Bounding Box Vehicle Tags')}
                        className="bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim px-space-md py-space-xs rounded-lg font-label-md text-label-md font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>Unlock Task ($0.80)</span>
                      </button>
                    </div>
                  </div>
                  {/* Card 2: E-commerce Product Tagging */}
                  <div className="group bg-surface-container-low hover:bg-surface-container-high transition-all p-space-md rounded-lg shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-space-sm mb-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-space-xs py-0.5 rounded-md font-semibold">Catalog Taxonomy</span>
                        <span className="bg-secondary/15 text-secondary font-label-sm text-label-sm px-space-xs py-0.5 rounded-md font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">$3.80</span>
                        <span className="block font-body-xs text-body-xs text-on-surface-variant">Escrow Funded</span>
                      </div>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                      E-commerce Product Tagging & Attribute Validation
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                      Verify 25 retail apparel specs including fabric blends, SKU variations, and standard sleeve lengths.
                    </p>
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container flex flex-wrap items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-md text-on-surface-variant">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">group</span>
                          <span className="font-label-sm text-label-sm">18 Slots Left</span>
                        </div>
                        <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-space-xs py-0.5 rounded font-semibold">Verified Client</span>
                      </div>
                      <button
                        onClick={() => handleUnlock('E-commerce Product Tagging')}
                        className="bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim px-space-md py-space-xs rounded-lg font-label-md text-label-md font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>Unlock Task ($0.80)</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Floating Active Real-time Toast */}
                <div
                  className={`
                    ${unlockToastVisible ? 'flex' : 'hidden'}
                    mt-space-md p-space-md bg-secondary-fixed text-on-secondary-fixed rounded-lg text-label-sm font-label-sm flex items-center justify-between shadow-md transition-all
                  `}
                  id="unlock-toast"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                    <span id="toast_message">{toastMessage}</span>
                  </div>
                  <span
                    className="material-symbols-outlined cursor-pointer text-[16px]"
                    onClick={() => setUnlockToastVisible(false)}
                  >close</span>
                </div>
              </div>
              {/* Micro Image Accent Card Behind Dashboard */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 w-48 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-surface-container-lowest -z-10">
                <img
                  className="w-full h-full object-cover"
                  alt="High tech analytical workspace showing a programmer analyzing neural network outputs on a sleek ultrawide monitor with blue ambient task lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEdRsUt8HTqdvs1PTkst_iEwt2B2XixE4uWDgrfK4C-0QBTOpj-Gizc4_7qxzJ9Ed3UtVVrxOl5v5F94JoyVGTP45IBoeUW85u4upl9z2RgJR0Y6XjmU5Cow_YpMmGOqhhFGsCiPOtcDrajln4N1ytUVunrsdQ-n4ryG58UWW8JdZa5BWee0EsNOel4Evunfoxr_X72c2JPdk-cww0BRoCWo4G11aAZp68Hx1Q-vWZSgBwTWiNK531gw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* STATS METRIC STRIP */}
        <section className="w-full bg-surface-container-low py-space-xl">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter text-center md:text-left">
              {/* Metric 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center md:justify-start gap-space-xs text-primary mb-1">
                  <span className="material-symbols-outlined text-[26px]">task_alt</span>
                  <span className="font-currency-stat text-currency-stat font-extrabold text-on-surface">25,000+</span>
                </div>
                <p className="font-label-lg text-label-lg font-bold text-on-surface">Tasks Completed</p>
                <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">100% Milestone validated</p>
              </div>
              {/* Metric 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center md:justify-start gap-space-xs text-secondary mb-1">
                  <span className="material-symbols-outlined text-[26px]">engineering</span>
                  <span className="font-currency-stat text-currency-stat font-extrabold text-on-surface">8,500+</span>
                </div>
                <p className="font-label-lg text-label-lg font-bold text-on-surface">Active Workers</p>
                <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Across 85+ countries</p>
              </div>
              {/* Metric 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center md:justify-start gap-space-xs text-tertiary mb-1">
                  <span className="material-symbols-outlined text-[26px]">domain_verification</span>
                  <span className="font-currency-stat text-currency-stat font-extrabold text-on-surface">3,200+</span>
                </div>
                <p className="font-label-lg text-label-lg font-bold text-on-surface">Verified Clients</p>
                <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Funded escrow accounts</p>
              </div>
              {/* Metric 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center md:justify-start gap-space-xs text-primary-container mb-1">
                  <span className="material-symbols-outlined text-[26px]">payments</span>
                  <span className="font-currency-stat text-currency-stat font-extrabold text-on-surface">$1.2M+</span>
                </div>
                <p className="font-label-lg text-label-lg font-bold text-on-surface">Paid to Workers</p>
                <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Zero payout processing delays</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (4 STEPS) */}
        <section id="how-it-works" className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop py-space-2xl w-full scroll-mt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs text-primary mb-space-xs">
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
                <span className="font-label-md text-label-md uppercase tracking-wider font-bold">Transparent Lifecycle</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">How TaskFlow Works</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Designed to protect both talent and employers through micro-commitment mechanisms and frictionless instant settlement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter relative">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 font-display text-[7rem] font-black text-surface-container-high/40 select-none pointer-events-none group-hover:text-primary-fixed/50 transition-colors">01</div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">person_add</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Step One</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 mb-space-xs">Create an Account</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Sign up free as a verified worker or client in minutes. Complete our one-time identity verification to unlock tier permissions.
                </p>
              </div>
              <div className="pt-space-lg">
                <span className="inline-flex items-center text-primary font-label-md text-label-md font-bold gap-1">
                  Free onboarding <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 font-display text-[7rem] font-black text-surface-container-high/40 select-none pointer-events-none group-hover:text-primary-fixed/50 transition-colors">02</div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">travel_explore</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Step Two</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 mb-space-xs">Find a Task</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Browse high demand gigs with transparent rewards and client ratings. Filter by duration, payout density, or skill sets.
                </p>
                <span className="inline-flex items-center text-on-surface font-label-md text-label-md font-bold gap-1">
                  Instant filtering <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-surface-container-highest p-space-lg rounded-xl shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 font-display text-[7rem] font-black text-surface-container-high select-none pointer-events-none group-hover:text-tertiary-fixed/60 transition-colors">03</div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">key</span>
                </div>
                <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wider">Commitment Mechanism</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 mb-space-xs">Pay $0.80 to Unlock</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  A nominal $0.80 access fee guarantees high worker commitment, unlocks full proprietary client guidelines, confidential datasets and submission workspace.
                </p>
              </div>
            </div>
            {/* Step 4 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 font-display text-[7rem] font-black text-surface-container-high/40 select-none pointer-events-none group-hover:text-secondary-fixed/60 transition-colors">04</div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">savings</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Step Four</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-1 mb-space-xs">Complete & Submit</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Finish the task, upload deliverables into the verification sandbox, and receive immediate automated payouts upon client sign-off.
                </p>
              </div>
              <div className="pt-space-lg">
                <span className="inline-flex items-center text-secondary font-label-md text-label-md font-bold gap-1">
                  Instant withdrawal <span className="material-symbols-outlined text-[16px]">bolt</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED TASK CATEGORIES (Interactive Grid) */}
        <section className="w-full bg-surface-container-low py-space-2xl">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-xl gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">Global Taxonomy</span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold mt-1">Featured Task Categories</h2>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Showing active open tasks</span>
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
              {/* Cat 1 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">database</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Data Entry</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">180+ tasks available</span>
                </div>
              </Link>
              {/* Cat 2 (Featured highlight) */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                </div>
                <div>
                  <div className="inline-block bg-tertiary-fixed text-on-tertiary-fixed group-hover:bg-on-primary group-hover:text-on-primary font-label-sm text-[10px] px-1.5 py-0.5 rounded uppercase font-bold mb-1">High Demand</div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">AI Data & Annotation</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">420+ tasks available</span>
                </div>
              </Link>
              {/* Cat 3 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Writing & Copywriting</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">95+ tasks available</span>
                </div>
              </Link>
              {/* Cat 4 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">translate</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Translation & Local.</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">64+ tasks available</span>
                </div>
              </Link>
              {/* Cat 5 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">palette</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Graphic Design</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">110+ tasks available</span>
                </div>
              </Link>
              {/* Cat 6 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">terminal</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Web Development</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">85+ tasks available</span>
                </div>
              </Link>
              {/* Cat 7 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">bug_report</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Software QA & Testing</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">72+ tasks available</span>
                </div>
              </Link>
              {/* Cat 8 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">insights</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Market Research</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">54+ tasks available</span>
                </div>
              </Link>
              {/* Cat 9 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Virtual Assistance</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">130+ tasks available</span>
                </div>
              </Link>
              {/* Cat 10 */}
              <Link
                href="/client/tasks"
                className="group bg-surface-container-lowest hover:bg-primary hover:text-on-primary p-space-md rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high group-hover:bg-on-primary/10 flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-md">
                  <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-1">Audio/Video Transcr.</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-on-primary/80">88+ tasks available</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST & SECURITY SECTION */}
        <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop py-space-2xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-gutter-lg items-center">
            {/* Media visual preview column */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-xl overflow-hidden shadow-lg aspect-[4/3] relative">
                <img
                  className="w-full h-full object-cover"
                  data-alt="A focused digital nomad professional verifying task completions on a modern laptop in a sunlit clean architectural studio with subtle emerald fintech charts on screen"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVCVMpwtSi64b27llCKOPeVIk6hnqGGjxyD04otxOWqLKQI2cB2BJIzeL3Os0485ky6ATFvgs3bpLDWqvZ2v3z3hpYqkR5TK35zrBknAuO-tYda-pgCCtmf1R7THBK2IM6mSx1wXoIdmNU5tG9rkUmK0BSGigC4wDPh_4e4Fsp05jjVh2-i4w3eV6oH8viROymkIS8ZbGwrNW-vOsFrhmBbqkWf04Ptfzz6_K1VtYc3RKGesufjDJ1eA"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-on-primary p-space-md bg-inverse-surface/70 backdrop-blur-md rounded-lg">
                  <div className="flex items-center gap-space-xs text-secondary-fixed mb-1">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="font-label-md text-label-md font-bold">100% Escrow Collateralized</span>
                  </div>
                  <p className="font-body-xs text-body-xs text-inverse-on-surface">Client funds are pre-locked in smart escrow prior to task distribution.</p>
                </div>
              </div>
            </div>
            {/* Security Matrix List */}
            <div className="lg:col-span-7 space-y-space-lg">
              <div>
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Enterprise Reliability</span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold mt-1">
                  Built on Rigorous Trust & Financial Security
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                  We eliminate speculative labor risk. Every gig is pre-funded, milestones are strictly monitored, and verified IDs prevent bad actors.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Pillar 1 */}
                <div className="p-space-md bg-surface-container rounded-lg">
                  <div className="w-9 h-9 rounded-md bg-primary-fixed flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Secure Escrow & Payouts</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Instant payouts via M-Pesa, PayPal, or Direct Bank Wire as soon as task submissions pass automated validation.
                  </p>
                </div>
                {/* Pillar 2 */}
                <div className="p-space-md bg-surface-container rounded-lg">
                  <div className="w-9 h-9 rounded-md bg-secondary-fixed flex items-center justify-center text-secondary mb-space-sm">
                    <span className="material-symbols-outlined text-[20px]">policy</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Multi Layer Task Audit</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Round the clock admin moderation and automated plagiarism checks protect both client briefs and worker deliverables.
                  </p>
                </div>
                {/* Pillar 3 */}
                <div className="p-space-md bg-surface-container rounded-lg">
                  <div className="w-9 h-9 rounded-md bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-sm">
                    <span className="material-symbols-outlined text-[20px]">gavel</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Fair Dispute Resolution</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Worker Protection Guarantee ensures fair arbitrated reviews if a client arbitrarily rejects work that fits prompt criteria.
                  </p>
                </div>
                {/* Pillar 4 */}
                <div className="p-space-md bg-surface-container rounded-lg">
                  <div className="w-9 h-9 rounded-md bg-surface-container-highest flex items-center justify-center text-on-surface mb-space-sm">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Verified Badges</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Tier ranked profiles highlight dependable talent and verified corporate employers with spotless payment history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER AT BOTTOM */}
        <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop mb-space-2xl w-full">
          <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-2xl p-space-xl md:p-space-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-space-xl relative overflow-hidden">
            {/* Decorative vector circuit background */}
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <svg fill="currentColor" height="340" viewBox="0 0 200 200" width="340">
                <circle cx="100" cy="100" fill="none" r="80" stroke="currentColor" stroke-width="4"></circle>
                <circle cx="100" cy="100" fill="none" r="40" stroke="currentColor" stroke-width="4"></circle>
                <path d="M100 0 L100 200 M0 100 L200 100" stroke="currentColor" stroke-width="2"></path>
              </svg>
            </div>
            <div className="z-10 space-y-space-xs max-w-xl z-10 text-center md:text-left">
              <span className="bg-on-primary/10 text-on-primary font-label-sm text-label-sm px-space-sm py-1 rounded-full uppercase tracking-wider font-bold inline-block mb-1">
                Join the Fast Growing Network
              </span>
              <h2 className="font-headline-xl text-headline-xl font-bold tracking-tight">
                Ready to start earning or hiring top talent today?
              </h2>
              <p className="font-body-md text-body-md text-on-primary/80">
                Join 8,500+ workers and enterprises unlocking frictionless micro-task settlements worldwide.
              </p>
            </div>
            <div className="z-10 flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto">
              <Link
                href="/client/tasks"
                className="w-full sm:w-auto bg-surface-container-lowest text-primary hover:bg-surface-container font-label-lg text-label-lg px-space-2xl py-space-md rounded-lg shadow-lg font-bold transition-all active:scale-95 text-center"
              >
                Get Started Free
              </Link>
              <Link
                href="/client/tasks"
                className="w-full sm:w-auto bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-label-lg text-label-lg px-space-xl py-space-md rounded-lg transition-all text-center"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-low shadow-[0_-1px_4px_rgba(0,0,0,0.02)] mt-space-2xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop py-space-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-space-2xl">
            {/* About section */}
            <div className="space-y-space-sm">
              <div className="flex items-center gap-space-sm">
                <img alt="TaskFlow Logo" className="h-7 w-auto object-contain" src="/taskflow-logo.svg"/>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">TaskFlow</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                The high trust micro task network. Instant escrow mechanics, verified worker unlocks, and guaranteed milestone payouts.
              </p>
            </div>
            {/* Marketplace section */}
            <div>
              <h4 className="font-label-lg text-label-lg text-on-surface font-bold mb-space-md">Marketplace</h4>
              <ul className="space-y-space-xs">
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Available Bounties</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">$0.80 Unlock Model</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Skill Verification</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Leaderboards</li>
              </ul>
            </div>
            {/* Enterprise Clients section */}
            <div>
              <h4 className="font-label-lg text-label-lg text-on-surface font-bold mb-space-md">Enterprise Clients</h4>
              <ul className="space-y-space-xs">
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Post Micro Task</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Escrow Protection</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Batch Processing</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">API Integrations</li>
              </ul>
            </div>
            {/* Security & Legal section */}
            <div>
              <h4 className="font-label-lg text-label-lg text-on-surface font-bold mb-space-md">Security & Legal</h4>
              <ul className="space-y-space-xs">
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Escrow Compliance</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Fee Transparency</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Terms of Service</li>
                <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant">
            <span className="font-body-xs text-body-xs">© 2025 TaskFlow Technologies Inc. All rights reserved.</span>
            <div className="flex items-center gap-space-lg">
              <span className="font-body-xs text-body-xs hover:text-on-surface cursor-pointer">Status: Operational</span>
              <span className="font-body-xs text-body-xs hover:text-on-surface cursor-pointer">Instant Payouts Active</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}