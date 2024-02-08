import { PostLike } from "@/components/common/action-buttons/PostLike";
import { IoIosShareAlt } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import { PostType } from "../../../../../../types";
import moment from "moment";
import { FollowButton } from "@/components/common/action-buttons/FollowButton";
import { CommentButton } from "@/components/common/action-buttons/CommentButton";
import { SetStateAction,} from "react";
import { useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";

type Props = {
  content: PostType;
  setComments: React.Dispatch<SetStateAction<PostType[]>>;
};

export function MainPost({ content, setComments }: Props) {
  const user = useAppSelector((state) => state.userReducer);

  const router = useRouter();

  const date = moment(content.createdAt).format("h:mm a · MMM Do YY");
  const sameUser = content.user_info._id === user.user_info._id;

  return (
    <article className="main-post">
      <div className="upper-post">
        <div
          className="user-details"
          onClick={() => router.push(`/profile/${content.user_info._id}`)}
        >
          <img src={content.user_info?.avatar_url} />
          <p>{content.user_info?.name}</p>
        </div>
        <div className="action-buttons">
          {!sameUser && <FollowButton userData={content.user_info} />}
          {(sameUser || user.user_info.admin) && (
            <SlOptions className="options-btn" />
          )}
        </div>
      </div>
      <div className="post-content">
        <p>{content.content}</p>
      </div>
      <footer>
        <div className="post-details">{date}</div>
        <div className="post-action-buttons">
          <PostLike post={content} />
          <div className="button-container">
            <CommentButton setComments={setComments} content={content} />
          </div>
          <div className="button-container">
            <IoIosShareAlt className="icon" />
            <p>{content.sharesCount > 0 && content.sharesCount}</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
