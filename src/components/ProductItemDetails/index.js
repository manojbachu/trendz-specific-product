import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {count: 1, productDetails: {}, similarProductList: []}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const productDetails = this.convertSnakeToCamelCase(data)
    const productList = {similarProducts: data.similar_products}

    this.setState({
      productDetails,
      similarProductList: productList.similarProducts.map(eacdData => {
        const convertedData = this.convertSnakeToCamelCase(eacdData)
        return convertedData
      }),
    })
  }

  convertSnakeToCamelCase = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    style: data.style,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  onClickDecrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  onClickIncrease = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderSimilarProducts = () => {
    const {similarProductList} = this.state

    return (
      <ul className="similar-products">
        {similarProductList.map(details => (
          <SimilarProductItem productDetails={details} key={details.id} />
        ))}
      </ul>
    )
  }

  renderProductDetails = () => {
    const {count, productDetails} = this.state

    const {
      imageUrl,
      name,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails

    return (
      <div className="product-details-container">
        <img className="product-image" src={imageUrl} alt={name} />
        <div className="product-details">
          <h1 className="product-title">{title}</h1>
          <p className="product-price">Rs {price}/-</p>
          <div className="rating-and-reviews-container">
            <div className="ratings-container">
              <p className="rating">{rating}</p>
              <img
                className="star-image"
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
              />
            </div>
            <p className="reviews">{totalReviews} Reviews</p>
          </div>
          <p className="product-description">{description}</p>
          <p className="available">
            Available: <span className="availability">{availability}</span>
          </p>
          <p className="available">
            Brand: <span className="availability">{brand}</span>
          </p>
          <hr className="break-line" />
          <div className="count-container">
            <button
              onClick={this.onClickDecrease}
              type="button"
              className="count-button"
            >
              -
            </button>
            <p className="count-number">{count}</p>
            <button
              onClick={this.onClickIncrease}
              type="button"
              className="count-button"
            >
              +
            </button>
          </div>
          <button className="add-to-cart-button" type="button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
        {this.renderSimilarProducts()}
      </>
    )
  }
}

export default ProductItemDetails
