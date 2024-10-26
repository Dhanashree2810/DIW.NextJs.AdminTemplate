import axios from "axios";

const fetchAppUserData = async (tokenData?: any): Promise<any> => {
  const payload = {
    form: null,
    condition: null
  };

  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/AppUser/Get`, payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const addAppUser = async (payload: any,tokenData?: any): Promise<any> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/Add`, payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to add Notification. Please try again later.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const updateAppUser = async (payload: any,tokenData?: any): Promise<any> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/AcceptReject`, payload,
      {
        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to add Notification. Please try again later.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const deleteAppUser = async (userId: string,tokenData?: any): Promise<any> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/Delete`,
      { Id: userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      throw new Error('Failed to delete Notification. Please try again later.');
    }
  } catch (error) {
    console.error('Error deleting Notification:', error);
    throw error;
  }
};

const uploadAppUser = async (image: File,tokenData?: any): Promise<any> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const formDataImage = new FormData();
    formDataImage.append('file', image);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/FileUpload`,
      formDataImage,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to upload image. Please try again later.');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

const DownloadImportExcelFile = async (payload: any,tokenData?:any): Promise<Blob> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post<Blob>(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/DownloadImportExcelFile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to download file. Please try again later.');
    }
  } catch (error) {
    console.error('File download error:', error);
    throw error;
  }
};


const importAppUserData = async (payload: any,tokenData?: any): Promise<any> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/AppUser/ImportData`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,

      },
    }
  );

  return response.data;
};

const DownloadExcelFile = async (payload: { form: null },tokenData?:any): Promise<Blob> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post<Blob>(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/DownloadExcelFile`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to download file. Please try again later.');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access - invalid or expired token');
      } else {
        console.error('File download error:', error.message || 'Unknown error');
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('File download failed. Please try again later.');
  }
};


const checkImportStatus = async (tokenData?: any): Promise<any> => {
  const token = tokenData;

  if (!token) {
    throw new Error("Authentication token is missing. Please log in.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/AppUser/ImportCheck`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Error checking import status');
  }
};


export {
  fetchAppUserData, checkImportStatus, DownloadExcelFile,
  importAppUserData, DownloadImportExcelFile,
  addAppUser, updateAppUser, deleteAppUser, uploadAppUser
}