import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router';
import './OrdersPage.css';

const API = 'http://localhost:3000/api';

export function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/orders?expand=products`),
            axios.get(`${API}/cart-items`)
        ]).then(([ordersResponse, cartResponse]) => {
            setOrders(ordersResponse.data);
            setCart(cartResponse.data);
        }).catch(() => setError('Could not load your orders. Please try again.'))
            .finally(() => setLoading(false));
    }, []);

    async function deleteOrder(orderId) {
        try {
            await axios.delete(`${API}/orders/${orderId}`);
            setOrders((current) => current.filter((order) => order.id !== orderId));
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not delete this order. Please try again.');
        }
    }

    return (
        <>
            <title>Orders</title>
            <Header cart={cart} />
            <div className="orders-page">
                <div className="orders-heading">
                    <div><p className="orders-eyebrow">ACCOUNT</p><h1 className="page-title">Your orders</h1><p className="orders-subtitle">View purchases, track deliveries, and manage your order history.</p></div>
                    <Link className="continue-shopping" to="/">Continue shopping</Link>
                </div>
                {error && <p className="orders-error" role="alert">{error}</p>}
                {loading ? <p className="orders-empty">Loading your orders…</p> : orders.length === 0 && !error ? <div className="orders-empty"><h2>No orders yet</h2><p>Your purchases will appear here once you place an order.</p><Link className="continue-shopping" to="/">Explore products</Link></div> : (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            <div className="order-container" key={order.id}>
                                <div className="order-header">
                                    <div className="order-header-left-section">
                                        <div className="order-date"><div className="order-header-label">ORDER PLACED</div><div>{new Date(Number(order.orderTimeMs)).toLocaleDateString()}</div></div>
                                        <div className="order-total"><div className="order-header-label">TOTAL</div><div>${(order.totalCostCents / 100).toFixed(2)}</div></div>
                                    </div>
                                    <div className="order-header-right-section"><div className="order-header-label">ORDER ID</div><div>{order.id}</div></div>
                                </div>
                                <div className="order-details-grid">
                                    {order.products.map((item) => item.product && (
                                        <div className="order-product-row" key={item.productId}>
                                            <div className="product-image-container"><img src={item.product.image} alt={item.product.name} /></div>
                                            <div className="product-details">
                                                <div className="product-name">{item.product.name}</div>
                                                <div className="product-delivery-date">Estimated delivery: {new Date(Number(item.estimatedDeliveryTimeMs)).toLocaleDateString()}</div>
                                                <div className="product-quantity">Quantity: {item.quantity}</div>
                                            </div>
                                            <div className="order-product-status">{Date.now() >= Number(item.estimatedDeliveryTimeMs) ? 'Delivered' : 'On the way'}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="product-actions">
                                    <Link to={`/tracking/${order.id}`} className="track-package-button button-secondary">Track package</Link>
                                    <button className="delete-order-button" onClick={() => deleteOrder(order.id)}>Delete order</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
