import axios from 'axios';
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];

// Helper function to get the authentication token
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('token');
  }
  return null;
};

const fetchGetDashboardData = async (currentDate: string, tokenData?: any): Promise<any> => {

  const payload = {
    date1: formattedDate,
    value: 0,
  };

  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Home/GetDashboardData`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};


const fetchGetAdminDashboardData = async (payload: any, tokenData?: any): Promise<any> => {
  const token = tokenData;
  
  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Home/GetAdminDashboardData`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};


export { fetchGetDashboardData, fetchGetAdminDashboardData }

