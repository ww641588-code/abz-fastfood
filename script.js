let orderHistory = JSON.parse(
  localStorage.getItem("abzOrderHistory")
) || [];

async function saveOrder(order) {
  orderHistory.unshift(order);

  localStorage.setItem(
    "abzOrderHistory",
    JSON.stringify(orderHistory)
  );

  try {
    alert("Request backend tak ja rahi hai ✅");

    const response = await fetch("http://127.0.0.1:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(order)
    });

    const result = await response.json();

    alert("Backend response: " + JSON.stringify(result));

    if (result.success) {
      console.log("Order saved to MongoDB ✅");
    } else {
      console.log("MongoDB save failed ❌");
    }

  } catch (error) {
    alert("Backend connection error ❌ " + error.message);
    console.log(error);
  }
}

function openOrderHistory() {
  displayOrderHistory();
  document.getElementById("orderHistoryModal").style.display = "flex";
}

function closeOrderHistory() {
  document.getElementById("orderHistoryModal").style.display = "none";
}

function displayOrderHistory() {
  const container = document.getElementById("orderHistory");

  if (!orderHistory.length) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  container.innerHTML = orderHistory.map(order => `
    <div class="order-card">
      <h3>Order #${order.id}</h3>
      <p>📅 ${order.date}</p>

      ${order.items.map(item => `
        <p>
          ${item.name} × ${item.quantity}
          — ₹${item.price * item.quantity}
        </p>
      `).join("")}

      <strong>💰 Total: ₹${order.total}</strong>
      <p>✅ ${order.status}</p>
    </div>
  `).join("");
}
