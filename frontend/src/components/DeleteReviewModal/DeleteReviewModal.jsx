import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';
import { removeReview, getReviewsBySpotId } from '../../store/reviews';
import { getSpotById } from '../../store/spots';

export default function PostReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await dispatch(removeReview(reviewId));

      dispatch(getSpotById(spotId));
      dispatch(getReviewsBySpotId(spotId));

      closeModal();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <>
      <div className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="modal-btns">
          <button className="confirm-delete-btn" onClick={handleDelete}>
            Yes (Delete Review)
          </button>
          <button className="dont-delete-btn" onClick={closeModal}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </>
  );
}
