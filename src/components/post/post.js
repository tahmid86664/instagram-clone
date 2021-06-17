import React from 'react'
import ReactEmoji from 'react-emoji';

import './Post.css';

import Avatar from '@material-ui/core/Avatar';

const Post = ({ username, caption, imageUrl }) => {
  return (
    <div className='post'>
      {/* header */}
      <div className="post__header">
        <Avatar 
          className='post__avatar'
          alt='tahmid'
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
    </div>
  )
}

export default Post;
