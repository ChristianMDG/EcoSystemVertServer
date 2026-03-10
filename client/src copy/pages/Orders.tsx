import { useState } from "react";
import api from "../api/axios";

function Orders() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const createOrder = async () => {
    await api.post("/orders", {
      products: [
        {
          productId,
          quantity,
        },
      ],
    });

    alert("Commande créée !");
  };

  return (
    <div>
      <h1>Créer une commande</h1>

      <input
        placeholder="Product ID"
        onChange={(e) => setProductId(e.target.value)}
      />

      <input
        type="number"
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <button onClick={createOrder}>Commander</button>
    </div>
  );
}

export default Orders;