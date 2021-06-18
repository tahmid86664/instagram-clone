import React, { useState } from 'react'

import './PostUpload.css';

import firebase from 'firebase';
import { storage, db } from '../../firebase';

import { Button } from '@material-ui/core';

const PostUpload = ({ username }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if(e.target.files[0]){
      setImage(e.target.files[0]);
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress bar function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      }, 
      (err) => {
        console.log(err);
        alert(err.message);
      },
      () => {
        // final function to store data
        // upload image on firebase storage first and then get the URL and then store post data to firebase database
        storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then((url) => {
          db.collection("posts").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            caption: caption,
            imageUrl: url,
            username: username
          });

          setProgress(0);
          setCaption('');
          setImage(null);
        });
      }
    );
  }

  return (
    <div className='postUpload'>
      <progress className='postUpload__progress' value={progress} max="100" />
      <input type='text' placeholder='Enter a caption...' value={caption} onChange={(e) => setCaption(e.target.value)} />
      <input type='file' onChange={handleChange} />

      <Button onClick={handleUpload}>Upload</Button>
    </div>
  )
}


export default PostUpload;