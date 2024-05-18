import axios from 'axios';
import { toast } from 'ngx-sonner';
import { environment } from '../../environments/environment.development';
import { LOCAL_STORAGE } from '../utils/constants.utils';

export let axiosConfiguration = {
  baseURL: environment.api || 'http://127.0.0.1:5757/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)}`,
  },
};
type ObjectArrayStrings = {
  [key: string]: string[];
};

const instance = axios.create(axiosConfiguration);

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'description';
type ToastConfig = {
  type: ToastType;
  summary: string;
  message: string;
  description?: string;
};

function setNotification(toastConfig: ToastConfig) {
  switch (toastConfig.type) {
    case 'success':
      return toast.success(toastConfig.message);
    case 'error':
      return toast.error(toastConfig.message);
    case 'warning':
      return toast.warning(toastConfig.message);
    case 'info':
      return toast.info(toastConfig.message);
    case 'description':
      return toast.message(toastConfig.message, {
        description: toastConfig.description,
      });
    default:
      return toast.message(toastConfig.message);
  }
}

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if ((response.status === 200 || response.status === 201) && response.data.message) {
      console.log(response.data.message);
      setNotification({
        type: 'success',
        summary: 'Éxito',
        message: response.data.message,
      });
    } else if (response.data.accessToken) {
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, response.data.accessToken);
      if (response.data.refreshToken)
        localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, response.data.refreshToken);
    }
    return response;
  },
  async (error) => {
    let message = '' as string | ObjectArrayStrings;
    let summary = '';
    let type: ToastType = 'error';

    switch (error.response.status) {
      case 0:
        summary = 'Error de conexión';
        message = 'No se pudo conectar con el servidor';
        break;
      case 300:
        return Promise.reject(error);
      case 500:
        summary = 'Error de servidor';
        message = 'Error';
        break;
      case 401:
        if (!localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)) {
          summary = 'Advertencia';
          message = error.response.data.message ?? 'Acceso no autorizado';
        } else {
          try {
            console.log(localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN));
            const response = await axios.post(`${environment.api}/auth/refresh-token`, {
              refreshToken: localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN),
            });
            localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, response.data.accesToken);
            localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, response.data.refreshToken);

            const config = error.config;
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axios.request(config);
          } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.PERSON);
            window.location.href = '/auth/login';
            return Promise.reject(error);
          }
        }
        break;
      default:
        console.log('entro al default state');
        if (error.response?.status >= 400 && error.response?.status < 500) {
          if (error.response?.data?.message) {
            message = error.response?.data?.message;
          } else if (error.response?.data?.error) {
            message = error.response?.data?.error;
          }
          summary = 'Advertencia';
        } else {
          message = error.response.statusText;
        }
        break;
    }

    if (typeof message === 'object' && !Array.isArray(message)) {
      for (const messageProper in message) {
        console.log({ messageProper });
        if (Array.isArray(message[messageProper])) {
          // Check if messageProper is an array
          message[messageProper].forEach(function (msg) {
            setNotification({
              type: type,
              summary: summary,
              message: msg,
            });
          });
        }
      }
    } else if (Array.isArray(message)) {
      message.forEach(function (msg) {
        setNotification({
          type: 'error',
          summary: summary,
          message: msg,
        });
      });
    } else {
      setNotification({
        type: type,
        summary: summary,
        message: message,
      });
    }

    return Promise.resolve(error);
  },
);

export default instance;
