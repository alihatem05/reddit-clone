import { useState, useCallback } from 'react';
import { useAuthContext } from './useAuthContext';

export const useVote = (item, setItem, type = 'post') => {
  const { user: currentUser } = useAuthContext();
  const [isVoting, setIsVoting] = useState(false);

  const userInArray = useCallback((arr) => {
    if (!currentUser || !arr) return false;
    return arr.some(u => String(typeof u === 'object' ? u._id : u) === String(currentUser._id));
  }, [currentUser]);

  const calculateDelta = useCallback((requestedDelta, hasUp, hasDown) => {
    if (requestedDelta === 1 && hasUp) return 0;
    if (requestedDelta === -1 && hasDown) return 0;
    return requestedDelta;
  }, []);

  const optimisticUpdate = useCallback((requestedDelta) => {
    if (!item) return;

    const hasUp = userInArray(item.upvoters);
    const hasDown = userInArray(item.downvoters);
    const outDelta = calculateDelta(requestedDelta, hasUp, hasDown);

    setItem(prev => {
      const updated = { ...prev };
      const voteField = type === 'comment' ? 'karma' : 'votes';
      
      if (outDelta === 0) {
        if (hasUp) {
          updated[voteField] = updated[voteField] - 1;
          updated.upvoters = updated.upvoters.filter(
            u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id)
          );
        } else if (hasDown) {
          updated[voteField] = updated[voteField] + 1;
          updated.downvoters = updated.downvoters.filter(
            u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id)
          );
        }
      } else if (outDelta === 1) {
        if (hasDown) {
          updated[voteField] = updated[voteField] + 2;
          updated.downvoters = updated.downvoters.filter(
            u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id)
          );
        } else {
          updated[voteField] = updated[voteField] + 1;
        }
        updated.upvoters = [...(updated.upvoters || []), currentUser._id];
      } else if (outDelta === -1) {
        if (hasUp) {
          updated[voteField] = updated[voteField] - 2;
          updated.upvoters = updated.upvoters.filter(
            u => String(typeof u === 'object' ? u._id : u) !== String(currentUser._id)
          );
        } else {
          updated[voteField] = updated[voteField] - 1;
        }
        updated.downvoters = [...(updated.downvoters || []), currentUser._id];
      }
      
      return updated;
    });

    return outDelta;
  }, [item, currentUser, userInArray, calculateDelta, setItem, type]);

  const handleVote = useCallback(async (requestedDelta, event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!currentUser || !item || isVoting) return;

    const hasUp = userInArray(item.upvoters);
    const hasDown = userInArray(item.downvoters);
    const outDelta = calculateDelta(requestedDelta, hasUp, hasDown);

    optimisticUpdate(requestedDelta);
    setIsVoting(true);

    try {
      const endpoint = type === 'comment' 
        ? `/api/comments/${item._id}/vote`
        : `/api/posts/${item._id}/vote`;

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: outDelta, userId: currentUser._id }),
      });

      if (!res.ok) {
        throw new Error('Vote failed');
      }

      const updated = await res.json();
      setItem(updated);

      const eventName = type === 'comment' ? 'commentVoted' : 'postVoted';
      window.dispatchEvent(new CustomEvent(eventName));

    } catch (err) {
      console.error(`Error voting on ${type}:`, err);
      optimisticUpdate(requestedDelta === 1 ? -1 : requestedDelta === -1 ? 1 : 0);
    } finally {
      setIsVoting(false);
    }
  }, [currentUser, item, isVoting, userInArray, calculateDelta, optimisticUpdate, setItem, type]);

  return {
    handleVote,
    userInArray,
    isVoting,
    hasUpvoted: item ? userInArray(item.upvoters) : false,
    hasDownvoted: item ? userInArray(item.downvoters) : false,
  };
};
