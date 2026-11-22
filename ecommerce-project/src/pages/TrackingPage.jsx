import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Header } from '../components/Header';
import './TrackingPage.css';

const API = 'http://localhost:3000/api';

export function TrackingPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [cart, setCart] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/orders/${orderId}?expand=products`),
            axios.get(`${API}/cart-items`)
        ]).then(([orderResponse, cartResponse]) => {
            setOrder(orderResponse.data);
            setCart(cartResponse.data);
        }).catch(() => setError('Could not find tracking details for this order.'));
    }, [orderId]);

    const firstProduct = order?.products?.[0];
    const deliveryDate = firstProduct?.estimatedDeliveryTimeMs;
    const delivered = deliveryDate && Date.now() >= Number(deliveryDate);

    return (
        <>
            <title>Track order</title>
            <Header cart={cart} />
            <div className="tracking-page">
                <div className="order-tracking">
                    <Link className="back-to-orders-link link-primary" to="/orders">View all orders</Link>
                    {error ? <p role="alert">{error}</p> : !order ? <p>Loading tracking details...</p> : (
                        <>
                            <div className="delivery-date">{delivered ? 'Delivered' : 'Arriving'} {deliveryDate ? new Date(Number(deliveryDate)).toLocaleDateString() : 'date unavailable'}</div>
                            <div className="product-info">Order {order.id}</div>
                            {order.products.map((item) => item.product && (
                                <div className="tracking-product" key={item.productId}>
                                    <div className="product-info">{item.product.name}</div>
                                    <div className="product-info">Quantity: {item.quantity}</div>
                                    <img className="product-image" src={item.product.image} alt={item.product.name} />
                                </div>
                            ))}
                            <div className="progress-labels-container">
                                <div className="progress-label">Preparing</div>
                                <div className={`progress-label ${!delivered ? 'current-status' : ''}`}>{delivered ? 'Delivered' : 'On the way'}</div>
                                <div className={`progress-label ${delivered ? 'current-status' : ''}`}>Delivered</div>
                            </div>
                            <div className="progress-bar-container"><div className="progress-bar" style={{ width: delivered ? '100%' : '50%' }} /></div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
