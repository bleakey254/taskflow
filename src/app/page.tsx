import Link from 'next/link';

export const metadata = {
  title: 'TaskFlow - Micro-Task Marketplace',
  description: 'Complete Tasks. Build Your Skills. Get Paid.',
};

export default function SimpleHomePage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xl">
            <Link href="/client/tasks" className="flex items-center gap-space-sm" data-path="find-tasks">
              <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1XuWoqTzpHs-R1YNAc9X6ClYDrK78AssXzAQQSyu4X5W0AZ1rbXHWJF2UKEaknnYXs7mREisKoRVBShT-hVTshN6EPrGGOYD59soA2G0aw__c1Z91vUBon4HcdZa-7NS7gBaQ4Hst-EXBf0jebnMbW2k-SqSZYiKgxrXOjrCw8oDYUIvjV43XpRnmp4xrZXLtAHKi664S9rxoWiTV97dwxXgY4Fdr3c_dHiiRcBz0Y2XBb_4DuWr5GCjBx8"/>
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-space-lg" data-active-classes="text-primary font-label-lg text-label-lg font-bold">
              <Link href="/client/tasks" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="find-tasks">
                Find Tasks
              </Link>
              <Link href="/how-it-works" className="transition-colors text-primary font-label-lg text-label-lg font-bold" data-path="how-it-works" aria-current="page">
                How It Works
              </Link>
              <Link href="/for-clients" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="for-clients">
                For Clients
              </Link>
              <Link href="/for-workers" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="for-workers">
                For Workers
              </Link>
              <Link href="/pricing" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" data-path="pricing">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Wallet</span>
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

      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          <section className="relative max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop pt-space-xl md:pt-space-2xl pb-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-gutter-lg items-center">
              <div className="lg:col-span-6 flex flex-col items-start space-y-space-lg">
                <h1 className="font-display text-display text-on-surface tracking-tight leading-[1.08]">
                  Complete Tasks.<br/>
                  <span className="text-primary-container">Build Your Skills.</span><br/>
                  Get Paid.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Discover online tasks from clients around the world, unlock the work you qualify for, complete it, and receive payment securely through our escrow guarantee.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                  <Link href="/client/tasks" className="w-full sm:w-auto bg-primary-container hover:bg-primary/90 text-on-primary font-label-lg text-label-lg px-space-xl py-[16px] rounded-xl shadow-lg flex items-center justify-center gap-space-3 transition-all duration-200 hover:shadow-xl hover:-translate-y-[2px] active:scale-[0.98]">
                    <span>Find Tasks</span>
                    <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                  </Link>
                  <Link href="/create-task" className="w-full sm:w-auto bg-surface-container-lowest hover:bg-surface-container/90 text-on-surface font-label-lg text-label-lg px-space-xl py-[16px] rounded-xl shadow-lg flex items-center justify-center gap-space-3 transition-all duration-200 hover:shadow-xl hover:-translate-y-[2px] active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[24px] text-primary">add_circle</span>
                    <span>Post a Task</span>
                  </Link>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-xl">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Featured Tasks</h2>
                  <div className="space-y-4">
                    <div className="bg-surface-container-low hover:bg-surface-container-high transition-all p-4 rounded-lg">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">AI Data Annotation: Bounding Box Vehicle Tags</h3>
                      <p className="text-on-surface-variant">Label 40 street photography scenes with multi-class vehicle segmentation polygons according to standard taxonomy.</p>
                      <div className="flex items-center justify-between">
                        <span className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">$5.00</span>
                        <span className="bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim px-3 py-1 rounded font-label-md text-label-md font-bold">
                          Unlock Task ($0.80)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low shadow-[0_-1px_4px_rgba(0,0,0,0.02)] mt-space-2xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop py-space-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant">
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