interface Enrollment {
  id: string;
  course: {
    id: string;
    name?: string;
    description?: string;
  };
  enrollmentDate?: string;
  status?: string;
}
export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isActive: boolean;
  enrollments?: Enrollment[] | null;
}
