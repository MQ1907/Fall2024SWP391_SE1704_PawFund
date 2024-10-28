import axios from 'axios';

export const fetchEvents = async () => {
  try {
    const response = await axios.get('http://localhost:8000/event/view-all');
    console.log('Event Data with Supporters:', response.data); 
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    throw error.response?.data || error.message;
  }
};
