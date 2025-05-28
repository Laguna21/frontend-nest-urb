import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { DollarSign, Loader, Check } from 'react-feather';
import Modal from '../shared/Modal';
import courseService from '../../services/CourseService';
import useAuth from '../../hooks/useAuth';

export default function EnrollButton({
  courseId,
  courseName,
}: {
  courseId: string;
  courseName: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: enroll, isLoading } = useMutation(
    () => courseService.enroll(courseId, authenticatedUser.id),
    {
      onSuccess: () => {
        setShowModal(false);
        queryClient.invalidateQueries(['user-courses', authenticatedUser.id]);
        queryClient.invalidateQueries(['latest-courses']);
      },
      onError: (error: any) => {
        setError(error.response?.data?.message || 'Error al inscribirse');
      },
    },
  );

  const handleEnroll = () => {
    setError(null);
    enroll();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-green-500 hover:text-green-700 transition-colors"
        aria-label="Inscribirse al curso"
      >
        <DollarSign size={20} />
      </button>

      <Modal show={showModal}>
        <div className="flex items-center">
          <h1 className="font-semibold text-xl">Confirmar inscripción</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              setShowModal(false);
              setError(null);
            }}
          >
            <span className="text-lg">X</span>
          </button>
        </div>
        <hr className="my-3" />

        <div className="mb-5">
          <p>
            ¿Deseas adquirir el curso <strong>{courseName}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Se asociará a tu cuenta de usuario.
          </p>
        </div>

        {error && (
          <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50 mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            className="btn bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
            onClick={handleEnroll}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={18} />
                Procesando...
              </>
            ) : (
              <>
                <Check size={18} />
                Confirmar
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
