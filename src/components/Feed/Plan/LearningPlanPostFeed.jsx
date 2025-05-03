import React, { useState, useEffect, useContext } from 'react';
import profileImg from '../../../assets/images/profile.png';
import '../../Learning-Plan-Post/post/learningPlanPosts.css'; 
import axios from 'axios';
import { UserContext } from '../../../common/UserContext';

export default function LearningPlanPostFeed() {
  const [learningPlans, setLearningPlans] = useState([]);
const [planUser , setPlanUser] = useState({});

  useEffect(() => {
    getAllLearningPlans();
  }, []);

  const getAllLearningPlans = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/learning/plan/feed`);
      
      const transformedData = await Promise.all(
        response.data.map(async (plan) => {
          try {
            const userResponse = await axios.get(`http://localhost:8080/api/v1/user/${plan.userId}`);
            setPlanUser(userResponse.data);
            
            return {
              id: plan.id,
              userId: plan.userId,
              user: {
                id: plan.userId,
                name: `${planUser.firstName} ${planUser.lastName}`,
                profile: profileImg
              },
              title: plan.title,
              status: plan.status,
              startDate: formatDate(plan.startDate),
              endDate: formatDate(plan.endDate),
              topics: plan.topics || [],
              resources: plan.resources || [],
              timestamp: formatTimestamp(plan.createdAt),
            };
          } catch (userErr) {
            console.error('Error fetching user data:', userErr);
            return {
              id: plan.id,
              userId: plan.userId,
              user: {
                id: plan.userId,
                name: `User ${plan.userId}`,
                profile: profileImg
              },
              title: plan.title,
              status: plan.status,
              startDate: formatDate(plan.startDate),
              endDate: formatDate(plan.endDate),
              topics: plan.topics || [],
              resources: plan.resources || [],
              timestamp: formatTimestamp(plan.createdAt),
            };
          }
        })
      );
      
      setLearningPlans(transformedData);
    } catch (err) {
      console.log(err);
      setLearningPlans([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Recently';
    
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="learning-plan__container">
      {learningPlans.length > 0 ? (
        learningPlans.map(plan => (
          <div key={plan.id} className="learning-plan__card">
            <div className="learning-plan__header">
              <div className="learning-plan__user-wrapper">
                <img 
                  src={plan.user.profile} 
                  alt={planUser.name} 
                  className="learning-plan__profile-pic"
                />
                <div className="learning-plan__name-info">
                  <h6 className="learning-plan__user-name">{planUser.name}</h6>
                  <div className="learning-plan__timestamp">{plan.timestamp}</div>
                </div>
              </div>
            </div>
            
            <div className="learning-plan__body">
              <h5 className="learning-plan__title">{plan.title}</h5>
              
              <div className="learning-plan__dates">
                <div className="learning-plan__date">
                  <span className="learning-plan__date-label">Start:</span>
                  <span>{plan.startDate}</span>
                </div>
                <div className="learning-plan__date">
                  <span className="learning-plan__date-label">Target:</span>
                  <span>{plan.endDate}</span>
                </div>
              </div>
              
              <div className="learning-plan__topics">
                <h6 className="learning-plan__section-title">Topics</h6>
                <ul className="learning-plan__topic-list list-unstyled">
                  {plan.topics.map((topic, index) => (
                    <li key={index} className="learning-plan__topic-item">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="learning-plan__resources">
                <h6 className="learning-plan__section-title">Resources</h6>
                <ul className="learning-plan__resource-list list-unstyled">
                  {plan.resources.map((resource, index) => (
                    <li key={index} className="learning-plan__resource-item">
                      <a 
                        href={resource.startsWith('http') ? resource : `https://${resource}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="learning-plan__footer">
            <div className="learning-plan__action">
              <i className="fas fa-thumbs-up"></i>
              <span>Like</span>
            </div>
            <div className="learning-plan__action">
              <i className="fas fa-comment"></i>
              <span>Comment</span>
            </div>
            <div className="learning-plan__action">
              <i className="fas fa-share"></i>
              <span>Share</span>
            </div>
          </div>
        </div>
         
          
        ))
      ) : (
        <div className="learning-plan__empty-state">
          <p>No learning plans found. Create your first learning plan to get started!</p>
        </div>
      )}
    </div>
  );
}