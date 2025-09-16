import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api/vehicles/';


const api = axios.create({
  baseURL: API_BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const vehiclesAPI = {
  getAll: () => api.get(''),
  getById: (id: string) => api.get(`${id}/`),
  create: (data: any) => api.post('', data),
  update: (id: string, data: any) => api.put(`${id}/`, data),
  partialUpdate: (id: string, data: any) => api.patch(`${id}/`, data),
  delete: (id: string) => api.delete(`${id}/`),
  addImage: (id: string, image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post(`${id}/add-image/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getUserVehicles: () => api.get('my-vehicles/'),
  getVehiclesByUserId: (userId: string) => api.get(`?user=${userId}`),
  deleteImage: (vehicleId: string, imageId: string) => 
    api.delete(`${vehicleId}/delete-image/${imageId}/`),
};

export default vehiclesAPI;
