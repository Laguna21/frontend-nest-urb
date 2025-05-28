import { useQuery } from 'react-query';
import { Loader } from 'react-feather';
import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import statsService from '../services/StatsService';
import useAuth from '../hooks/useAuth';
import LatestCourses from '../components/courses/LatestCourses';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  const { data, isLoading } = useQuery('stats', statsService.getStats, {
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Dashboard</h1>
      <hr />

      <div className="mt-5 flex flex-col gap-5">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader className="animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Sección de estadísticas */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Mostrar siempre cursos y contenidos */}
              <div className="card shadow text-white bg-indigo-500 flex-1">
                <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                  {data.numberOfCourses}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Courses</p>
              </div>

              <div className="card shadow text-white bg-green-500 flex-1">
                <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                  {data.numberOfContents}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Contents</p>
              </div>

              {/* Mostrar usuarios solo para admin */}
              {authenticatedUser.role === 'admin' && (
                <div className="card shadow text-white bg-blue-500 flex-1">
                  <h1 className="font-semibold sm:text-4xl text-center mb-3">
                    {data.numberOfUsers}
                  </h1>
                  <p className="text-center sm:text-lg font-semibold">Users</p>
                </div>
              )}
            </div>

            {/* Sección de últimos cursos para no-admins */}
            {authenticatedUser.role !== 'admin' && (
              <div className="card shadow">
                <h2 className="font-semibold text-xl mb-3">Latest Courses</h2>
                <LatestCourses />
              </div>
            )}
          </>
        )}

        <UpdateProfile />
      </div>
    </Layout>
  );
}
