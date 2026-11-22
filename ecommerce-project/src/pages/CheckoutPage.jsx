import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import './CheckoutPage.css';

const API = 'http://localhost:3000/api';

export function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/cart-items?expand=product`)
            .then(({ data }) => setCart(data))
            .catch((error) => console.error('Could not load cart:', error))
            .finally(() => setLoading(false));
    }, []);

    async function deleteCartItem(productId) {
        try {
            await axios.delete(`${API}/cart-items/${productId}`);
            setCart((items) => items.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error('Could not delete cart item:', error);
        }
    }

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const productsTotal = cart.reduce((total, item) => total + item.product.priceCents * item.quantity, 0);

    return (
        <>
            <Header cart={cart} />
            <title>Checkout</title>
            <div className="checkout-page">
                <div className="page-title">Review your order</div>
                <div className="checkout-grid">
                    <div className="order-summary">
                        {loading ? <p>Loading cart...</p> : cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((item) => (
                            <div className="cart-item-container" key={item.productId}>
                                <div className="delivery-date">Delivery date: Tuesday, June 21</div>
                                <div className="cart-item-details-grid">
                                    <img className="product-image" src={item.product.image} alt={item.product.name} />
                                    <div className="cart-item-details">
                                        <div className="product-name">{item.product.name}</div>
                                        <div className="product-price">${(item.product.priceCents / 100).toFixed(2)}</div>
                                        <div className="product-quantity">
                                            <span>Quantity: <span className="quantity-label">{item.quantity}</span></span>
                                            <button className="delete-quantity-link link-primary" onClick={() => deleteCartItem(item.productId)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="payment-summary">
                        <div className="payment-summary-title">Payment Summary</div>
                        <div className="payment-summary-row">
                            <div>Items ({itemCount}):</div>
                            <div className="payment-summary-money">${(productsTotal / 100).toFixed(2)}</div>
                        </div>
                        <div className="payment-summary-row subtotal-row">
                            <div>Order total:</div>
                            <div className="payment-summary-money">${(productsTotal / 100).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
