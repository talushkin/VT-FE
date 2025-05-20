const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem("jToken"));
  return user;
};


const TokenService = {
  getLocalRefreshToken,
};

export default TokenService;