import { useEffect, useState } from 'react';
import './App.css'
import { Post, Textarea } from './components/_molecules'
import { CommentType, ReplyType, UserType } from './interfaces';
import axios from 'axios';
import { BASE_URL, USERS_URL } from './constants';



import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);



function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [comments, setComments] = useState<CommentType[] | undefined>()
  const [users, setUsers] = useState<UserType[]>([])
  const [randomUser, setRandomUser] = useState<UserType | null>(null);
  const [commentContent, setCommentContent] = useState('')
  const [score] = useState(0)
  const [activeCommentId, setActiveCommentId] = useState('')
  const [parentCommentId, setParentCommentId] = useState('')
  const [isShow, setIsShow] = useState(false)
  const [activeReplyId, setActiveReplyId] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyToReply, setReplyToReply] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [replyToUpdate, setReplyToUpdate] = useState<ReplyType>()
  const [updateId, setUpdateId] = useState('')



  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${USERS_URL}`);
      const formattedData = res.data.map((el: any) => ({
        ...el,
        id: el._id,
      }));
      setUsers(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);


  const getRandomUser = () => {
    if (users.length === 0) return;
    const randomIndex = Math.floor(Math.random() * users.length);
    const random = users[randomIndex];
    setRandomUser(random);
  };


  const getAllComments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}`);
      const formattedData = res.data.map((comment: any) => ({
        ...comment,
        id: comment._id,
        replies: comment.replies?.map((reply: any) => ({
          ...reply,
          id: reply._id,
        })) || [],
      }));
      setComments(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllComments()
  }, [users])


  const createComment = async () => {
    if (!randomUser) return;
    const createdAt = dayjs().toISOString();


    try {
      const res = await axios.post(`${BASE_URL}`, {
        content: commentContent,
        createdAt,
        score: score,
        img: randomUser.img,
        userName: randomUser.userName,
        userId: randomUser.id,
        replies: [],
      });
      if (res.status === 200) {
        getAllComments()
        setCommentContent('')
      }
    } catch (error) {
      console.log(error)
    }
  }





  const updateScore = async (id: string, newScore: number, value: string, parentId: string) => {
    try {
      const url = value === 'comment'
        ? `${BASE_URL}/score/${id}`
        : `${BASE_URL}/score/${parentId}/${id}`;

      const res = await axios.put(url, { score: newScore });
      if (res.status === 200) {
        getAllComments();
      }
    } catch (error) {
      console.log(error)
    }
  }



  const increaseScore = (id: string, value: string) => {
    if (value === 'comment') {
      const commentScoreToUpdate = comments?.find(el => el.id === id)
      if (commentScoreToUpdate) {
        const newScore = commentScoreToUpdate.score + 1;
        updateScore(id, newScore, value, '')
      }
    } else if (value === 'reply') {
      comments?.forEach(el => {
        const replyScoreToUpdate = el?.replies?.find(item => item.id === id)
        if (replyScoreToUpdate) {
          const newScore = replyScoreToUpdate.score + 1
          updateScore(id, newScore, value, el.id);
        }
      })
    }
  }


  const decreaseScore = (id: string, value: string) => {
    if (value === 'comment') {
      const commentScoreToUpdate = comments?.find(el => el.id === id)
      if (commentScoreToUpdate && commentScoreToUpdate.score > 0) {
        const newScore = commentScoreToUpdate.score - 1
        updateScore(id, newScore, value, '')
      }
    } else if (value === 'reply') {
      comments?.forEach(el => {
        const replyScoreToUpdate = el.replies?.find(item => item.id === id)
        if (replyScoreToUpdate && replyScoreToUpdate.score > 0) {
          const newScore = replyScoreToUpdate.score - 1
          updateScore(id, newScore, value, el.id)
        }
      })
    }
  }


  useEffect(() => {
    getRandomUser();
  }, [users]);


  const createReply = async (parentCommentId: string) => {
    getRandomUser();
    const createdAt = dayjs().toISOString();
    try {
      if (!randomUser) return;
      const parentComment = comments?.find(comment => comment.id === parentCommentId);
      const newReply = {
        content: replyContent,
        createdAt,
        userName: randomUser.userName,
        img: randomUser.img,
        score: 0,
        replyTo: replyToReply ? replyToReply : parentComment?.userName
      };
      const res = await axios.post(`${BASE_URL}/create/${parentCommentId}`, { newReply })
      if (res.status === 200) {
        setActiveCommentId('')
        setParentCommentId('')
        setCommentContent('')
        setReplyContent('')
        setIsShow(false)
        getAllComments()
        setReplyToReply('')
      }
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <main className='bg-[#F5F6FA] w-full h-full py-8 lg:py-[64px] flex flex-col'>
      <section className='w-[91.46%] lg:w-[50.69%] mx-auto  flex flex-col items-center gap-10 lg:gap-[20px]'>
        <div className='w-full flex flex-col gap-6'>

          <div className='w-full flex flex-col gap-4'>
            {comments?.map(comment => (
              <div key={comment.id} className='w-full flex flex-col gap-4'>
                <Post
                  screenWidth={screenWidth}
                  comment={comment}
                  setActiveCommentId={setActiveCommentId}
                  setParentCommentId={setParentCommentId}
                  setIsShow={setIsShow}
                  isShow={isShow}
                  activeCommentId={activeCommentId}
                  increaseScore={() => increaseScore(comment.id, 'comment')}
                  decreaseScore={() => decreaseScore(comment.id, 'comment')}
                  createdAt={dayjs(comment.createdAt).fromNow()}
                />
                {comment.id === activeCommentId && isShow && (
                  <Textarea
                    setReplyContent={setReplyContent}
                    parentCommentId={parentCommentId}
                    createReply={createReply}
                    isShow={isShow}
                    replyContent={replyContent}
                  />
                )}


                {comment.replies?.map((reply, i) => (
                  <div key={i} className='REPLY-CONTINER flex flex-col gap-4 lg:w-[90%] lg:ml-[10%]'>
                    <Post
                      screenWidth={screenWidth}
                      reply={reply}
                      replyId={reply.id}
                      setActiveReplyId={setActiveReplyId}
                      idOfParentComment={comment.id}
                      parentCommentId={parentCommentId}
                      activeReplyId={activeReplyId}
                      setParentCommentId={setParentCommentId}
                      setIsShow={setIsShow}
                      isShow={isShow}
                      setReplyToReply={setReplyToReply}
                      replyToReply={replyToReply}
                      getAllComments={getAllComments}
                      increaseScore={() => increaseScore(reply.id, 'reply')}
                      decreaseScore={() => decreaseScore(reply.id, 'reply')}
                      setIsUpdate={setIsUpdate}
                      isUpdate={isUpdate}
                      setReplyToUpdate={setReplyToUpdate}
                      setReplyContent={setReplyContent}
                      setUpdateId={setUpdateId}
                      updateId={updateId}
                      createdAt={dayjs(reply.createdAt).fromNow()}
                    />


                    {reply.id === activeReplyId && isShow && (
                      <Textarea
                        setReplyContent={setReplyContent}
                        activeReplyId={activeReplyId}
                        isShow={isShow}
                        replyContent={replyContent}
                        createReply={createReply}
                        parentCommentId={parentCommentId}
                        isUpdate={isUpdate}
                        replyToUpdate={replyToUpdate}
                        getAllComments={getAllComments}
                        updateId={updateId}
                        setActiveReplyId={setActiveReplyId}
                        setActiveCommentId={setActiveCommentId}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>


        <Textarea
          setCommentContent={setCommentContent}
          createComment={createComment}
          commentContent={commentContent}
          randomUser={randomUser}
        />
      </section>
    </main>
  )
}

export default App
