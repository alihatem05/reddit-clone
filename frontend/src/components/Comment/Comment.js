import './Comment.css'
import React, { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

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

function Comment({ comment, onReply, onVote, onDelete, depth = 0 }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { user: currentUser } = useAuthContext();
  const hasUp = (comment.upvoters || []).some(u => String(typeof u === 'object' ? u._id : u) === String(currentUser?._id));
  const hasDown = (comment.downvoters || []).some(u => String(typeof u === 'object' ? u._id : u) === String(currentUser?._id));
  const user = typeof comment.user === 'object' ? comment.user : null;
  const username = user?.username || 'Anonymous';
  const avatar = `/pfps/${user?.avatar || 'gray.png'}`;

  const handleReply = async (e) => {
        if (!replyText.trim()) return;
        if (onReply) {
            await onReply({ text: replyText, parentId: comment._id });
        setReplyText('');
        setIsReplying(false);
    }
  }

  return (
    <div className="commentMainbta3">
      <div className="commentLeft">
        <img className="comment-avatar" src={avatar} />
      </div>
      <div className="commentright">
        <div className="comment-header">
          <span className="cUsername">u/{username}</span>
          <span className="ctime">{timeSince(comment.createdAt)}</span>
        </div>

        <div className="comment-body">
          {comment.text}
        </div>

          <div className="commentTa7t">
          <div className="comment-votes">
            <button className={`vote-btn ${hasUp ? 'upactive' : ''}`} onClick={() => { if (!currentUser) return; onVote && onVote(comment._id, hasUp ? 0 : 1); }} style={{ color: hasUp ? '#f97316' : undefined }}>
              <i className="bi bi-arrow-up" />
            </button>
            <div className="karma">{comment.karma || 0}</div>
            <button className={`vote-btn ${hasDown ? 'downactive' : ''}`} onClick={() => { if (!currentUser) return; onVote && onVote(comment._id, hasDown ? 0 : -1); }} style={{ color: hasDown ? '#0ea5e9' : undefined }}>
              <i className="bi bi-arrow-down" />
            </button>
          </div>
          <button id="replyMain" onClick={() => setIsReplying(v => !v)}>Reply</button>
          {currentUser?._id === user?._id && (
              <i id="trashcan2" className="bi bi-trash3" onClick={() => onDelete && onDelete(comment._id)} ></i>
            )}
        </div>

        {isReplying && (
          <div className="reply-input">
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} placeholder="Write a reply..." />
            <div id="replyBtns">
              <button id='cancelReply' onClick={() => { setIsReplying(false); setReplyText(''); }}>Cancel</button>
              <button id="e3mlReply" onClick={() => handleReply()}>Reply</button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {comment.replies.map((r) => (
              (typeof r === 'object') ? (
                <Comment key={r._id || r} comment={r} onReply={onReply} onVote={onVote} onDelete={onDelete} depth={depth + 1} />
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Comment
