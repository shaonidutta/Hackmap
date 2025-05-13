import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
          <div className="mt-6">
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
