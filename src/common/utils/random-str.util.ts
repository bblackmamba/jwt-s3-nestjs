const randomStr = (length: number): string => {
  const l = length || 17;
  const charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = charList.charAt(Math.round(Math.random() * 51));

  for (let i = 0; i < l - 1; i += 1) {
    text += charList.charAt(Math.round(Math.random() * 61));
  }
  return text;
};

export default randomStr;
