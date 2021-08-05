import React from "react";

const Order = ({ order }) => {
  const { id, isVip } = order;
  return <>{isVip ? <h2 className="text-danger">{id}</h2> : <h2>{id}</h2>}</>;
};

export default Order;
