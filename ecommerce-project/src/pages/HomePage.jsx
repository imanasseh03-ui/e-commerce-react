import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import './HomePage.css';

export function HomePage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [addedProductId, setAddedProductId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/api/products')
            .then((response) => {
                setProducts(response.data);
            });

        axios.get('http://localhost:3000/api/cart-items')
            .then((response) => {
                setCart(response.data);
            })
            
    }, []);

    async function addToCart(productId) {
        setError('');
        try {
            const quantity = Number(quantities[productId] || 1);
            await axios.post('http://localhost:3000/api/cart-items', { productId, quantity });
            const { data } = await axios.get('http://localhost:3000/api/cart-items');
            setCart(data);
            setAddedProductId(productId);
            window.setTimeout(() => setAddedProductId((current) => current === productId ? null : current), 1500);
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not add this item to your cart. Please try again.');
        }
    }
    

    return (
        <>
            <Header cart={cart} />

            <title>Ecommerce Project</title>

            <div className="home-page">
                <div className="products-grid">
                    {products.map((product) => {
                        return (
                            <div key={product.id} className = "product-container" >
                        <div className="product-image-container">
                            <img className="product-image"
                                src={product.image} />
                        </div>

                        <div className="product-name limit-text-to-2-lines">
                            {product.name}
                        </div>

                        <div className="product-rating-container">
                            <img className="product-rating-stars"
                                src={`images/ratings/rating-${product.rating.stars * 10}.png`} />
                            <div className="product-rating-count link-primary">
                                {product.rating.count}
                            </div>
                        </div>

                        <div className="product-price">
                            ${(product.priceCents / 100).toFixed(2)}
                        </div>

                        <div className="product-quantity-container">
                            <select value={quantities[product.id] || 1} onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: Number(event.target.value) }))}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>

                        <div className="product-spacer"></div>

                        <div className="added-to-cart" style={{ visibility: addedProductId === product.id ? 'visible' : 'hidden' }}>
                            <img src="images/icons/checkmark.png" />
                            Added
                        </div>

                        <button className="add-to-cart-button button-primary" onClick={() => addToCart(product.id)}>
                            Add to Cart
                        </button>
                    </div>
                );
                    })}
                
            </div>
            {error && <div role="alert" className="cart-error">{error}</div>}
        </div >
        </>

    );
}
