const convertMoney = (money) => {
  return new Intl.NumberFormat("vi-VN").format(money);
};

export default convertMoney