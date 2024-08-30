export type UserType = {
    userName: string;
    img: string;
    id: string;
    score: number
};

export type ReplyType = {
    content: string,
    createdAt: string,
    score: number,
    replyTo: string,
    img: string,
    userName: string,
    id: string;


}

export type CommentType = {
    content: string;
    createdAt?: string;
    score: number;
    img?: string;
    userName: string;
    userId: string;
    replies?: ReplyType[];
    id: string
};


export type PostPropsType = {
    screenWidth: number;
    replyWidth?: string;
    comment?: CommentType;
    setActiveCommentId?: React.Dispatch<React.SetStateAction<string>>;
    setParentCommentId: React.Dispatch<React.SetStateAction<string>>;
    setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
    isShow: boolean;
    reply?: ReplyType;
    setActiveReplyId?: React.Dispatch<React.SetStateAction<string>>;
    idOfParentComment?: string;
    activeReplyId?: string;
    parentCommentId?: string;
    replyId?: string;
    activeCommentId?: string;
    setReplyToReply?: React.Dispatch<React.SetStateAction<string>>;
    replyToReply?: string;
    increaseScore: (id: string, value: string) => void;
    decreaseScore: (id: string, value: string) => void;
    getAllComments?: () => void;
    setIsUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdate?: boolean;
    setReplyToUpdate?: React.Dispatch<React.SetStateAction<ReplyType | undefined>>
    setReplyContent?: React.Dispatch<React.SetStateAction<string>>;
    setUpdateId?: React.Dispatch<React.SetStateAction<string>>;
    updateId?: string;
    createdAt?: string;
}


export type TextareaPropsType = {
    setCommentContent?: React.Dispatch<React.SetStateAction<string>>
    createComment?: () => void;
    parentCommentId?: string;
    createReply?: (value: string) => void;
    activeReplyId?: string;
    isShow?: boolean;
    commentContent?: string;
    replyContent?: string;
    setReplyContent?: React.Dispatch<React.SetStateAction<string>>;
    isUpdate?: boolean;
    replyToUpdate?: ReplyType;
    getAllComments?: () => void;
    setRandomUser?: React.Dispatch<React.SetStateAction<UserType | null>>;
    randomUser?: UserType | null;
    updateId?: string;
    setIsShow?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveReplyId?: React.Dispatch<React.SetStateAction<string>>;
    setActiveCommentId?: React.Dispatch<React.SetStateAction<string>>;
}
