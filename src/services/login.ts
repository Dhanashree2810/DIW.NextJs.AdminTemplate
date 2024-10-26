import axios from "axios";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/Login/LoginPin`;

interface LoginPayload {
  emailId: string;
  pin: string;
}

interface LoginResponse {
  token?: string;
  [key: string]: any;
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    const data: LoginResponse = response.data;
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
