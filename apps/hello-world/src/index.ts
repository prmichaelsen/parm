export const helloWorld = async (req: any, res?: any) => {
  const auth = req.query.apiSecret === process.env.apiSecret;
  if (auth) {
    try {
      const value = req.query.value || 'Hello World';
      return res.status(200).send(value);
    } catch (error) {
      console.error(new Error(error));
      return res.sendStatus(500);
    }
  } else {
    console.error(new Error(`401`));
    return res.sendStatus(401);
  }
};
