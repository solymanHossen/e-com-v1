const sendResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  return res.satus(status).json({ success, message, data });
};
