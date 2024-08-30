import axios from "axios";
import { PostPropsType } from "../../interfaces";
import { DeleteIcon, EditIcon, ReplyIcon } from "../_atoms";
import { BASE_URL } from "../../constants";
import { useEffect } from "react";



const Post = ({
  screenWidth,
  comment,
  increaseScore,
  decreaseScore,
  setActiveCommentId,
  setParentCommentId,
  setIsShow,
  isShow,
  reply,
  setActiveReplyId,
  idOfParentComment,
  activeReplyId,
  parentCommentId,
  activeCommentId,
  setReplyToReply,
  getAllComments,
  setIsUpdate,
  isUpdate,
  setReplyToUpdate,
  setReplyContent,
  createdAt
}: PostPropsType) => {


  const getReplyById = async (parentId: string, id: string) => {
    try {
      if (isUpdate) {
        const res = await axios.get(`${BASE_URL}/${parentId}/${id}`)
        if (setReplyContent && setReplyToUpdate) {
          setReplyContent(res.data.content)
          setReplyToUpdate(res.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (isUpdate) {
      getReplyById(parentCommentId ?? '', activeReplyId ?? '')
    }
  }, [isUpdate])





  const handleCreate = () => {
    setIsShow(!isShow);
    if (reply && setActiveReplyId) {
      setParentCommentId(idOfParentComment ?? '');
      setActiveReplyId(reply?.id ?? '');
      if (setReplyToReply) {
        setReplyToReply(reply?.userName)
      }

      if (activeReplyId === reply.id) {
        setActiveReplyId('')
      } else {
        setActiveReplyId(reply.id)
      }
    } else if (comment && setActiveCommentId) {
      setParentCommentId(comment.id)
      setActiveCommentId(comment?.id ?? '');
      if (activeCommentId === comment?.id) {
        setActiveCommentId('')
      } else {
        setActiveCommentId(comment?.id)
      }
    }
  }



  const handleDelete = async (parentId: string, id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${parentId}/${id}`)
      if (res.status === 200) {
        if (getAllComments) {
          getAllComments()
        }
        setIsShow(!isShow)
      }
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <div className={`${isShow ? 'lg:pb-2' : 'lg:pb-6'} px-6 pt-6  bg-white w-full rounded-lg `}>
      <div className='w-full flex-col gap-4 flex lg:flex-row lg:gap-6 text-[#67727E]'>

        <div className="h-full w-full flex items-center justify-center lg:items-start  order-2 lg:order-1 lg:w-[6%] ">
          <div className="w-[35%] flex items-center justify-center py-[7px] lg:flex-col  lg:justify-around bg-[#F5F6FA] lg:h-[16.18%] lg:px-[7px] rounded-[10px] lg:w-full ">

            <div className='COUNTER flex flex-col items-center'>
              <button
                onClick={() => {
                  if (comment?.id) {
                    increaseScore(comment.id, 'comment')
                  } else {
                    increaseScore(reply?.id ?? '', 'reply')
                  }
                }}

                className="hidden lg:flex text-[#C5C6EF] font-bold">+</button>
              <div className="font-bold text-sm text-[#5357B6] pt-[3px]">{comment?.score ? comment?.score || 0 : reply?.score || 0}</div>
              <button
                onClick={() => {
                  if (comment?.id) {
                    decreaseScore(comment.id, 'comment');
                  } else if (reply?.id) {
                    decreaseScore(reply.id, 'reply');
                  }
                }}
                className="hidden lg:flex text-[#C5C6EF] font-bold">-</button>
            </div>

          </div>


          {screenWidth < 376 && (
            <div className="REPLY w-full flex flex-row items-center justify-end ">``
              <button

                className="w-[65%] flex justify-end flex-row items-center gap-2 lg:w-full hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out">
                <ReplyIcon />
                <p className="text-[#5357B6] font-bold text-sm hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out">
                  Reply
                </p>
              </button>
            </div>
          )}
        </div>
        <div className='w-full  flex lg:flex-col lg:gap-[22px] oreder-1 lg:order-2 '>
          <div className="flex lg:flex-row items-center justify-between ">
            {screenWidth > 375 && (
              <div className="INFO mb-6 lg:mb-0 flex flex-row items-center gap-4">
                <img src={reply?.img ? reply?.img : comment?.img} alt="" className="lg:w-8 h-8" />
                <p className="font-bold">{reply?.userName ? reply?.userName : comment?.userName}</p>
                <p className="text-sm">{createdAt}</p>
              </div>
            )}

            {screenWidth > 375 && (
              <div className="flex flex-row items-center justify-end ">
                <div className="REPLY w-full flex flex-row items-center  gap-4 justify-end ">
                  {reply && activeReplyId === reply?.id && isShow && (
                    <button
                      onClick={() => {
                        if (setIsUpdate) {
                          setIsUpdate(!isUpdate)
                          getReplyById(parentCommentId ?? '', reply.id)
                        }
                      }}
                      className="w-[65%] flex justify-end flex-row items-center gap-1 lg:w-full hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out">
                      <EditIcon />
                      <p className="text-[#5357B6] font-bold text-sm hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out">
                        {isUpdate ? 'Update' : 'Edit'}
                      </p>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleCreate()
                    }}
                    className="w-[65%] flex justify-end flex-row items-center gap-1 lg:w-full hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out">
                    <ReplyIcon />
                    <p className="text-[#5357B6] font-bold text-sm hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out">
                      Reply
                    </p>
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="w-full">
            {screenWidth < 376 && (
              <div className="INFO mb-6 lg:mb-0 flex flex-row items-center gap-4">
                <img src={idOfParentComment ? reply?.img : comment?.img} alt="" className="lg:w-8 h-8" />
                <p className="font-bold">{idOfParentComment ? reply?.userName : comment?.userName}</p>
                <p className="text-sm">{idOfParentComment ? reply?.createdAt : comment?.createdAt}</p>
              </div>
            )}
            <p className="text-sm">
              <span className="font-bold">{reply?.replyTo === undefined ? '' : `@${reply?.replyTo}`} </span>
              {reply?.content ? reply?.content : comment?.content}</p>
          </div>
        </div>

      </div>
      {comment && activeCommentId === comment?.id && isShow || reply && activeReplyId === reply?.id && isShow && (
        <button
          onClick={() => handleDelete(parentCommentId ?? '', comment ? comment?.id ?? '' : reply?.id ?? '')}
          className='w-[65%] flex justify-end flex-row items-center gap-1 lg:w-full hover:text-[#C5C6EF] cursor-pointer transition-all duration-500 ease-in-out'>
          <DeleteIcon />
          <p className="text-[#ED6368] font-bold text-sm hover:text-[#FFB8BB] cursor-pointer transition-all duration-500 ease-in-out">
            delete
          </p>
        </button>
      )}

    </div>
  )
}

export default Post