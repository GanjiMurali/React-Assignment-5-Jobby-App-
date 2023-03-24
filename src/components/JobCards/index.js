import './index.css'

import {Link} from 'react-router-dom'

import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

const JobCards = props => {
  const {eachCardData} = props
  // console.log(eachCardData)
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachCardData

  return (
    <li className="list-item">
      <Link to={`/jobs/${id}`} className="nav-link">
        <div className="image-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="rating-con">
            <h1 className="card-title">{title}</h1>
            <div className="star-con">
              <AiFillStar className="star-icon" />
              <p className="star-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-salary-details">
          <div className="job-detail-con">
            <div className="location-icon-con">
              <MdLocationOn className="location-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="briefcase-con">
              <BsBriefcaseFill className="briefcase-icon" />
              <p className="briefcase">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCards
