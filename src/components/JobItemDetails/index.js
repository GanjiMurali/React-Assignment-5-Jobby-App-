import './index.css'

import {Component} from 'react'
import Cookie from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJob from '../SimilarJob'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    jobData: '',
    responseStatus: apiStatus.initial,
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    this.setState({responseStatus: apiStatus.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookie.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()

    if (response.ok === true) {
      const job = data.job_details
      const eachJob = {
        companyWebsiteUrl: job.company_website_url,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        lifeAtCompanyDescription: job.life_at_company.description,
        lifeAtCompanyImageUrl: job.life_at_company.image_url,
        skills: job.skills.map(skill => ({
          skillName: skill.name,
          skillImage: skill.image_url,
        })),
      }

      const similarJobs = data.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        title: item.title,
        rating: item.rating,
        location: item.location,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
      }))

      this.setState({
        jobData: eachJob,
        responseStatus: apiStatus.success,
        similarJobsList: similarJobs,
      })
    } else {
      this.setState({responseStatus: apiStatus.failure})
    }
  }

  onRetryJobItemDetails = () => this.getJobDetailsData()

  renderFailureView = () => (
    <div className="failure-container bga-color">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onRetryJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {jobData, similarJobsList} = this.state
    const {
      skills,
      lifeAtCompanyDescription,
      lifeAtCompanyImageUrl,
      companyLogoUrl,
      title,
      location,
      rating,
      companyWebsiteUrl,
      employmentType,
      packagePerAnnum,
      jobDescription,
    } = jobData

    return (
      <div className="job-details-container">
        <div className="job-details">
          <div className="logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-company-logo"
            />
            <div className="title-rating-container">
              <h1 className="job-company">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="rating-icon" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-salary-container">
            <div className="location-work">
              <div className="location-container">
                <MdLocationOn className="job-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="employment-container">
                <MdWork className="job-icon" />
                <p className="job-employment">{employmentType}</p>
              </div>
            </div>
            <p className="job-salary">{packagePerAnnum}</p>
          </div>

          <div className="description-link">
            <h1 className="job-item-description-heading">Description</h1>
            <a href={companyWebsiteUrl} className="link-element">
              <p className="visit">Visit</p>
              <FiExternalLink className="visit-icon" />
            </a>
          </div>

          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>

          <ul className="skills-container">
            {skills.map(eachSkill => (
              <li className="each-skill" key={eachSkill.skillName}>
                <img
                  src={eachSkill.skillImage}
                  alt={eachSkill.skillName}
                  className="skill-image"
                />
                <p className="skill-name">{eachSkill.skillName}</p>
              </li>
            ))}
          </ul>

          <div className="life-at-company-container">
            <div className="life-at-company-details">
              <h1 className="life-at-company-heading">Life At Company</h1>
              <p className="job-description">{lifeAtCompanyDescription}</p>
            </div>
            <img
              src={lifeAtCompanyImageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>

        <h1 className="job-item-description-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsList.map(eachJob => (
            <SimilarJob job={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderData = () => {
    const {responseStatus} = this.state
    switch (responseStatus) {
      case apiStatus.success:
        return this.renderJobDetails()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderData()}
      </>
    )
  }
}

export default JobItemDetails
