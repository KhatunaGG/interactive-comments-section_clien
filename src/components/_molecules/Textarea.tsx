import axios from "axios";
import { BASE_URL } from "../../constants";
import { TextareaPropsType } from "../../interfaces";
import { formatDistanceToNow } from 'date-fns';



const Textarea = ({ setCommentContent,
    createComment,
    parentCommentId,
    createReply,
    activeReplyId,
    isShow,
    commentContent,
    replyContent,
    setReplyContent,
    isUpdate,
    replyToUpdate,
    getAllComments,
    setRandomUser,
    randomUser,
    setIsShow,
    setIsUpdate,
    setActiveReplyId,
    setActiveCommentId,
}: TextareaPropsType) => {



    const updateReply = async (id: string, parentId: string) => {
        console.log('hello')
        if (setRandomUser) {
            setRandomUser(null);
        }
        const createdAtDate = replyToUpdate?.createdAt ? new Date(replyToUpdate.createdAt) : null;
        const formattedCreatedAt = createdAtDate && !isNaN(createdAtDate.getTime())
            ? formatDistanceToNow(createdAtDate, { addSuffix: true })
            : '';
        try {
            const res = await axios.put(`${BASE_URL}/reply/${parentId}/${id}`, {
                content: replyContent,
                createdAt: formattedCreatedAt,
                userName: replyToUpdate?.userName,
                replyTo: replyToUpdate?.replyTo
            })
            if (res.status === 200) {
                console.log(res.status, 'res.status')
                if(setIsShow) {
                    setIsShow(!isShow)
                }
                
                if(setIsUpdate) {
                    setIsUpdate(!isUpdate)
                }

                if(setActiveReplyId) {
                    setActiveReplyId('')
                }
                if(setActiveCommentId) {
                    setActiveCommentId('')
                }

                if (getAllComments) {
                    getAllComments()
                }
            }

        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className='w-full flex flex-row items-start gap-4'>
            <div className='hidden lg:flex'>
                <img className='w-8 h-8 lg:w-10 lg:h-10 rounded-full' src={isUpdate ? replyToUpdate?.img : randomUser?.img} alt="" />
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    if (createComment) {
                        createComment()
                    } else if (createReply && parentCommentId && !isUpdate) {
                        createReply(parentCommentId);
                    } else if (isUpdate) {
                        updateReply(activeReplyId ?? '', parentCommentId ?? '')
                    }
                }}
                className='w-full flex flex-col lg:flex-row items-start gap-4 lg:w-[94.52%] ' action="">
                <textarea
                    onChange={(e) => {
                        if (setCommentContent) {
                            setCommentContent(e.target.value)
                        } else if (setReplyContent) {
                            setReplyContent(e.target.value)
                        }
                    }}
                    className='rounded-lg w-full outline-none p-4 text-xs' name="" id=""
                    value={setCommentContent ? commentContent : (setReplyContent ? replyContent : '')}

                ></textarea>

                <div className='w-full flex flex-row items-center justify-between lg:w-[20%]'>
                    <div className=' lg:hidden'>
                        <img className='w-8 h-8 lg:w-10 lg:h-10 rounded-full' src="/assets/Oval.png" alt="" />
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <button className='py-3 px-[30px] bg-[#5357B6] rounded-lg text-white font-bold uppercase text-sm hover:bg-[#C5C6EF] transition-all duration-500 ease-in-out'>
                            {isShow ? (isUpdate ? 'Update' : 'Reply') : 'Send'}
                        </button>
                    </div>

                </div>
            </form>

        </div>
    )
}

export default Textarea