import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import PropTypes from 'prop-types';

import { formatPrice } from '../../util/format';
import api from '../../services/api';
import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

function Home({ addToCartRequest }) {
  const [products, setProducts] = useState([]);
  const amount = useSelector(state =>
    state.cart.reduce((amountCart, product) => {
      amountCart[product.id] = product.amount;
      return amountCart;
    }, {})
  );

  useEffect(() => {
    async function loadingProducts() {
      const response = await api.get('/products');
      const data = response.data.map(p => ({
        ...p,
        priceFormatted: formatPrice(p.price),
      }));
      setProducts(data);
    }
    loadingProducts();
  }, []);

  const handleAddProduct = id => {
    addToCartRequest(id);
  };

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button type="button" onClick={() => handleAddProduct(product.id)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />
              {amount[product.id] || 0}
            </div>
            <span>Adicionar ao carrinho</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}

Home.propTypes = {
  addToCartRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(null, mapDispatchToProps)(Home);
