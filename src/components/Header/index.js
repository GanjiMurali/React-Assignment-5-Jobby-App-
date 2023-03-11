import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
        <ul className="unOrder-list">
          <li className="header-list-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="header-list-item">
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>
        <button onClick={onClickLogout} className="header-button" type="button">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
