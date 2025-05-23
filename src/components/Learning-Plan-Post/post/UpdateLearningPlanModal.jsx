import React, { useState, useContext, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../common/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UpdateLearningPlanModal({ show, handleClose, plan, onSuccess }) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    topics: [''],
    resources: [''],
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when plan prop changes
  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || '',
        topics: plan.topics && plan.topics.length > 0 ? [...plan.topics] : [''],
        resources: plan.resources && plan.resources.length > 0 ? [...plan.resources] : [''],
        startDate: plan.rawStartDate ? new Date(plan.rawStartDate) : new Date(),
        endDate: plan.rawEndDate ? new Date(plan.rawEndDate) : new Date(),
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleTopicChange = (index, value) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData(prev => ({
      ...prev,
      topics: newTopics
    }));
  };

  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, '']
    }));
  };

  const removeTopic = (index) => {
    const newTopics = [...formData.topics];
    newTopics.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      topics: newTopics
    }));
  };

  const handleResourceChange = (index, value) => {
    const newResources = [...formData.resources];
    newResources[index] = value;
    setFormData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const removeResource = (index) => {
    const newResources = [...formData.resources];
    newResources.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Filter out empty topics and resources
    const filteredTopics = formData.topics.filter(topic => topic.trim() !== '');
    const filteredResources = formData.resources.filter(resource => resource.trim() !== '');

    if (!formData.title || filteredTopics.length === 0 || filteredResources.length === 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const updateRequest = {
        title: formData.title,
        topics: filteredTopics,
        resources: filteredResources,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0],
      };

      const response = await axios.put(`http://localhost:8080/api/v1/learning/plans/${plan.id}`, updateRequest);
      console.log('Updated Learning Plan:', response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Learning Plan Updated Successfully!",
        customClass: {
          popup: "fb-swal-popup",
        },
        showConfirmButton: false,
        timer: 2000,
      });
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update learning plan. Please try again.');
      console.error('Error updating learning plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.topics.some(topic => topic.trim() !== '') &&
      formData.resources.some(resource => resource.trim() !== '') &&
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) >= new Date(formData.startDate)
    );
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Learning Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title for your learning plan"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Topics to Learn</label>
            {formData.topics.map((topic, index) => (
              <div key={`topic-${index}`} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  placeholder="e.g., JavaScript Basics, React Hooks"
                  required={index === 0}
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeTopic(index)}
                  disabled={formData.topics.length === 1}
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
          
          <div className="mb-3">
            <label className="form-label">Learning Resources</label>
            {formData.resources.map((resource, index) => (
              <div key={`resource-${index}`} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={resource}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  placeholder="e.g., Udemy Course URL, Book Title, YouTube Tutorial"
                  required={index === 0}
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeResource(index)}
                  disabled={formData.resources.length === 1}
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
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <DatePicker
                selected={formData.startDate}
                onChange={date => handleDateChange('startDate', date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                id="startDate"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">Target End Date</label>
              <DatePicker
                selected={formData.endDate}
                onChange={date => handleDateChange('endDate', date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                id="endDate"
                minDate={formData.startDate}
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button 
          className="btn btn-secondary me-2" 
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !isFormValid()}
        >
          {loading ? 'Updating...' : 'Update Plan'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}