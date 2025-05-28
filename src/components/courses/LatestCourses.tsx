// components/dashboard/LatestCourses.tsx
import { useQuery } from 'react-query';
import { Loader } from 'react-feather';
import courseService from '../../services/CourseService';
import EnrollButton from './EnrollButton';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function LatestCourses() {
  const { data, isLoading } = useQuery(
    'latest-courses',
    () => courseService.findLatest(3),
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  );

  const { authenticatedUser } = useAuth();

  if (isLoading) return <Loader className="animate-spin mx-auto my-4" />;

  const isNotEnrolled = (courseId) =>
    !authenticatedUser?.enrollments?.length ||
    !authenticatedUser.enrollments.some(
      (enrollment: any) => enrollment?.course?.id === courseId,
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {data?.map((course) => (
        <div
          key={course.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center content-center"
        >
          <div>
            <Link to={`/courses/${course.id}`} className="font-semibold">
              {course.name}
            </Link>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {course.description}
            </p>
          </div>
          <div>
            {isNotEnrolled(course.id) ? (
              <EnrollButton courseId={course.id} courseName={course.name} />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
