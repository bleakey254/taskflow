import { loginUser } from '@/actions/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Sign in to TaskFlow
          </h2>
          <p className="text-center text-sm text-gray-600">
            Access your dashboard and manage your tasks
          </p>
        </div>
        <form className="space-y-6" action={async (formData: FormData) => {
          'use server';
          return await loginUser(undefined, formData);
        }}>
          <div className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-5" />
              </div>
              <div className="ml-3 text-sm text-left">
                <label htmlFor="remember-me" className="text-gray-500">
                  Remember me
                </label>
              </div>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}