export const getOrders = (req, res) => {
  const orders = [
    { id: 1, customer: "John Doe", total: 50.99 },
    { id: 2, customer: "Jane Smith", total: 20.99 },
  ];
  res.json(orders);
};
