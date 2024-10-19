'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList, deleteUser } from '../../lib/features/user/userSlice';
import { AppDispatch, RootState } from '../../lib/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const UserTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userList = useSelector((state: RootState) => state.user?.userList);
  const status = useSelector((state: RootState) => state.user?.status);
  const error = useSelector((state: RootState) => state.user?.error);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const usersPerPage = 7;
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        const userId = decodedToken.id;

        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/users/${userId}`);
            setRole(response.data.role);

            if (response.data.role !== "ADMIN") {
              router.push("/errorpage");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            router.push("/error");
          }
        };

        fetchUser();
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        router.push("/error");
      }
    } else {
      router.push("/error");
    }
  }, [router]);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(userList || []);
  }, [userList]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const resultAction = await dispatch(deleteUser(id));
        if (deleteUser.fulfilled.match(resultAction)) {
          console.log('User deleted successfully');
          setDeleteError(null);
          dispatch(fetchUserList());
        } else if (deleteUser.rejected.match(resultAction)) {
          const error = JSON.parse(resultAction.payload as string);
          setDeleteError(`Failed to delete user: ${error.message}`);
        }
      } catch (err: any) {
        setDeleteError('An unexpected error occurred while deleting the user');
      }
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    const filtered = userList?.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => setCurrentPage(prevPage => prevPage + 1);
  const handlePrevPage = () => setCurrentPage(prevPage => prevPage - 1);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (status === 'loading') return <div className="text-center text-gray-600">Loading...</div>;
  if (status === 'failed') return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">User Management</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search users by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 transition duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {deleteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {deleteError}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Avatar</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="border-b">
                <td className="py-4 px-6">{indexOfFirstUser + index + 1}</td>
                <td className="py-4 px-6">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                </td>
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">{user.role}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;