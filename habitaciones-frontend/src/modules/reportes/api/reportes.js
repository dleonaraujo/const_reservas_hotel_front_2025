import axios from '../../../api/index.js';

export default {
  ventasPorFecha(desde, hasta) {
    return axios.get('/reportes/ventas', {
      params: { desde, hasta }
    });
  }
};
