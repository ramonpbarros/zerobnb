import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteModal.css';
import { removeReview } from '../../store/reviews';

export default function PostReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();

    return dispatch(removeReview(reviewId))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          console.log(data);
        }
      });
  };

  return (
    <>
      <div className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="btns">
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
