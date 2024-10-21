import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../lib/store';
import { useState, useEffect } from 'react';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface AdoptionRequest {
  petId: string;
  userId: string;
}

export function useAdoptionRequests() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);

  useEffect(() => {
    const storedRequests = localStorage.getItem('adoptionRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  const addRequest = (newRequest: AdoptionRequest) => {
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('adoptionRequests', JSON.stringify(updatedRequests));
  };

  const hasExistingRequest = (petId: string, userId: string) => {
    return requests.some(request => request.petId === petId && request.userId === userId);
  };

  return { requests, addRequest, hasExistingRequest };
}
