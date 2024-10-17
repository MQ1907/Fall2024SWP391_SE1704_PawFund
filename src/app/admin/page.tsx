"use client"; // Thêm dòng này để chỉ định đây là Client Component

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { fetchPets, searchPets, updatePetDeliveryStatus } from '../../lib/features/pet/petSlice';

const Admin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pets = useSelector((state: RootState) => state.pets.filteredPets);
  const status = useSelector((state: RootState) => state.pets.status);
  const error = useSelector((state: RootState) => state.pets.error);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);

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
      console.log('Updating pet with ID:', selectedPetId);
      try {
        const result = await dispatch(updatePetDeliveryStatus({ petId: selectedPetId, deliveryStatus: status })).unwrap();
        console.log('Update result:', result);
        dispatch(fetchPets());
      } catch (error) {
        console.error('Failed to update pet delivery status:', error);
      }
    } else {
      console.error('No pet selected');
    }
    setIsModalOpen(false);
  };

  return (
    <div className='mt-[148px]'>
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search pets by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded-l px-4 py-2 w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && pets.length > 0 && (
        <div className="flex flex-col border border-gray-300">
          <div className="flex border-b border-gray-300">
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">ID</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[300px]">Hình ảnh</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">Name</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">Age</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">Breed</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center flex-1">Description</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">Vaccinated</div>
            <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[150px]">Delivery Status</div>
            <div className="p-4 flex items-center justify-center w-[200px]">Action</div>
          </div>
          {pets.map((pet, index) => (
            <div key={pet._id} className="flex border-b border-gray-300">
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">{index + 1}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[300px]">
                <img src={pet.image} alt={pet.name} className="w-32 h-32 object-cover" />
              </div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">{pet.name}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">{pet.age}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[250px]">{pet.breed}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center flex-1">{pet.description}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[100px]">{pet.isVacinted ? 'Yes' : 'No'}</div>
              <div className="border-r border-gray-300 p-4 flex items-center justify-center w-[150px]">{pet.deliveryStatus}</div>
              <div className="p-4 flex items-center justify-center w-[200px]">
                <button
                  onClick={() => handleUpdate(pet._id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {status === 'succeeded' && pets.length === 0 && (
        <p>No pets found matching the search term.</p>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
            <div className="space-y-2">
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
