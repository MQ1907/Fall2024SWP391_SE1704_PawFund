import axios from 'axios';


export const fetchUserData = async (userId: string) => {
  try {
    const response = await axios.get(`http://localhost:8000/users/${userId}`);
    console.log('User data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Fetch user data error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Fetch user data failed');
  }
};


export const fetchUserList = async () => {
  try {
    const response = await axios.get('http://localhost:8000/users');
    console.log('User list:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Fetch user list error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Fetch user list failed');
  }
};


export const deleteUser = async (userId: string) => {
  try {
    console.log('Attempting to delete user with ID:', userId);
    const response = await axios.delete(`http://localhost:8000/users/${userId}`);
    console.log('Delete user response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Delete user error:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
