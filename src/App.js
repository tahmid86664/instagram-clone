import React, { useEffect, useState } from 'react';

import './App.css';

import { db, auth } from './firebase';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

import Post from './components/post/Post';
import PostUpload from './components/post-upload/PostUpload';

// import InstagramEmbed from 'react-instagram-embed'

// material ui hooks
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      // a useEffect fires again then performs cleanup function
      unsubscribe();
    }

    // say we login and update the displayName
    // it's gonna refire the front end code
    // before it does that detach the the listener that just setted up using return
    // so that  we don't have duplicates and then refire it.
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });
  }, []);

  const handleSignUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      if (authUser.user.displayName) {
        // then don't update username
      } else {
        // if just created someone (user)
        return authUser.user.updateProfile({
          displayName: username
        })
      }
    })
    .catch((err) => alert(err.message));

    setOpen(false);
  }

  const handleSignIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((err) => alert(err.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app"> 
      {/* material ui modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUpForm'>
            <center>
              <div className="app__header">
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" className="app__headerImage" />
              </div>
            </center>

            <Input 
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleSignUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* sign in modal -- material ui modal */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUpForm'>
            <center>
              <div className="app__header">
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" className="app__headerImage" />
              </div>
            </center>
            <Input 
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleSignIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      {/* header */}     
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" className="app__headerImage" /> 

        {user ? (
          <Button onClick={() => auth.signOut()}>Sign Out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      
      {/* posts */}
      <div className='app__posts'>
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => 
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            )
          }
        </div>

        <div className="app__postsRight">
          {/* <InstagramEmbed
            url='https://www.instagram.com/p/CQQEWVnF33P/'
            clientAccessToken='1809160072780839|IGQVJYdGlzeXRDc2d3STlrYy15NGY5Q2hSTWVpa25FOEZAkTkdlWVZAkb2w5QVRrbHNScm1QeVJ3ajhjQ0M4V2RRWW14V3lYNk0zOTBHZAl9OMkgwclZAGUFkwODJSekFuNWtPa2lleGl3S25fNG5BQXk0bQZDZD'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          /> */}
        </div>
      </div>

            
      {/* upload post */}
      <div className="app__uploadPost">
        {user?.displayName ? ( // here ? before . is work for optional statement. or works as a try catch block.
          <PostUpload username={user.displayName} />
        ) : (
          <h2 className="app__uploadPostDeactivated">Sorry! You need to login first to upload</h2>
        )}
      </div>

    </div>
  );
}

export default App;
