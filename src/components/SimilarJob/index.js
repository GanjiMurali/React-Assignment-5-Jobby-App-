import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'

import './index.css'

const SimilarJob = props => {
  const {job} = props
  const {
    companyLogoUrl,
    title,
    location,
    rating,
    employmentType,
    jobDescription,
  } = job

  return (
    <li className="similar-job">
      <div className="similar-job-logo-title-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="job-company-logo"
        />
        <div className="title-rating-container">
          <h1 className="similar-job-company">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="rating-icon" />
            <p className="job-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="job-description-heading">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>
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
    </li>
  )
}

export default SimilarJob
