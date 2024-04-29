import axios from "axios"
import { toast } from "ngx-sonner"
import { environment } from "../../environments/environment.development";

let config = {
  baseURL: environment.api || 'http://127.0.0.1:5757/v1',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
}
type ObjectArrayStrings = {
  [key: string]: string[];
};

const instance = axios.create(config)

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
      description: toastConfig.description
    });
    default:
      return toast.message(toastConfig.message);
  }
}

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if ((response.status === 200 || response.status === 201) && response.data.message) {
      console.log(response.data.message)
      setNotification({
        type: 'success',
        summary: 'Éxito',
        message: response.data.message,
      });
    } else if (response.data.accessToken){
      localStorage.setItem('access_token', response.data.accessToken)
      if (response.data.refreshToken) localStorage.setItem('refresh_token', response.data.refreshToken)
    }
    return response
  },
  async (error) => {
    let message = '' as string | ObjectArrayStrings
    let summary = ''
    let type: ToastType = 'error'

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
        if (!localStorage.getItem('refresh_token')) {
          summary = 'Advertencia';
          message = error.response.data.message ?? 'Acceso no autorizado';
        } else {
          try {
            console.log(localStorage.getItem('refresh_token'));
            const response = await axios.post(`${environment.api}/auth/refresh-token`, {refresh_token: localStorage.getItem('refresh_token')});
            localStorage.setItem('access_token', response.data.accesToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);

            const config = error.config;
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axios.request(config);
          } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('person');
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        break;
      default:
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

    if (typeof message === 'object') {
      for (const messageProper in message){
        if (Array.isArray(message[messageProper])) { // Check if messageProper is an array
          message[messageProper].forEach(function (msg) {
            setNotification({
              type: type,
              summary: summary,
              message: msg,
            });
          });
        }
      }
    } else {
      setNotification({
        type: type,
        summary: summary,
        message: message,
      });
    }
    return Promise.resolve(message)
    }
  );

export default instance
