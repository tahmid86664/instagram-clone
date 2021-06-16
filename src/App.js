import React, { useState } from 'react';
import './App.css';

import Post from './components/post/post';

function App() {
  const [posts, setPosts] = useState([
    {
      username: "tahmid00",
      caption: "Hey, I'm doing instagram clone",
      imageUrl: "https://csharpcorner-mindcrackerinc.netdna-ssl.com/article/what-is-mern-stack/Images/The%20MERN%20Stack.jpg"
    },
    {
      username: "tonni00",
      caption: "Hey, I've successfully done my first PROF.",
      imageUrl: "https://media-eng.dhakatribune.com/uploads/2020/07/pukllll-1594468484100.jpg"
    }
  ])

  return (
    <div className="app"> 
      {/* header */}     
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" className="app__headerImage" />
      </div>
      
      {/* posts */}
      {
        posts.map(post => <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />)
      }

    </div>
  );
}

export default App;
