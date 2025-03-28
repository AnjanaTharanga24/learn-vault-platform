import React, { useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../common/UserContext';
import profileImg from '../../../assets/images/profile.png';

export default function SkillSharingPostModal({ show, handleClose }) {
  const { user } = React.useContext(UserContext);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.slice(0, 3 - images.length);
    
    const newImages = validImages.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    
    // Create video element to check duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (video.duration <= 30) {
        setVideo({
          file,
          preview: URL.createObjectURL(file)
        });
      } else {
        alert('Video must be less than 30 seconds');
      }
    };
    video.src = URL.createObjectURL(file);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement post submission logic here
    console.log('Post submitted', { images, video, description });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a Skill Sharing Post</Modal.Title>
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
        
        <textarea 
          className="form-control mb-3" 
          rows="4" 
          placeholder={`What skill are you sharing today, ${user?.username || 'User'}?`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        
        <div className="upload-preview d-flex flex-wrap mb-3">
          {images.map((image, index) => (
            <div key={index} className="image-preview position-relative me-2 mb-2">
              <img 
                src={image.preview} 
                alt={`Preview ${index + 1}`} 
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <button 
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => removeImage(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          
          {video && (
            <div className="video-preview position-relative me-2 mb-2">
              <video 
                src={video.preview} 
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                controls
              />
              <button 
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={removeVideo}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {(images.length < 3 || !video) && (
            <div className="upload-buttons d-flex">
              {images.length < 3 && (
                <>
                  <input 
                    type="file" 
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="d-none"
                  />
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => imageInputRef.current.click()}
                  >
                    <i className="fas fa-image me-2"></i>
                    Add Photo
                  </button>
                </>
              )}
              
              {!video && (
                <>
                  <input 
                    type="file" 
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    className="d-none"
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => videoInputRef.current.click()}
                  >
                    <i className="fas fa-video me-2"></i>
                    Add Video
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button 
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={!description || (images.length === 0 && !video)}
        >
          Post
        </button>
      </Modal.Footer>
    </Modal>
  );
}