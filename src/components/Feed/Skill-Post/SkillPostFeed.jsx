import React, { useState, useEffect, useContext } from 'react';
import profileImg from '../../../assets/images/profile.png';
import '../../Skill-Sharing-Post/post/posts.css';
import editIcon from '../../../assets/images/edit.png';
import deleteIcon from '../../../assets/images/delete.png';
import axios from 'axios';
import { UserContext } from '../../../common/UserContext';
import Modal from 'react-bootstrap/Modal';
import './skillPostFeed.css';
import Button from 'react-bootstrap/Button';

export default function SkillPostFeed({ editable = false }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentPostMedia, setCurrentPostMedia] = useState([]);
  const [commentInputs, setCommentInputs] = useState('');
  const [editComment, setEditComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api/v1/';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL + 'feed');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const handleMediaClick = (post, index) => {
    const mediaItems = [
      ...(post.videoUrl ? [post.videoUrl] : []),
      ...(post.imageUrls || [])
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

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${postId}`, {
          data: { userId: 'current-user-id' }
        });
        setPosts(prev => prev.filter(post => post.postId !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  const handleUpdate = (postId) => {
    alert(`Update post ${postId} (connect to modal/form if needed)`);
  };

  const handleAddComment = async (postId) => {
    const id = user?.id;
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/comment?postId=${postId}`, {
        userId: id,
        comment: commentInputs
      });
      console.log(response, "comment added");
    } catch (e) {
      console.log(e, "comment add error")
    }
  };

  const handleDeleteComment = async(postId, commentId) => {
    const id = user?.id;
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/comment?postId=${postId}&userId=${id}&commentId=${commentId}`);
      console.log(response, "comment deleted");
    } catch (e) {
      console.log(e, "comment delete error")
    }
  };

  const handleEditComment = (postId, commentId, existingComment) => {
    setEditComment(existingComment);
    setEditCommentId(commentId);
    setEditPostId(postId);
    setShowEditModal(true);
  };

  const handleSaveEditedComment = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v1/comment`, {
        postId: editPostId,
        commentId: editCommentId,
        userId: user?.id,
        updatedComment: editComment
      });
      setShowEditModal(false);
      setEditComment('');
    } catch (e) {
      console.log(e, "edit comment error");
    }
  };

  const renderPostMedia = (post) => {
    const mediaItems = [
      ...(post.videoUrl ? [post.videoUrl] : []),
      ...(post.imageUrls || []).slice(0, 3)
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
        {mediaItems.length > 1 && (
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
        )}
      </div>
    );
  };

  if (loading) return <div className="posts__loading">Loading posts...</div>;
  if (error) return <div className="posts__error">Error: {error}</div>;
  if (posts.length === 0) return <div className="posts__empty">No posts to display</div>;

  return (
    <div className="posts__container">
      {posts?.map(post => (
        <div key={post.postId} className="posts__card">
          {editable && (
            <div className="posts__edit-buttons">
              <button onClick={() => handleUpdate(post.postId)} className="posts__icon-btn">
                <img src={editIcon} alt="Edit" className="posts__icon-image" />
              </button>
              <button onClick={() => handleDelete(post.postId)} className="posts__icon-btn delete">
                <img src={deleteIcon} alt="Delete" className="posts__icon-image" />
              </button>
            </div>
          )}

          <div className="posts__header">
            <img 
              src={post.user?.profilePicture || profileImg} 
              alt={post.username} 
              className="posts__profile-pic" 
            />
            <div className="posts__user-info">
              <h6 className="posts__user-name">{post.username}</h6>
              <small className="posts__meta">{post.postDate}</small>
            </div>
          </div>

          <div className="posts__body">
            <p className="posts__description">{post.description}</p>
            {renderPostMedia(post)}
          </div>

          <div className="posts__comments">
            {post.comments?.length > 0 ? (
              post.comments.map((c, i) => (
                <div key={i} className="posts__comment">
                  <strong>{c?.user.name}:</strong> {c?.comment}
                  {c?.user.id === user.id && (
                    <span className="posts__comment-actions">
                      <button className="posts__comment-edit" onClick={() => handleEditComment(post.postId, c.commentId, c.comment)}>Edit</button>
                      <button className="posts__comment-delete" onClick={() => handleDeleteComment(post.postId, c.commentId)}>Delete</button>
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="posts__comment posts__comment--empty">No comments yet.</div>
            )}
            <div className="posts__comment-input-group">
              <input
                type="text"
                placeholder="Write a comment..."
                className="posts__comment-input"
                onChange={(e) => setCommentInputs(e.target.value)}
              />
              <button
                onClick={() => handleAddComment(post.postId)}
                className="posts__comment-submit"
              >
                Post
              </button>
            </div>
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

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="4"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEditedComment}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
