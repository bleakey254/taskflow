import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { TaskCategory, Role } from '@/types/prisma';

export const metadata = {
  title: 'Category Configuration - TaskFlow',
  description: 'Manage task categories',
};

export default async function CategoryConfigPage() {
  'use server';

  // Require authentication and ADMIN role
  const user = await getCurrentUser();
  await requireRole([Role.ADMIN]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get all categories
  const categories = await prisma.taskCategory.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Category Configuration
              </h2>
              <div className="flex items-center space-x-3">
                <a href="/admin/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500">
                  ← Dashboard
                </a>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Task Categories
                </h3>
                <button
                  onClick={() => {
                    // In a real implementation, this would open a modal or redirect to create category
                    alert('Category creation functionality would be implemented here');
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                >
                  + Add Category
                </button>
              </div>

              {categories.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((category: TaskCategory) => (
                    <div key={category.id} className="border-b py-3 last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-xs text-gray-500">
                            Tasks
                          </div>
                          <div className="text-sm font-medium text-indigo-600">
                            0
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    No categories defined yet. Add categories to organize tasks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}