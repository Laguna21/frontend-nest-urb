import { useEffect, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const { authenticatedUser } = useAuth();

  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    username: '',
    role: '',
  });
  const [userSearch, setUserSearch] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserSearch(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const { data, isLoading, refetch } = useQuery(
    ['users', userSearch],
    async () => {
      return (
        await userService.findAll({
          firstName: userSearch.firstName || undefined,
          lastName: userSearch.lastName || undefined,
          username: userSearch.username || undefined,
          role: userSearch.role || undefined,
        })
      ).filter((user) => user.id !== authenticatedUser.id);
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      setError(null);
      reset();
      await refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Manage Users</h1>
      <hr />
      <button
        className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
        onClick={() => setAddUserShow(true)}
      >
        <Plus /> Add User
      </button>
      <div className="table-filter mt-2">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="First Name"
            name="firstName"
            value={filters.firstName}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Last Name"
            name="lastName"
            value={filters.lastName}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Username"
            name="username"
            value={filters.username}
            onChange={handleFilterChange}
          />
          <select
            id=""
            name="role"
            className="input w-1/2"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <UsersTable data={data} isLoading={isLoading} />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add User</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="First Name"
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Last Name"
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            required
            placeholder="Username"
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder="Password (min 6 characters)"
            disabled={isSubmitting}
            {...register('password')}
          />
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
