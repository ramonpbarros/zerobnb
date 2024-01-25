import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import {
  getAllSpots,
  getSpotsByCurrentUser,
  removeSpot,
} from '../../store/spots';
import './DeleteSpotModal.css';

export default function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await dispatch(removeSpot(spotId));

      dispatch(getSpotsByCurrentUser());
      dispatch(getAllSpots());

      closeModal();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  return (
    <>
      <div className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div className="btns">
          <button className="confirm-delete-btn" onClick={handleDelete}>
            Yes (Delete Spot)
          </button>
          <button className="dont-delete-btn" onClick={closeModal}>
            No (Keep Spot)
          </button>
        </div>
      </div>
    </>
  );
}
