import React, { useState, useEffect } from 'react';
import profileImg from '../../../assets/images/profile.png';
import './posts.css';
import editIcon from '../../../assets/images/edit.png';
import deleteIcon from '../../../assets/images/delete.png';

const mockPosts = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      profile: profileImg
    },
    skill: 'Web Development',
    description: 'Check out my project demo video and screenshots from my React learning journey!',
    images: [
      'https://t4.ftcdn.net/jpg/02/92/83/57/360_F_292835773_oImixQGFKLpOPnjfsbesHyqdjOk5hsxL.jpg',
      'https://t3.ftcdn.net/jpg/04/51/12/88/360_F_451128839_vmKOyil368UoXcac46W7aaqelTtLuNFk.jpg',
      'https://inside.java/images/java-logo-vert-blk.png'
    ],
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 42,
    comments: 7,
    timestamp: '2 hours ago'
  },
  {
    id: 1,
    user: {
      name: 'John Doe',
      profile: profileImg
    },
    skill: 'Web Development',
    description: 'Check out my project demo video and screenshots from my React learning journey!',
    images: [
      'https://t4.ftcdn.net/jpg/02/92/83/57/360_F_292835773_oImixQGFKLpOPnjfsbesHyqdjOk5hsxL.jpg',
      'https://t3.ftcdn.net/jpg/04/51/12/88/360_F_451128839_vmKOyil368UoXcac46W7aaqelTtLuNFk.jpg',
      'https://inside.java/images/java-logo-vert-blk.png'
    ],
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 42,
    comments: 7,
    timestamp: '2 hours ago'
  },

  {
    id: 1,
    user: {
      name: 'John Doe',
      profile: profileImg
    },
    skill: 'Web Development',
    description: 'Check out my project demo video and screenshots from my React learning journey!',
    images: [
      'https://t4.ftcdn.net/jpg/02/92/83/57/360_F_292835773_oImixQGFKLpOPnjfsbesHyqdjOk5hsxL.jpg',
      'https://t3.ftcdn.net/jpg/04/51/12/88/360_F_451128839_vmKOyil368UoXcac46W7aaqelTtLuNFk.jpg',
      'https://inside.java/images/java-logo-vert-blk.png'
    ],
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    likes: 42,
    comments: 7,
    timestamp: '2 hours ago'
  }
];

export default function Posts({ editable = false }) {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentPostMedia, setCurrentPostMedia] = useState([]);

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const handleMediaClick = (post, index) => {
    const mediaItems = [
      ...(post.video ? [post.video] : []),
      ...(post.images || [])
    ];
    setCurrentPostMedia(mediaItems);
    setCurrentMediaIndex(index);
    setShowModal(true);
  };

  const handlePrev = () => {
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : currentPostMedia.length - 1));
  };

  const handleNext = () => {
    setCurrentMediaIndex(prev => (prev < currentPostMedia.length - 1 ? prev + 1 : 0));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleUpdate = (id) => {
    alert(`Update post ${id} (connect to modal/form if needed)`);
  };

  const renderPostMedia = (post) => {
    const mediaItems = [
      ...(post.video ? [post.video] : []),
      ...(post.images || []).slice(0, 3)
    ];

    if (mediaItems.length === 0) return null;

    return (
      <div className="posts__media-grid">
        <div className="posts__main-media-item" onClick={() => handleMediaClick(post, 0)}>
          {isVideo(mediaItems[0]) ? (
            <div className="posts__video-container">
              <video className="posts__media-element" playsInline muted preload="metadata">
                <source src={mediaItems[0]} type="video/mp4" />
              </video>
              <div className="posts__play-icon">▶</div>
            </div>
          ) : (
            <img src={mediaItems[0]} alt="Main media" className="posts__media-element" />
          )}
        </div>
        <div className="posts__secondary-media-container">
          {mediaItems.slice(1, 4).map((media, index) => (
            <div
              key={index}
              className="posts__secondary-media-item"
              onClick={() => handleMediaClick(post, index + 1)}
            >
              {isVideo(media) ? (
                <div className="posts__video-container">
                  <video className="posts__media-element" playsInline muted preload="metadata">
                    <source src={media} type="video/mp4" />
                  </video>
                  <div className="posts__play-icon">▶</div>
                </div>
              ) : (
                <img src={media} alt={`Screenshot ${index + 1}`} className="posts__media-element" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="posts__container">
      {posts.map(post => (
        <div key={post.id} className="posts__card">
          {editable && (
            <div className="posts__edit-buttons">
              <button onClick={() => handleUpdate(post.id)} className="posts__icon-btn">
                <img src={editIcon} alt="Edit" className="posts__icon-image" />
              </button>
              <button onClick={() => handleDelete(post.id)} className="posts__icon-btn delete">
                <img src={deleteIcon} alt="Delete" className="posts__icon-image" />
              </button>
            </div>
          )}

          <div className="posts__header">
            <img src={post.user.profile} alt={post.user.name} className="posts__profile-pic" />
            <div className="posts__user-info">
              <h6 className="posts__user-name">{post.user.name}</h6>
              <small className="posts__meta">{post.skill} • {post.timestamp}</small>
            </div>
          </div>

          <div className="posts__body">
            <p className="posts__description">{post.description}</p>
            {renderPostMedia(post)}
          </div>

          <div className="posts__actions">
            <button className="posts__action-btn">
              👍 Like ({post.likes})
            </button>
            <button className="posts__action-btn">
              💬 Comment ({post.comments})
            </button>
            <button className="posts__action-btn">
              ↗ Share
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="posts__modal">
          <div className="posts__modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="posts__modal-content">
            <button
              className="posts__modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="posts__modal-media-container">
              {isVideo(currentPostMedia[currentMediaIndex]) ? (
                <video
                  controls
                  autoPlay
                  className="posts__modal-media"
                  playsInline
                  key={currentPostMedia[currentMediaIndex]}
                >
                  <source src={currentPostMedia[currentMediaIndex]} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={currentPostMedia[currentMediaIndex]}
                  alt="Media preview"
                  className="posts__modal-media"
                />
              )}
            </div>

            {currentPostMedia.length > 1 && (
              <div className="posts__modal-navigation">
                <button className="posts__nav-button posts__nav-button--prev" onClick={handlePrev}>
                  &lt;
                </button>
                <div className="posts__media-counter">
                  {currentMediaIndex + 1} / {currentPostMedia.length}
                </div>
                <button className="posts__nav-button posts__nav-button--next" onClick={handleNext}>
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
