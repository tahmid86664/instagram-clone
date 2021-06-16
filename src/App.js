import React, { useEffect, useState } from 'react';
import './App.css';

import Post from './components/post/post';

import { db } from './firebase';

function App() {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  }, []);

  return (
    <div className="app"> 
      {/* header */}     
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" className="app__headerImage" />
      </div>
      
      {/* posts */}
      {
        posts.map(({ id, post }) => 
          <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
        )
      }

    </div>
  );
}

export default App;
