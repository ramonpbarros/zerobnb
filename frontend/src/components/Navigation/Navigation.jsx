import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <ul>
        <li>
          <NavLink to="/">
            <img src="/assets/imgs/zero.png" className={'logo'} alt="logo" />
          </NavLink>
        </li>
        <div className="nav-btns-container">
          {sessionUser && (
            <div className="create-spot-link">
              <Link to="spots/new">Create a New Spot</Link>
            </div>
          )}
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </div>
      </ul>
    </>
  );
}

export default Navigation;
