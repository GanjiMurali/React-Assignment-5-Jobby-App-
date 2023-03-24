import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class FilterGroups extends Component {
  state = {profileDetails: '', apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      // console.log(fetchedData)
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onClickProfileRetryButton = () => this.getJobsDetails()

  renderFailureButton = () => (
    <div className="failure-button">
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickProfileRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileDetailsWithSwitch = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.renderFailureButton()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeEmploymentType = event => {
    const {filterEmploymentType} = this.props

    filterEmploymentType(event.target.value)
  }

  renderEmploymentTypeList = () => {
    const {employmentTypesList} = this.props

    return employmentTypesList.map(eachItem => {
      const {label, employmentTypeId} = eachItem

      return (
        <li className="employ-list" key={employmentTypeId}>
          <input
            onChange={this.onChangeEmploymentType}
            id={employmentTypeId}
            className="input-list"
            type="checkbox"
            value={employmentTypeId}
          />
          <label htmlFor={employmentTypeId} className="para-list-item">
            {label}
          </label>
        </li>
      )
    })
  }

  renderEmploymentType = () => (
    <>
      <h1 className="employment-type-list-heading">Type of Employment</h1>
      <ul className="employment-unOrder-list">
        {this.renderEmploymentTypeList()}
      </ul>
    </>
  )

  onChangeSalaryRange = event => {
    const {filterSalaryRange} = this.props
    filterSalaryRange(event.target.value)
  }

  renderSalaryRangesList = () => {
    const {salaryRangesList} = this.props

    return salaryRangesList.map(eachItem => {
      const {salaryRangeId, label} = eachItem

      return (
        <li className="employ-list" key={salaryRangeId}>
          <input
            className="input-list"
            name="range"
            type="radio"
            id={label}
            onChange={this.onChangeSalaryRange}
            value={salaryRangeId}
          />
          <label htmlFor={label} className="para-list-item">
            {label}
          </label>
        </li>
      )
    })
  }

  renderSalaryRanges = () => (
    <>
      <h1 className="employment-type-list-heading">Salary Range</h1>
      <ul className="employment-unOrder-list">
        {this.renderSalaryRangesList()}
      </ul>
    </>
  )

  render() {
    return (
      <div>
        {this.renderProfileDetailsWithSwitch()}
        <hr className="horizontal-line" />
        {this.renderEmploymentType()}
        <hr className="horizontal-line" />
        {this.renderSalaryRanges()}
      </div>
    )
  }
}
export default FilterGroups
