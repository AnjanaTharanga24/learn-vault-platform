import React, { useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../common/UserContext';
import profileImg from '../../../assets/images/profile.png';
import DatePicker from 'react-datepicker'; // Make sure to install: npm install react-datepicker
import 'react-datepicker/dist/react-datepicker.css';

export default function LearningPlanModal({ show, handleClose }) {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [topics, setTopics] = useState(['']);
  const [resources, setResources] = useState(['']);
  const [status, setStatus] = useState('NOT_STARTED'); // Options: NOT_STARTED, IN_PROGRESS, COMPLETED

  const handleTopicChange = (index, value) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    setTopics([...topics, '']);
  };

  const removeTopic = (index) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  const addResource = () => {
    setResources([...resources, '']);
  };

  const removeResource = (index) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty topics and resources
    const filteredTopics = topics.filter(topic => topic.trim() !== '');
    const filteredResources = resources.filter(resource => resource.trim() !== '');
    
    const learningPlanData = {
      userId: user?.id,
      title,
      topics: filteredTopics,
      resources: filteredResources,
      startDate,
      endDate,
      status
    };
    
    try {
      // Replace with your API endpoint and implementation
      const response = await fetch('/api/learning-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(learningPlanData),
      });
      
      if (response.ok) {
        // Reset form and close modal
        resetForm();
        handleClose();
        // You might want to trigger a refresh of the learning plans list
      } else {
        const errorData = await response.json();
        console.error('Failed to create learning plan:', errorData);
        alert('Failed to create learning plan. Please try again.');
      }
    } catch (error) {
      console.error('Error creating learning plan:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setStartDate(new Date());
    setEndDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    setTopics(['']);
    setResources(['']);
    setStatus('NOT_STARTED');
  };

  const isFormValid = () => {
    return (
      title.trim() !== '' && 
      topics.some(topic => topic.trim() !== '') &&
      resources.some(resource => resource.trim() !== '') &&
      startDate && 
      endDate && 
      new Date(endDate) >= new Date(startDate)
    );
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a Learning Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center bg-light p-3 mb-3">
          <img 
            src={user?.profilePicture || profileImg} 
            alt="Profile" 
            className="rounded-circle me-3" 
            width="40" 
            height="40" 
          />
          <span className="fw-bold">{user?.username || 'User'}</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your learning plan"
              required
            />
          </div>
          
          {/* Topics Section */}
          <div className="mb-3">
            <label className="form-label">Topics to Learn</label>
            {topics.map((topic, index) => (
              <div key={`topic-${index}`} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  placeholder="e.g., JavaScript Basics, React Hooks"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeTopic(index)}
                  disabled={topics.length === 1}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={addTopic}
            >
              <i className="fas fa-plus me-1"></i> Add Topic
            </button>
          </div>
          
          {/* Resources Section */}
          <div className="mb-3">
            <label className="form-label">Learning Resources</label>
            {resources.map((resource, index) => (
              <div key={`resource-${index}`} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={resource}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  placeholder="e.g., Udemy Course URL, Book Title, YouTube Tutorial"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeResource(index)}
                  disabled={resources.length === 1}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={addResource}
            >
              <i className="fas fa-plus me-1"></i> Add Resource
            </button>
          </div>
          
          {/* Date Range */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                id="startDate"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">Target End Date</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                id="endDate"
                minDate={startDate}
              />
            </div>
          </div>
          
          {/* Status Selection */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button 
          className="btn btn-secondary me-2" 
          onClick={handleClose}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Create Learning Plan
        </button>
      </Modal.Footer>
    </Modal>
  );
}