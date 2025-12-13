import './Comment.css'
import React from 'react'

function timeSince(dateString) {
  if (!dateString) return ''
  const now = new Date();
  const created = new Date(dateString);
  const seconds = Math.floor((now - created) / 1000);

  const intervals = [
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) {
      return `${interval} ${intervals[i].label}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'few seconds ago';
}

function Comment({ comment }) {
  const user = typeof comment.user === 'object' ? comment.user : null;
  const avatar = `/pfps/${user?.avatar || 'gray.png'}`;
  const username = user?.username || 'Anonymous';

  return (
    <div className="comment">
      <div className="comment-top">
        <img className="comment-avatar" src={avatar} alt={`${username} avatar`} />
        <div className="comment-meta">
          <span className="comment-username">u/{username}</span>
          <span className="comment-time">{timeSince(comment.createdAt)}</span>
        </div>
      </div>

      <div className="comment-body">
        {comment.text}
      </div>
    </div>
  )
}

export default Comment
