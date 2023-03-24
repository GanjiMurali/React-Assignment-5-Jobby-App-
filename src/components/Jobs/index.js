import './index.css'

import {GoSearch} from 'react-icons/go'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {Component} from 'react'
import Header from '../Header'
import FilterGroups from '../FilterGroups'
import JobCards from '../JobCards'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobCards: '',
    employmentTypeID: [],
    salaryRangeId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobCardDetails()
  }

  getJobCardDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const {employmentTypeID, salaryRangeId, searchInput} = this.state
    const employmentTypesString = employmentTypeID.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypesString}&minimum_package=${salaryRangeId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    // console.log(response)

    if (response.ok) {
      const fetchedData = await response.json()
      // console.log(fetchedData)
      const upDatedData = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      // console.log(upDatedData)
      this.setState({
        jobCards: upDatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
    // console.log(event.target.value)
  }

  searchInputButton = () => {
    this.getJobCardDetails()
  }

  createSearchInput = () => {
    const {searchInput} = this.state

    return (
      <div className="job-search-container">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          onChange={this.changeSearchInput}
          value={searchInput}
        />
        <button
          onClick={this.searchInputButton}
          type="button"
          className="search-button"
        >
          <GoSearch className="search-icon" />
        </button>
      </div>
    )
  }

  filterEmploymentType = id => {
    const {employmentTypeID} = this.state

    if (employmentTypeID.includes(id)) {
      const filteredTypes = employmentTypeID.filter(item => item !== id)
      this.setState({employmentTypeID: filteredTypes}, this.getJobCardDetails)
    } else {
      this.setState(
        prevState => ({
          employmentTypeID: [...prevState.employmentTypeID, id],
        }),
        this.getJobCardDetails,
      )
    }
  }

  filterSalaryRange = id => {
    this.setState({salaryRangeId: id}, this.getJobCardDetails)
    // console.log(id)
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-context">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderEachJobCard = () => {
    const {jobCards} = this.state
    if (jobCards.length === 0) {
      return this.renderNoJobsView()
    }
    // console.log(jobCards)
    return (
      <ul className="job-card-details">
        {jobCards.map(eachCard => (
          <JobCards eachCardData={eachCard} key={eachCard.id} />
        ))}
      </ul>
    )
  }

  renderFailureInJobCard = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We con not seem to find the page you are looking for.
      </p>
      <button className="retry-button" type="button">
        Retry
      </button>
    </div>
  )

  renderInProgress = () => (
    <div data-testid="loader" className="jobCards-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllJobCards = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderEachJobCard()
      case apiStatusConstants.failure:
        return this.renderFailureInJobCard()
      case apiStatusConstants.inProgress:
        return this.renderInProgress()
      default:
        return null
    }
  }

  renderAllJobsDetails = () => (
    <div className="render-all-jobs">
      {this.createSearchInput()}
      {this.renderAllJobCards()}
    </div>
  )

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-container">
          <FilterGroups
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            filterEmploymentType={this.filterEmploymentType}
            filterSalaryRange={this.filterSalaryRange}
          />
          {this.renderAllJobsDetails()}
        </div>
      </div>
    )
  }
}

export default Jobs
