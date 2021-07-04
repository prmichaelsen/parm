import Axios from 'axios';

export const functionGoogleMe = async (req: any, res?: any) => {
  const q = req.query.q;
  const response = await Axios.get(
    'https://www.google.com/search',
    { params: { 
      q,
      client: 'robot',
      'user-agent': 'parm',
    } }
  );
  return res.send(response.data);
};
