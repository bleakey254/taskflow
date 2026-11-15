import Link from "next/link";
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-on-surface">
            Unauthorized Access
          </h2>
          <p className="text-center text-sm text-on-surface-variant">
            You don't have permission to access this page
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-on-surface-variant">
              If you believe this is an error, please contact support or try logging in with a different account.
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/" className="text-sm font-medium text-primary hover:text-primary/80">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}