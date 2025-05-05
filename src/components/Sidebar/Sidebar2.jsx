import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import './sidebar.css'
import profileImg from '../../assets/images/profile.png'
import { UserContext } from '../../common/UserContext';

export default function Sidebar2() {

  const {user} = useContext(UserContext);
   
    
      const popularSkills = [
        { id: 1, name: 'Web Development', icon: 'fa-code' },
        { id: 2, name: 'Photography', icon: 'fa-camera' },
        { id: 3, name: 'Cooking', icon: 'fa-utensils' },
        { id: 4, name: 'Graphic Design', icon: 'fa-palette' },
        { id: 5, name: 'Digital Marketing', icon: 'fa-chart-line' }
      ];
    
      const userSkills = [
        { id: 1, name: 'JavaScript', progress: 80 },
        { id: 2, name: 'React.js', progress: 65 },
        { id: 3, name: 'Photography', progress: 45 },
      ];
    
      return (
        <div className="right-sidebar bg-white shadow-sm">
          <div className="user-profile p-3 border-bottom">
            <div className="d-flex align-items-center mb-3">
              <img 
                src={user?.imgUrl } 
                alt="Profile" 
                className="rounded-circle me-3"
                width={50}
              />
              <div>
                <h6 className="mb-0">{user?.name}</h6>
                <small className="text-muted">{user?.username}</small>
              </div>
            </div>
            
            <div className="d-flex justify-content-around text-center">
              <div>
                <div className="fw-bold">0</div>
                <small className="text-muted">Posts</small>
              </div>
              <div>
                <div className="fw-bold">0</div>
                <small className="text-muted">Followers</small>
              </div>
              <div>
                <div className="fw-bold"> 0</div>
                <small className="text-muted">Following</small>
              </div>
            </div>
          </div>
          
          <div className="p-3 border-bottom">
            <h6 className="mb-3">My Learning Progress</h6>
            {userSkills.map(skill => (
              <div key={skill.id} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>{skill?.name}</small>
                  <small>{skill?.progress}%</small>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${skill?.progress}%` }}
                    aria-valuenow={skill?.progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100">
                  </div>
                </div>
              </div>
            ))}
            <Link to="/learning-progress" className="btn btn-outline-primary btn-sm w-100 mt-2">
              View All Progress
            </Link>
          </div>
          
          <div className="p-3 border-bottom">
            <h6 className="mb-3">Popular Skills</h6>
            <ul className="list-group list-group-flush">
              {popularSkills.map(skill => (
                <li key={skill?.id} className="list-group-item px-0 py-2 border-0">
                  <Link to={`/skills/${skill?.id}`} className="text-decoration-none text-dark">
                    <i className={`fas ${skill?.icon} me-2 text-primary`}></i>
                    {skill?.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/explore-skills" className="btn btn-outline-primary btn-sm w-100 mt-2">
              Explore More Skills
            </Link>
          </div>
        </div>
      )
    }