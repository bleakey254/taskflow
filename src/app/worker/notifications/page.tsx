import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notifications';
import { getCurrentUser } from '@/lib/middleware/auth';
import { Notification } from '@/types/prisma';

export const metadata = {
  title: 'Notifications - TaskFlow',
  description: 'View your notifications',
};

export default async function WorkerNotificationsPage() {
  'use server';

  // Get current user (layout already ensured auth)
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get notifications
  const notifications = await getNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={async () => {
                    await markAllNotificationsAsRead();
                    // In a real app, we'd refresh the page or update state
                    window.location.reload();
                  }}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                >
                  Mark All as Read
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification: Notification) => (
                  <div key={notification.id} className={[
                    'border-b py-3 last:border-b-0',
                    notification.read ? 'bg-gray-50' : 'bg-indigo-50'
                  ].join(' ')}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className={[
                            'h-6 w-6 flex items-center justify-center rounded',
                            notification.type === 'TASK_APPROVED' ? 'bg-green-100' :
                            notification.type === 'TASK_REJECTED' ? 'bg-red-100' :
                            notification.type === 'WITHDRAWAL_SUCCESS' ? 'bg-blue-100' :
                            notification.type === 'WITHDRAWAL_FAILURE' ? 'bg-red-100' :
                            notification.type === 'DISPUTE_OPENED' || notification.type === 'DISPUTE_RESOLVED' ? 'bg-yellow-100' :
                            notification.type === 'NEW_MESSAGE' ? 'bg-purple-100' :
                            'bg-gray-100'
                          ].join(' ')}>
                            <span className={[
                              'text-sm font-medium',
                              notification.type === 'TASK_APPROVED' ? 'text-green-800' :
                              notification.type === 'TASK_REJECTED' ? 'text-red-800' :
                              notification.type === 'WITHDRAWAL_SUCCESS' ? 'text-blue-800' :
                              notification.type === 'WITHDRAWAL_FAILURE' ? 'text-red-800' :
                              notification.type === 'DISPUTE_OPENED' || notification.type === 'DISPUTE_RESOLVED' ? 'text-yellow-800' :
                              notification.type === 'NEW_MESSAGE' ? 'text-purple-800' :
                              'text-gray-800'
                            ].join(' ')}>
                              {/* Notification type icon would go here */}
                              {notification.type === 'TASK_APPROVED' ? '✓' :
                               notification.type === 'TASK_REJECTED' ? '✗' :
                               notification.type === 'WITHDRAWAL_SUCCESS' ? '💰' :
                               notification.type === 'WITHDRAWAL_FAILURE' ? '❌' :
                               notification.type === 'DISPUTE_OPENED' || notification.type === 'DISPUTE_RESOLVED' ? '⚠️' :
                               notification.type === 'NEW_MESSAGE' ? '💬' :
                               '📢'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={[
                            'text-xs',
                            notification.read ? 'text-gray-400' : 'text-indigo-600'
                          ].join(' ')}>
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded hover:bg-indigo-200"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  No notifications yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}