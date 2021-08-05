import React, { useEffect } from "react";

const Bot = ({
  bot,
  botsRef,
  setBots,
  ordersRef,
  setOrders,
  vipOrdersRef,
  setVipOrders,
  setCompletedOrders,
  completedOrdersRef,
}) => {
  const prepareOrder = () => {
    const order = { ...bot.isPreparing };

    const process = setTimeout(() => {
      const index = bot.id;
      let newBot = { ...bot };
      newBot.isPreparing = null;
      let newBots = [...botsRef.current];
      newBots[index] = newBot;
      botsRef.current = newBots;

      let newCompletedOrders = [...completedOrdersRef.current, order];
      completedOrdersRef.current = newCompletedOrders;

      if (order.isVip) {
        let newVipOrders = [...vipOrdersRef.current].filter(
          (ord) => ord.id !== order.id
        );
        vipOrdersRef.current = newVipOrders;
        setVipOrders(newVipOrders);
      } else {
        let newOrders = [...ordersRef.current].filter(
          (ord) => ord.id !== order.id
        );
        ordersRef.current = newOrders;
        setOrders(newOrders);
      }

      setBots(botsRef.current);
      setCompletedOrders(completedOrdersRef.current);
    }, 10000);

    const index = bot.id;
    const newBot = { ...bot };
    newBot.process = process;
    botsRef.current[index] = newBot;
    setBots(botsRef.current);
  };
  useEffect(() => {
    if (bot.isPreparing) {
      prepareOrder();
    }
    // eslint-disable-next-line
  }, [bot.isPreparing]);

  return (
    <div className="d-flex">
      {bot.isPreparing
        ? `Bot ${bot.id} is preparing ${bot.isPreparing?.id}`
        : `Bot ${bot.id}: Free`}
    </div>
  );
};

export default Bot;
