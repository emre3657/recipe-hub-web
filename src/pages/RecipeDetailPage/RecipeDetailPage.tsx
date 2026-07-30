import { useState, type SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";
import ConfirmDialog from "../../components/ConfirmaDialog/ConfirmDialog";
import RecipeDetailComments from "../../components/RecipeDetail/RecipeDetailComments";
import RecipeDetailHero from "../../components/RecipeDetail/RecipeDetailHero";
import RecipeDetailSections from "../../components/RecipeDetail/RecipeDetailSections";
import type {
  RecipeCommentItem,
  RecipeDetailData,
} from "../../components/RecipeDetail/types";
import { db } from "../../database/db";
import useObjectUrl from "../../hooks/useObjectUrl";
import useToast from "../../hooks/useToast";
import useUserSession from "../../hooks/useUserSession";
import styles from "./RecipeDetailPage.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUserSession();
  const { showToast } = useToast();

  const [isSavingRating, setIsSavingRating] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(
    null,
  );
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const detailData = useLiveQuery<RecipeDetailData | null>(async () => {
    if (!recipeId) {
      return null;
    }

    const recipe = await db.recipes.get(recipeId);

    if (!recipe) {
      return null;
    }

    const [ratings, author, currentUserFavorite, storedComments] =
      await Promise.all([
        db.ratings.where("recipeId").equals(recipeId).toArray(),
        db.users.get(recipe.authorId),
        currentUser
          ? db.favorites
              .where("[recipeId+userId]")
              .equals([recipeId, currentUser.id])
              .first()
          : Promise.resolve(undefined),
        db.comments.where("recipeId").equals(recipeId).toArray(),
      ]);

    const averageRating =
      ratings.length === 0
        ? null
        : ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length;

    const currentUserRating = currentUser
      ? (ratings.find((rating) => rating.userId === currentUser.id)?.value ??
        null)
      : null;

    storedComments.sort(
      (firstComment, secondComment) =>
        secondComment.createdAt.getTime() - firstComment.createdAt.getTime(),
    );

    const commentUserIds = [
      ...new Set(storedComments.map((comment) => comment.userId)),
    ];

    const commentUsers = await db.users.bulkGet(commentUserIds);

    const commentUserNames = new Map(
      commentUsers.flatMap((user) =>
        user ? [[user.id, user.name] as const] : [],
      ),
    );

    const comments: RecipeCommentItem[] = storedComments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      userName: commentUserNames.get(comment.userId) ?? "Unknown user",
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      recipe,
      authorName: author?.name ?? "Unknown author",
      averageRating,
      currentUserRating,
      currentUserFavoriteId: currentUserFavorite?.id ?? null,
      comments,
    };
  }, [recipeId, currentUser?.id]);

  useDocumentTitle(detailData?.recipe.title ?? "Recipe");

  const imageSrc = useObjectUrl(detailData?.recipe.imageBlob);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteDialogOpen(false);
  };

  const handleDeleteRecipe = async () => {
    if (!detailData || !currentUser) {
      return;
    }

    const { recipe } = detailData;

    if (recipe.authorId !== currentUser.id) {
      showToast({
        message: "You can only delete your own recipes.",
        variant: "error",
      });

      setIsDeleteDialogOpen(false);
      return;
    }

    setIsDeleting(true);

    try {
      await db.transaction(
        "rw",
        db.recipes,
        db.ratings,
        db.favorites,
        db.comments,
        async () => {
          const storedRecipe = await db.recipes.get(recipe.id);

          if (!storedRecipe) {
            throw new Error("Recipe no longer exists.");
          }

          if (storedRecipe.authorId !== currentUser.id) {
            throw new Error(
              "You do not have permission to delete this recipe.",
            );
          }

          await db.ratings.where("recipeId").equals(recipe.id).delete();
          await db.favorites.where("recipeId").equals(recipe.id).delete();
          await db.comments.where("recipeId").equals(recipe.id).delete();
          await db.recipes.delete(recipe.id);
        },
      );

      showToast({
        message: "Recipe deleted successfully.",
        variant: "success",
      });

      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The recipe could not be deleted.";

      showToast({
        message,
        variant: "error",
      });

      setIsDeleting(false);
    }
  };

  const handleRatingChange = async (value: number) => {
    if (!recipeId || !currentUser || isSavingRating) {
      return;
    }

    setIsSavingRating(true);

    try {
      const existingRating = await db.ratings
        .where("[recipeId+userId]")
        .equals([recipeId, currentUser.id])
        .first();

      const now = new Date();

      if (existingRating) {
        await db.ratings.update(existingRating.id, {
          value,
          updatedAt: now,
        });
      } else {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        await db.ratings.add({
          id,
          recipeId,
          userId: currentUser.id,
          value,
          createdAt: now,
          updatedAt: now,
        });
      }

      showToast({
        message: existingRating
          ? "Rating updated successfully."
          : "Rating added successfully.",
        variant: "success",
      });
    } catch {
      showToast({
        message: "The rating could not be saved.",
        variant: "error",
      });
    } finally {
      setIsSavingRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipeId || !currentUser || !detailData || isTogglingFavorite) {
      return;
    }

    setIsTogglingFavorite(true);

    try {
      const existingFavorite = await db.favorites
        .where("[recipeId+userId]")
        .equals([recipeId, currentUser.id])
        .first();

      if (existingFavorite) {
        await db.favorites.delete(existingFavorite.id);

        showToast({
          message: "Recipe removed from favorites.",
          variant: "success",
        });
      } else {
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        await db.favorites.add({
          id,
          recipeId,
          userId: currentUser.id,
          createdAt: new Date(),
        });

        showToast({
          message: "Recipe added to favorites.",
          variant: "success",
        });
      }
    } catch {
      showToast({
        message: "The favorite could not be updated.",
        variant: "error",
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddComment = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recipeId || !currentUser || isSubmittingComment) {
      return;
    }

    const normalizedContent = commentContent.trim();

    if (!normalizedContent) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    if (normalizedContent.length > 500) {
      setCommentError("Comment cannot be longer than 500 characters.");
      return;
    }

    setCommentError(null);
    setIsSubmittingComment(true);

    try {
      const recipeExists = await db.recipes.get(recipeId);

      if (!recipeExists) {
        throw new Error("Recipe no longer exists.");
      }

      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      const now = new Date();

      await db.comments.add({
        id,
        recipeId,
        userId: currentUser.id,
        content: normalizedContent,
        createdAt: now,
        updatedAt: now,
      });

      setCommentContent("");

      showToast({
        message: "Comment added successfully.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The comment could not be added.";

      showToast({
        message,
        variant: "error",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStartEditingComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleCancelEditingComment = () => {
    if (isUpdatingComment) {
      return;
    }

    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!currentUser || isUpdatingComment) {
      return;
    }

    const normalizedContent = editingCommentContent.trim();

    if (!normalizedContent) {
      showToast({
        message: "Comment cannot be empty.",
        variant: "error",
      });

      return;
    }

    if (normalizedContent.length > 500) {
      showToast({
        message: "Comment cannot be longer than 500 characters.",
        variant: "error",
      });

      return;
    }

    setIsUpdatingComment(true);

    try {
      const storedComment = await db.comments.get(commentId);

      if (!storedComment) {
        throw new Error("Comment no longer exists.");
      }

      if (storedComment.userId !== currentUser.id) {
        throw new Error("You can only edit your own comments.");
      }

      await db.comments.update(commentId, {
        content: normalizedContent,
        updatedAt: new Date(),
      });

      setEditingCommentId(null);
      setEditingCommentContent("");

      showToast({
        message: "Comment updated successfully.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The comment could not be updated.";

      showToast({
        message,
        variant: "error",
      });
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const openCommentDeleteDialog = (commentId: string) => {
    setCommentToDeleteId(commentId);
  };

  const closeCommentDeleteDialog = () => {
    if (isDeletingComment) {
      return;
    }

    setCommentToDeleteId(null);
  };

  const handleDeleteComment = async () => {
    if (!commentToDeleteId || !currentUser || isDeletingComment) {
      return;
    }

    setIsDeletingComment(true);

    try {
      const storedComment = await db.comments.get(commentToDeleteId);

      if (!storedComment) {
        throw new Error("Comment no longer exists.");
      }

      if (storedComment.userId !== currentUser.id) {
        throw new Error("You can only delete your own comments.");
      }

      await db.comments.delete(commentToDeleteId);

      if (editingCommentId === commentToDeleteId) {
        setEditingCommentId(null);
        setEditingCommentContent("");
      }

      setCommentToDeleteId(null);

      showToast({
        message: "Comment deleted successfully.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The comment could not be deleted.";

      showToast({
        message,
        variant: "error",
      });
    } finally {
      setIsDeletingComment(false);
    }
  };

  if (!recipeId) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Recipe not found</h1>
        <Link className={styles.backLink} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  if (detailData === undefined) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Loading recipe...</h1>
      </section>
    );
  }

  if (!detailData) {
    return (
      <section className={styles.statusCard}>
        <h1 className={styles.statusTitle}>Recipe not found</h1>
        <Link className={styles.backLink} to="/">
          Back to recipes
        </Link>
      </section>
    );
  }

  const {
    recipe,
    authorName,
    averageRating,
    currentUserRating,
    currentUserFavoriteId,
    comments,
  } = detailData;

  const isOwner = currentUser?.id === recipe.authorId;
  const isFavorite = currentUserFavoriteId !== null;

  return (
    <>
      <article className={styles.page}>
        <Link className={styles.backLink} to="/">
          Back to recipes
        </Link>

        <RecipeDetailHero
          recipe={recipe}
          recipeImageSrc={imageSrc}
          authorName={authorName}
          averageRating={averageRating}
          currentUser={currentUser}
          isFavorite={isFavorite}
          isTogglingFavorite={isTogglingFavorite}
          isOwner={isOwner}
          onToggleFavorite={handleToggleFavorite}
          onDeleteRecipe={openDeleteDialog}
        />

        <RecipeDetailSections
          recipe={recipe}
          currentUserRating={currentUserRating}
          isSavingRating={isSavingRating}
          onRatingChange={handleRatingChange}
          currentUser={currentUser}
        />

        <RecipeDetailComments
          comments={comments}
          currentUser={currentUser}
          commentContent={commentContent}
          commentError={commentError}
          isSubmittingComment={isSubmittingComment}
          editingCommentId={editingCommentId}
          editingCommentContent={editingCommentContent}
          isUpdatingComment={isUpdatingComment}
          onCommentContentChange={(value) => {
            setCommentContent(value);

            if (commentError) {
              setCommentError(null);
            }
          }}
          onAddComment={handleAddComment}
          onStartEditingComment={handleStartEditingComment}
          onCancelEditingComment={handleCancelEditingComment}
          onUpdateComment={handleUpdateComment}
          onEditingCommentContentChange={setEditingCommentContent}
          onOpenCommentDeleteDialog={openCommentDeleteDialog}
        />
      </article>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete recipe?"
        description={`Are you sure you want to delete “${recipe.title}”? This action cannot be undone.`}
        confirmLabel="Delete recipe"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        onConfirm={handleDeleteRecipe}
        onClose={closeDeleteDialog}
      />

      <ConfirmDialog
        isOpen={commentToDeleteId !== null}
        title="Delete comment?"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete comment"
        cancelLabel="Cancel"
        isConfirming={isDeletingComment}
        onConfirm={handleDeleteComment}
        onClose={closeCommentDeleteDialog}
      />
    </>
  );
}

export default RecipeDetailPage;
