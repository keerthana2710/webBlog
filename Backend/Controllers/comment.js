const asyncErrorWrapper = require("express-async-handler");
const Story = require("../Models/story");
const Comment = require("../Models/comment");

// Add a new comment to a story
const addNewCommentToStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { star, content } = req.body;

  const story = await Story.findOne({ slug: slug });

  if (!story) {
    return res.status(404).json({ success: false, message: "Story not found" });
  }

  const comment = await Comment.create({
    story: story._id,
    content: content,
    author: req.user.id,
    star: star,
  });

  story.comments.push(comment._id);
  story.commentCount = story.comments.length;
  await story.save();

  return res.status(200).json({
    success: true,
    data: comment,
  });
});

// Get all comments for a story
const getAllCommentByStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;

  const story = await Story.findOne({ slug: slug });

  if (!story) {
    return res.status(404).json({ success: false, message: "Story not found" });
  }

  const commentList = await Comment.find({ story: story._id })
    .populate({
      path: "author",
      select: "username photo",
    })
    .sort("-createdAt");

  return res.status(200).json({
    success: true,
    count: story.commentCount,
    data: commentList,
  });
});

// Like or unlike a comment
const commentLike = asyncErrorWrapper(async (req, res, next) => {
  const { activeUser } = req.body;
  const { comment_id } = req.params;

  const comment = await Comment.findById(comment_id);

  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  if (!comment.likes.includes(activeUser._id)) {
    comment.likes.push(activeUser._id);
    comment.likeCount = comment.likes.length;
  } else {
    const index = comment.likes.indexOf(activeUser._id);
    comment.likes.splice(index, 1);
    comment.likeCount = comment.likes.length;
  }

  await comment.save();

  const likeStatus = comment.likes.includes(activeUser._id);

  return res.status(200).json({
    success: true,
    data: comment,
    likeStatus: likeStatus,
  });
});

// Get like status of a comment for a user
const getCommentLikeStatus = asyncErrorWrapper(async (req, res, next) => {
  const { activeUser } = req.body;
  const { comment_id } = req.params;

  const comment = await Comment.findById(comment_id);

  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  const likeStatus = comment.likes.includes(activeUser._id);

  return res.status(200).json({
    success: true,
    likeStatus: likeStatus,
  });
});

// Edit a comment
const editCommentByUser = asyncErrorWrapper(async (req, res, next) => {
  const { comment_id } = req.params;
  const { content, star } = req.body;

  const comment = await Comment.findById(comment_id);

  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  if (comment.author.toString() !== req.user.id.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized action" });
  }

  comment.content = content || comment.content;
  comment.star = star !== undefined ? star : comment.star;
  await comment.save();

  return res.status(200).json({
    success: true,
    data: comment,
  });
});

// Delete a comment by user
const deleteCommentByUser = asyncErrorWrapper(async (req, res, next) => {
  const { comment_id } = req.params;

  const comment = await Comment.findById(comment_id);

  if (!comment) {
    return res
      .status(404)
      .json({ success: false, message: "Comment not found" });
  }

  if (comment.author.toString() !== req.user.id.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized action" });
  }

  await comment.remove();

  const story = await Story.findById(comment.story);
  story.comments.pull(comment_id);
  story.commentCount = story.comments.length;
  await story.save();

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

module.exports = {
  addNewCommentToStory,
  getAllCommentByStory,
  commentLike,
  getCommentLikeStatus,
  editCommentByUser,
  deleteCommentByUser,
};
