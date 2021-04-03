import React, { useEffect, useState } from 'react';
import { dbService,authService,firebaseInstance } from '../../fbase'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactHtmlParser from 'react-html-parser'

const Post = ({userObj}) => {
  const [writeMode, setWriteMode] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [everyPost, setEveryPost] = useState([])
  const [content, setContent] = useState('')
  useEffect(() => {
    setEveryPost([])
    console.log("useEffect 실행")
    dbService.collection("post").orderBy("date","desc").limit(30).get().then(snapshot => {
      snapshot.docs.map(doc => {
        const postObject = {
          content: doc.data().content,
          writer: doc.data().writer,
          date: doc.data().date,
          recent_fix: doc.data().recent_fix
        }
        setEveryPost(everyPost => [...everyPost, postObject]);
      })
    })
  }, [refresh])

  const onSocialClick = async(event) => {
    const {target:{name},
    } = event;
    let provider;
    if(name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  const submitReview = async(e) =>{
    e.preventDefault();
    if(content === ''){
      alert("내용을 입력하세요")
      return;
    }
    let now = new Date();   
    let year = now.getFullYear(); // 년도
    let month = now.getMonth() + 1;  // 월
    if(month<10){
      month = 0+''+month
    }
    let date = now.getDate();  // 날짜
    if(date<10){
      date = 0+''+date
    }
    let hours = now.getHours(); // 시
    if(hours<10){
      hours = 0+''+hours
    }
    let minutes = now.getMinutes();  // 분
    if(minutes<10){
      minutes = 0+''+minutes
    }
    let seconds = now.getSeconds();  // 초
    if(seconds<10){
      seconds = 0+''+seconds
    }
    const time = (year + '' + month + '' + date + '' + hours + '' + minutes + '' + seconds)

    const postObject = {
      date: time,
      recent_fix: time,
      content: content,
      writer: userObj.displayName,
    }
    await dbService.collection("post").doc(time).set(postObject);
    setContent('')
    setWriteMode(!writeMode)
    setRefresh(!refresh)
  };

  const writeModeBtn = () => {
    setWriteMode(!writeMode)
  }

  const PostList = everyPost.map(post =>(
    <div className="post">
      <div className="postHeader">
        <div classNames="userName">{post.writer}</div>
        <div classNames="postDate">{post.date.slice(0,4)}년 {post.date.slice(4, 6)}월 {post.date.slice(6,8)}일</div>
      </div>
      <div className="postContent">
        {ReactHtmlParser(post.content)}
      </div>
    </div>
  ))

  const postMaker = (
      <div className={writeMode ? 'postMaker active' : 'postMaker'}>
        <CKEditor
          editor={ClassicEditor}
          data="내용을 입력하세용!"
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data)
          }}
        />
        <div className="buttons">
          <button className="writeModeBtn" onClick={writeModeBtn}>
            취소
          </button>
          <button className="writeModeBtn" onClick={submitReview}>
            작성
          </button>
        </div>
      </div>
  )

  const postMakeBtn = (
    <div className="postMakeBtn">
      <div>{userObj.displayName} 님 안녕하세요!</div>
      <button className="writeModeBtn" onClick={writeModeBtn}>
        작성
      </button>
    </div>
  )

  const needLoginBtn = (
    <button onClick={onSocialClick} name="google" className="writeModeBtn">
      구글 로그인
    </button>
  )

  return (
    <postMakeBtn>
      <div className="postMain">
        {postMaker}
        <div className={writeMode ? 'postList active' : 'postList'}>
          {userObj.displayName
            ? <>{postMakeBtn}</>
            : <>{needLoginBtn}</>
          }
          {PostList}
        </div>
      </div>
    </postMakeBtn>
  )
};

export default Post;