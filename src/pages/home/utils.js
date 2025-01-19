export const getReviewForOrder = (orderId, reviewData = []) => {
  if (!Array.isArray(reviewData)) {
    throw new Error("reviewData must be an array");
  }
  const filteredReviews = reviewData.filter(
    (item) => item?.order_id === orderId
  );

  return filteredReviews.length > 0 ? filteredReviews[0] : null;
};
