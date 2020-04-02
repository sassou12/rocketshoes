import React from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

function Cart({ removeFromCart, updateAmountRequest }) {
  const cart = useSelector(state =>
    state.cart.map(p => ({
      ...p,
      subtotal: formatPrice(p.price * p.amount),
    }))
  );

  const total = useSelector(state => {
    return formatPrice(
      state.cart.reduce((totalCart, product) => {
        return totalCart + product.price * product.amount;
      }, 0)
    );
  });

  function increment(product) {
    updateAmountRequest(product.id, product.amount + 1);
  }

  function decrement(product) {
    updateAmountRequest(product.id, product.amount - 1);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th>{'\u00A0'}</th>
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th>{'\u00A0'}</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(product => (
            <tr key={product.id}>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      decrement(product);
                    }}
                  >
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" value={product.amount} readOnly />
                  <button
                    type="button"
                    onClick={() => {
                      increment(product);
                    }}
                  >
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    removeFromCart(product.id);
                  }}
                >
                  <MdDelete size={20} color="#7159c1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>
      <footer>
        <button type="button">Finalizar pedido</button>
        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
}

Cart.propTypes = {
  removeFromCart: PropTypes.func.isRequired,
  updateAmountRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(null, mapDispatchToProps)(Cart);
