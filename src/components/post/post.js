import React, { useEffect, useState } from 'react'
import ReactEmoji from 'react-emoji';
import firebase from 'firebase';

import './Post.css';

import Avatar from '@material-ui/core/Avatar';
import { db } from '../../firebase';

const Post = ({ user, username, caption, imageUrl, postId }) => {
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db.collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    }
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  // console.log(comments);
  return (
    <div className='post'>
      {/* header */}
      <div className="post__header">
        <Avatar 
          className='post__avatar'
          alt={username}
          src='/'
        />
        <h3>{username}</h3>
      </div>

      {/* image */}
      <img src={imageUrl}
      alt="post" 
      className='post__image' />

      {/* username and caption */}
      <h4 className='post__text'><strong>{username}</strong> {ReactEmoji.emojify(caption)}</h4>

      {/* comments */}
      { comments.length !== 0 ?
        (
          <div className="post__comments">
            {
              comments.map((comment) =>
                <p>
                  <strong>{comment.username}</strong> {ReactEmoji.emojify(comment.text)}
                </p>
              )
            }
          </div>
        ) : (
          <div className="post__noComments">No comment yet</div>
        )
      }

      {/* comments form */}
      { user && (
        <form className="post__commentBox">
          <input 
            className="post__commentInput"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button 
            className="post__commentButton"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Add
          </button>
        </form>
      )}
      
    </div>
  )
}

export default Post;
