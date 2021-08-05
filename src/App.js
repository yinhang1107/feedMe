import React, { useState, useEffect, useRef } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";

import Bot from "./components/Bot.js";
import Order from "./components/Order.js";

const App = () => {
  const [orderNumber, setOrderNumber] = useState(1);

  const [orders, setOrders] = useState([]);
  const ordersRef = useRef([]);
  const [vipOrders, setVipOrders] = useState([]);
  const vipOrdersRef = useRef([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const completedOrdersRef = useRef([]);
  const [bots, setBots] = useState([]);
  const botsRef = useRef([]);
  const [pendingBots, setPendingBots] = useState([]);
  const pendingBotsRef = useRef([]);

  const handleAddOrder = () => {
    const order = {
      id: orderNumber,
      beingPreparedBy: null,
    };

    let newOrders = [...orders, order];

    ordersRef.current = newOrders;
    setOrders(newOrders);
    setOrderNumber(orderNumber + 1);
  };

  const handleAddVipOrder = () => {
    const vipOrder = {
      id: orderNumber,
      isVip: true,
      beingPreparedBy: null,
    };

    let newVipOrder = [...vipOrdersRef.current, vipOrder];

    vipOrdersRef.current = newVipOrder;
    setVipOrders(vipOrdersRef.current);
    setOrderNumber(orderNumber + 1);
  };

  const handleAddBot = () => {
    let bot = {
      id: bots.length,
      isPreparing: null,
      process: null,
    };

    if (pendingBots.length !== 0 && pendingBots[0].id === bots.length) {
      bot = { ...pendingBots[0] };
      let newPendingBots = pendingBots.slice(1);
      pendingBotsRef.current = newPendingBots;
      setPendingBots(newPendingBots);
    }

    let newBots = [...bots, bot];

    botsRef.current = newBots;
    setBots(newBots);
  };
  const handleDeleteBot = (bot) => {
    if (bot.isPreparing) clearTimeout(bot.process);

    let newPendingBots = [bot, ...pendingBotsRef.current];
    pendingBotsRef.current = newPendingBots;

    let newBots = botsRef.current.filter((b) => b.id !== bot.id);

    botsRef.current = newBots;

    setBots(botsRef.current);
    setPendingBots(pendingBotsRef.current);
  };
  const assignOrder = (orders, ordersRef, setOrders) => {
    for (let order of orders) {
      const bot = botsRef.current.find((bot) => !bot.isPreparing);
      if (!bot) return;

      if (!order.beingPreparedBy) {
        const index = bot.id;
        const newBot = { ...bot };
        newBot.isPreparing = order;
        let newBots = [...botsRef.current];
        newBots[index] = newBot;
        botsRef.current = newBots;
        setBots(botsRef.current);

        const orderIndex = orders.indexOf(order);
        let newOrder = { ...order };
        newOrder.beingPreparedBy = bot;
        let newOrders = [...ordersRef.current];
        newOrders[orderIndex] = newOrder;
        ordersRef.current = newOrders;
        setOrders(newOrders);
      }
    }
  };

  useEffect(() => {
    if (orders.length === 0 && vipOrders.length === 0 && bots.length === 0)
      return;

    const assignOrders = () => {
      if (vipOrders.length !== 0)
        assignOrder(vipOrders, vipOrdersRef, setVipOrders);

      if (orders.length !== 0) assignOrder(orders, ordersRef, setOrders);
    };

    assignOrders();
  }, [orders, vipOrders, bots]);

  return (
    <Container>
      <Button className="mx-2" variant="primary" onClick={handleAddOrder}>
        Add Order
      </Button>
      <Button className="mx-2" onClick={handleAddVipOrder}>
        Add VIP Order
      </Button>
      <Button className="mx-2" onClick={handleAddBot}>
        + Bot
      </Button>
      <Button
        className="mx-2"
        disabled={bots.length === 0}
        onClick={() => handleDeleteBot(bots[bots.length - 1])}
      >
        - Bot
      </Button>

      <Row>
        <Col lg={3}>
          <h2>Pending </h2>
          {vipOrders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
          {orders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </Col>
        <Col lg={3}>
          <h2>Complete</h2>
          {completedOrders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </Col>
        <Col lg={3}>
          <h2>Bots</h2>
          {bots.map((bot) => (
            <Bot
              key={bot.id}
              bot={bot}
              botsRef={botsRef}
              setBots={setBots}
              ordersRef={ordersRef}
              setOrders={setOrders}
              vipOrdersRef={vipOrdersRef}
              setVipOrders={setVipOrders}
              setCompletedOrders={setCompletedOrders}
              completedOrdersRef={completedOrdersRef}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
