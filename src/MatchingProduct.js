// src/MatchingProducts.js
import React from 'react';
import './MatchingProducts.css';

function MatchingProducts({ matches }) {
  return (
    <div className="matching-products">
      {matches.length > 0 ? (
        <div className="matches">
          {matches.map((product) => (
            <div key={product.id} className="product">
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <p>ID: {product.id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matches found. Upload an image and click "Find a Match".</p>
      )}
    </div>
  );
}

export default MatchingProducts;
