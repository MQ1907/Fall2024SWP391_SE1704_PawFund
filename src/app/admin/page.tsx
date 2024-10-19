"use client"; // Thêm dòng này để chỉ định đây là Client Component

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { fetchPets, searchPets, updatePetDeliveryStatus } from '../../lib/features/pet/petSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  exp: number;
  iat: number;
}

const Admin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pets = useSelector((state: RootState) => state.pets.filteredPets);
  const status = useSelector((state: RootState) => state.pets.status);
  const error = useSelector((state: RootState) => state.pets.error);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

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
    if (status === "idle") {
      dispatch(fetchPets());
    }
  }, [status, dispatch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(searchPets(searchTerm));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(searchPets(searchTerm));
    }
  };

  const handleUpdate = (petId: string) => {
    setSelectedPetId(petId);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (status: string) => {
    if (selectedPetId) {
      try {
        await dispatch(updatePetDeliveryStatus({ petId: selectedPetId, deliveryStatus: status })).unwrap();
        dispatch(fetchPets());
      } catch (error) {
        console.error('Failed to update pet delivery status:', error);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">Pet Management</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            placeholder="Search pets by name"
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

      {status === 'loading' && <p className="text-center text-gray-600">Loading...</p>}
      {status === 'failed' && <p className="text-center text-red-500">Error: {error}</p>}
      {status === 'succeeded' && pets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="text-left border-b">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Age</th>
                <th className="py-4 px-6">Breed</th>
                <th className="py-4 px-6">Vaccinated</th>
                <th className="py-4 px-6">Delivery Status</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet, index) => (
                <tr key={pet._id} className="border-b">
                  <td className="py-4 px-6">{index + 1}</td>
                  <td className="py-4 px-6">
                    <img src={pet.image} alt={pet.name} className="w-20 h-20 object-cover rounded-full" />
                  </td>
                  <td className="py-4 px-6">{pet.name}</td>
                  <td className="py-4 px-6">{pet.age}</td>
                  <td className="py-4 px-6">{pet.breed}</td>
                  <td className="py-4 px-6">{pet.isVacinted ? 'Yes' : 'No'}</td>
                  <td className="py-4 px-6">{pet.deliveryStatus}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleUpdate(pet._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {status === 'succeeded' && pets.length === 0 && (
        <p className="text-center text-gray-600">No pets found matching the search term.</p>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
            <div className="space-y-3">
              {['INPROCESS', 'COMPLETED', 'PENDING'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;