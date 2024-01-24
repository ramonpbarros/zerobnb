import { useModal } from '../../context/Modal';
import './OpenDeleteModalButton.css';

function OpenModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === 'function') onButtonClick();
  };

  return (
    <button className='delete-btn' onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
