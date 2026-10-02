import { registerUser } from '@/actions/auth';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Create your TaskFlow account
          </h2>
          <p className="text-center text-sm text-gray-600">
            Get started with task management and collaboration
          </p>
        </div>
        <form className="space-y-6" action={async (formData: FormData) => {
          'use server';
          return await registerUser(undefined, formData);
        }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

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
              autoComplete="new-password"
              required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Account type
            </label>
            <select
              id="role"
              name="role"
              required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">Select account type</option>
              <option value="WORKER">Worker - Complete tasks and earn</option>
              <option value="CLIENT">Client - Post tasks and manage workers</option>
            </select>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Create account
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}