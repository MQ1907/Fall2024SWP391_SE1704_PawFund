'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, deleteUser } from '../../lib/features/user/userSlice';

const UserTable = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state: any) => state.user?.userList);
  const status = useSelector((state: any) => state.user?.status);
  const error = useSelector((state: any) => state.user?.error);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const resultAction = await dispatch(deleteUser(id));
        if (deleteUser.fulfilled.match(resultAction)) {
          console.log('User deleted successfully');
          setDeleteError(null);
          // Refresh the user list after successful deletion
          dispatch(fetchUserList());
        } else if (deleteUser.rejected.match(resultAction)) {
          const error = JSON.parse(resultAction.payload as string);
          console.error('Failed to delete user:', error);
          setDeleteError(`Failed to delete user: ${error.message}`);
        }
      } catch (err: any) {
        console.error('An error occurred while deleting the user:', err);
        setDeleteError('An unexpected error occurred while deleting the user');
      }
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userList.slice(indexOfFirstUser, indexOfLastUser);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='mt-[148px]'>
      {deleteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {deleteError}</span>
        </div>
      )}
      <table className='min-w-full bg-white'>
        <thead>
          <tr>
            <th className='py-2 text-center'>ID</th>
            <th className='py-2 text-center'>Avatar</th>
            <th className='py-2 text-center'>Name</th>
            <th className='py-2 text-center'>Email</th>
            <th className='py-2 text-center'>Role</th>
            <th className='py-2 text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user._id}>
              <td className='border px-4 py-2 text-center'>{indexOfFirstUser + index + 1}</td>
              <td className='border px-4 py-2 flex items-center justify-center'>
                <img src={user.avatar} alt='avatar' className='w-16 h-16 rounded-full' />
              </td>
              <td className='border px-4 py-2 text-center'>{user.name}</td>
              <td className='border px-4 py-2 text-center'>{user.email}</td>
              <td className='border px-4 py-2 text-center'>{user.role}</td>
              <td className='border px-4 py-2 text-center'>
                <button
                  onClick={() => handleDelete(user._id)}
                  className='bg-red-500 text-white px-4 py-2 rounded'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex justify-between items-center mt-4'>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className='bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          &#8592;
        </button>
        <span className='text-center'>
          Page {currentPage} of {Math.ceil(userList.length / usersPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(userList.length / usersPerPage)}
          className='bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default UserTable;
