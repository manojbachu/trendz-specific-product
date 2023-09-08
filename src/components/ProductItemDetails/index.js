// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    count: 1,
    productDetails: {},
    similarProductList: [],
    isLoading: false,
    errorMsg: '',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({isLoading: true})
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
    if (response.ok) {
      const productDetails = this.convertSnakeToCamelCase(data)
      const productList = {similarProducts: data.similar_products}

      this.setState({
        isLoading: false,
        productDetails,
        similarProductList: productList.similarProducts.map(eacdData => {
          const convertedData = this.convertSnakeToCamelCase(eacdData)
          return convertedData
        }),
      })
    } else {
      const error = {errorMsg: data.error_msg}
      this.setState({errorMsg: error.errorMsg, isLoading: false})
    }
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

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

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
        <img className="product-image" src={imageUrl} alt="product" />
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
            Available: <p className="availability">{availability}</p>
          </p>
          <p className="available">
            Brand: <p className="availability">{brand}</p>
          </p>
          <hr className="break-line" />
          <div className="count-container">
            <button
              data-testid="minus"
              onClick={this.onClickDecrease}
              type="button"
              className="count-button"
            >
              <BsDashSquare />
            </button>
            <p className="count-number">{count}</p>
            <button
              data-testid="plus"
              onClick={this.onClickIncrease}
              type="button"
              className="count-button"
            >
              <BsPlusSquare />
            </button>
          </div>
          <button className="add-to-cart-button" type="button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderLoading = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => {
    const {errorMsg} = this.state
    return (
      <div className="product-items-failure">
        <img
          className="error-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1 className="error-msg">{errorMsg}</h1>
        <button
          onClick={this.onClickContinueShopping}
          className="continue-button"
          type="button"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {errorMsg} = this.state
    return (
      <>
        {errorMsg === '' ? (
          <>
            {this.renderProductDetails()} {this.renderSimilarProducts()}
          </>
        ) : (
          this.renderFailureView()
        )}
      </>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />

        {isLoading ? this.renderLoading() : this.renderProductItemDetails()}
      </>
    )
  }
}

export default ProductItemDetails
