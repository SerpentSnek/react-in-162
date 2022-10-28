import * as React from 'react';
import './style.css';

let post = [
  {
    message: 'mes',
    author: 'me',
    likes: 1,
  },
  {
    message: 'mes2',
    author: 'me2',
    likes: 12,
  },
];

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      {post.map((post) => (
        <Post data={post}></Post>
        /** ^ this is how you display posts
         * dynamically
         */
      ))}
      {/* <Post data={post}></Post> */}
      {/* <Post author="me again" likes="21" message='meep'></Post>
      <Post author="someone else" likes="21" message='meep2'></Post> */}
    </div>
  );
}
function Post(props) {
  return (
    <div style={{ border: '1px black solid' }}>
      <div>
        body: {props.data.message} - from: {props.data.author}
      </div>
      <div>likes: {props.data.likes}</div>
    </div>
  );
}
