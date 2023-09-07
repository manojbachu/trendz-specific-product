import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, rating, brand, price} = productDetails

  return (
    <li className="similar-product-card">
      <img className="similar-product-image" src={imageUrl} alt={title} />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-rating-price">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p className="similar-product-rating">{rating}</p>
          <img
            className="similar-product-star-image"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
