import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function OrderDetails() {
  const { id } = useParams(); // récupère l'id de la commande depuis l'URL
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api
        .get(`/orders/${id}`)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!order) return <p>Chargement de la commande...</p>;

  return (
    <div>
      <h1>Détails de la commande #{order.id}</h1>
      <p>Total : {order.total} Ar</p>

      <h2>Produits :</h2>
      <ul>
        {order.items.map((item: any) => (
          <li key={item.productId}>
            {item.product.name} x {item.quantity} ={" "}
            {item.price * item.quantity} Ar
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderDetails;