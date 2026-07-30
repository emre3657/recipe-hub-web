import { type SubmitEvent } from "react";
import styles from "./RecipeDetailComments.module.css";
import type { RecipeCommentItem } from "./types";
import type { User } from "../../types/user";

interface RecipeDetailCommentsProps {
  comments: RecipeCommentItem[];
  currentUser: User | null;
  commentContent: string;
  commentError: string | null;
  isSubmittingComment: boolean;
  editingCommentId: string | null;
  editingCommentContent: string;
  isUpdatingComment: boolean;
  onCommentContentChange: (value: string) => void;
  onAddComment: (event: SubmitEvent<HTMLFormElement>) => void;
  onStartEditingComment: (commentId: string, content: string) => void;
  onCancelEditingComment: () => void;
  onUpdateComment: (commentId: string) => void;
  onEditingCommentContentChange: (value: string) => void;
  onOpenCommentDeleteDialog: (commentId: string) => void;
}

function RecipeDetailComments({
  comments,
  currentUser,
  commentContent,
  commentError,
  isSubmittingComment,
  editingCommentId,
  editingCommentContent,
  isUpdatingComment,
  onCommentContentChange,
  onAddComment,
  onStartEditingComment,
  onCancelEditingComment,
  onUpdateComment,
  onEditingCommentContentChange,
  onOpenCommentDeleteDialog,
}: RecipeDetailCommentsProps) {
  return (
    <section
      className={styles.contentSection}
      aria-labelledby="comments-heading"
    >
      <div className={styles.commentsHeader}>
        <h2 id="comments-heading" className={styles.sectionTitle}>
          Comments
        </h2>

        <span className={styles.commentCount}>
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {currentUser ? (
        <form className={styles.commentForm} onSubmit={onAddComment}>
          <label className={styles.commentLabel} htmlFor="comment-content">
            Add a comment
          </label>

          <textarea
            id="comment-content"
            className={styles.commentTextarea}
            value={commentContent}
            maxLength={500}
            rows={4}
            disabled={isSubmittingComment}
            aria-invalid={commentError ? true : undefined}
            aria-describedby={
              commentError ? "comment-error comment-counter" : "comment-counter"
            }
            onChange={(event) => onCommentContentChange(event.target.value)}
          />

          <div className={styles.commentFormFooter}>
            <div>
              {commentError ? (
                <p
                  id="comment-error"
                  className={styles.commentError}
                  role="alert"
                >
                  {commentError}
                </p>
              ) : null}

              <p id="comment-counter" className={styles.commentCounter}>
                {commentContent.length}/500
              </p>
            </div>

            <button
              className={styles.commentSubmit}
              type="submit"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? "Adding..." : "Add comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className={styles.commentMessage}>Select a user to add a comment.</p>
      )}

      {comments.length === 0 ? (
        <p className={styles.emptyComments}>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => {
            const createdAt = new Intl.DateTimeFormat("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(comment.createdAt);

            return (
              <li key={comment.id} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <strong className={styles.commentAuthor}>
                    {comment.userName}
                  </strong>

                  <time
                    className={styles.commentDate}
                    dateTime={comment.createdAt.toISOString()}
                  >
                    {createdAt}
                  </time>
                </div>

                {editingCommentId === comment.id ? (
                  <div className={styles.commentEditForm}>
                    <label
                      className={styles.visuallyHidden}
                      htmlFor={`edit-comment-${comment.id}`}
                    >
                      Edit comment
                    </label>

                    <textarea
                      id={`edit-comment-${comment.id}`}
                      className={styles.commentTextarea}
                      value={editingCommentContent}
                      maxLength={500}
                      rows={4}
                      disabled={isUpdatingComment}
                      onChange={(event) =>
                        onEditingCommentContentChange(event.target.value)
                      }
                    />

                    <div className={styles.commentEditFooter}>
                      <span className={styles.commentCounter}>
                        {editingCommentContent.length}/500
                      </span>

                      <div className={styles.commentActions}>
                        <button
                          className={styles.commentCancelAction}
                          type="button"
                          disabled={isUpdatingComment}
                          onClick={onCancelEditingComment}
                        >
                          Cancel
                        </button>

                        <button
                          className={styles.commentSaveAction}
                          type="button"
                          disabled={isUpdatingComment}
                          onClick={() => onUpdateComment(comment.id)}
                        >
                          {isUpdatingComment ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.commentContent}>{comment.content}</p>

                    {currentUser?.id === comment.userId ? (
                      <div className={styles.commentActions}>
                        <button
                          className={styles.commentEditAction}
                          type="button"
                          onClick={() =>
                            onStartEditingComment(comment.id, comment.content)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className={styles.commentDeleteAction}
                          type="button"
                          onClick={() => onOpenCommentDeleteDialog(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default RecipeDetailComments;
