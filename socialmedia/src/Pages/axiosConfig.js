import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://<Your_Instance_PublicIP>:8000', // Replace 'publicIP' with your backend's public IP address
});

export default instance;
