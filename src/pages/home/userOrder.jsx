import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userorder.css";
import Header from "../../components/Navbar";
import config from "../../config/config";
import OrderTracker from "../../components/OrderTracker";
import WriteProductReview from "../../components/WriteProductReview";
import ReviewBox from "../../components/ReviewBox";
import { timeStampToLocalString } from "../dashboard/helper";

const BASE_URL = "http://127.0.0.1:8000";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewSummaries, setReviewSummaries] = useState({});
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchReviewSummary = async (productId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/v1/products/${productId}/review-summary/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch review summary");
      }
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching review summary for product ${productId}:`,
        error
      );
      return null;
    }
  };

  const fetchAllReviewSummaries = async (orders) => {
    setIsLoadingSummaries(true);
    try {
      const summaries = {};
      const productIds = new Set();
      orders.forEach(({ products_reviewed }) => {
        Object.entries(products_reviewed).forEach(([productId, data]) => {
          if (data.has_review) {
            productIds.add(productId);
          }
        });
      });

      const summaryPromises = Array.from(productIds).map(async (productId) => {
        const summary = await fetchReviewSummary(productId);
        if (summary) {
          summaries[productId] = summary;
        }
      });

      await Promise.all(summaryPromises);
      setReviewSummaries(summaries);
    } catch (error) {
      console.error("Error fetching review summaries:", error);
    } finally {
      setIsLoadingSummaries(false);
    }
  };

  useEffect(() => {
    if (orders && orders.length > 0) {
      fetchAllReviewSummaries(orders);
    }
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${config.BASE_URL}api/v1/orders/user-orders/${userId}/`
        );
        if (Array.isArray(response.data)) {
          const ordersWithItems = await Promise.all(
            response.data.map(async (orderData) => {
              const orderId = orderData.order.order_id;
              if (orderId) {
                try {
                  const itemsResponse = await axios.get(
                    `${config.BASE_URL}api/v1/orders/order-items/${orderId}/`
                  );
                  return {
                    ...orderData,
                    order_items: itemsResponse.data,
                  };
                } catch (itemsError) {
                  console.error(
                    `Error fetching items for Order ID ${orderId}:`,
                    itemsError
                  );
                  return orderData;
                }
              } else {
                return orderData;
              }
            })
          );
          setOrders(ordersWithItems);
        } else {
          console.error("Response data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleDeleteOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmModal(true);
  };

  const confirmDeletion = async () => {
    try {
      await axios.delete(
        `${config.BASE_URL}api/v1/orders/delete/${selectedOrderId}/`
      );
      setOrders(
        orders.filter((order) => order.order.order_id !== selectedOrderId)
      );
      toast.success("Order deleted successfully.");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete the order. Please try again.");
    }
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  };

  const cancelDeletion = () => {
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  };

  const downloadReceipt = async (order) => {
    const doc = new jsPDF();
    const centerText = (text, y) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Company Name Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    centerText("Wine Haus", 20);

    // Receipt Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    centerText("Order Receipt", 30);

    // Border & Sectioned Layout
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 40, 190, 140); // Outer border

    // Order Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Details", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${order.order.order_id}`, 15, 60);
    doc.text(
      `Order Date: ${new Date(order.order.order_date).toLocaleDateString()}`,
      15,
      70
    );
    doc.text(`Order Status: ${order.order.order_status}`, 15, 80);

    // Payment Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", 15, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment ID: ${order.order.payment_id || "N/A"}`, 15, 100);
    doc.text(`Total Amount: ₹${order.order.total_amount}`, 15, 110);

    // Items Section Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Items Purchased", 15, 120);

    // Item Details
    doc.setFontSize(10);
    let yPosition = 130;
    order.order_items.forEach((item, index) => {
      doc.text(`Item ${index + 1}: ${item.product_id.name}`, 15, yPosition);
      doc.text(
        `Description: ${item.product_id.description || "N/A"}`,
        15,
        yPosition + 10
      );
      doc.text(`Quantity: ${item.quantity}`, 15, yPosition + 20);
      doc.text(`Price per item: ₹${item.price}`, 15, yPosition + 30);
      yPosition += 40;
    });

    // Footer Section
    doc.setFontSize(10);
    centerText("Thank you for your purchase!", yPosition + 10);
    centerText(
      "For any inquiries, contact us at support@winehaus.com",
      yPosition + 20
    );

    // Download the PDF
    doc.save(`Order_${order.order.order_id}_Receipt.pdf`);
    toast.success("Receipt downloaded successfully.");
  };

  return (
    <div>
      <Header />
      <div className="orders-container">
        <h1 className="orders-title">Your Orders</h1>

        {orders.map(({ order, order_items, products_reviewed }) => (
          <div key={order.order_id} className="order-card">
            <p className="order-date">
              Order Date: {new Date(order.order_date).toLocaleDateString()}
            </p>
            <h4 className="order-items-title">Items:</h4>
            <ul className="order-items-list">
              {order_items.map((item) => {
                const productReview =
                  products_reviewed[item.product_id.product_id];
                const reviewSummary =
                  reviewSummaries[item.product_id.product_id];

                return (
                  <li key={item.order_item_id} className="order-item">
                    <div className="order-content-wrapper">
                      <div className="order-main-content">
                        <img
                          src={
                            item.product_id.image
                              ? `${BASE_URL}${item.product_id.image}`
                              : "https://via.placeholder.com/150"
                          }
                          alt={item.product_id.name}
                          className="order-item-image"
                        />
                        <div className="order-item-info">
                          <strong>{item.product_id.name}</strong>
                          <div>
                            Description:{" "}
                            {item.product_id.description ||
                              "No description available"}
                          </div>
                          <div>Quantity: {item.quantity}</div>
                          <div>Price per item: ₹{item.price}</div>

                          {productReview?.has_review ? (
                            <div className="review-box-container">
                              <ReviewBox
                                feedbackSummaryProd={reviewSummary?.data}
                                ratingText={"Your Rating"}
                              />
                            </div>
                          ) : (
                            <>
                              {item.order_status === "delivered" && (
                                <WriteProductReview
                                  productId={item.product_id.product_id}
                                  userId={order.user_id}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="order-tracking-section">
                        {item.order_status !== "delivered" ? (
                          <OrderTracker
                            orderDeliveryStatus={item.order_status}
                          />
                        ) : (
                          <div className="delivery-status">
                            <span className="delivery-icon">✓</span>
                            <div className="delivery-text">
                              <span className="delivery-label">
                                Delivered on:
                              </span>
                              <span className="delivery-date">
                                {timeStampToLocalString(order?.updated_at)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="order-actions">
              <button
                className="delete-order-button"
                onClick={() => handleDeleteOrder(order.order_id)}
              >
                Delete Order
              </button>
              <button
                className="download-receipt-button"
                onClick={() => downloadReceipt({ order, order_items })}
              >
                Download Receipt
              </button>
            </div>
          </div>
        ))}

        {showConfirmModal && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <div className="confirm-modal-content">
                <h2>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>{" "}
                  Confirm Deletion
                </h2>
                <p>Are you sure you want to delete this order?</p>
                <div className="modal-buttons">
                  <button onClick={confirmDeletion} className="confirm-btn">
                    Yes
                  </button>
                  <button onClick={cancelDeletion} className="cancel-btn">
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default OrdersPage;
