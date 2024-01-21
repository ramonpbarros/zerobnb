import './CreateSpot.css';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewSpotImage, createNewSpot } from '../../store/spots';

export default function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState(['', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const newErrors = {};

    if (!country.trim()) newErrors.country = 'Country is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!lat.trim()) newErrors.lat = 'Latitude is required';
    if (!lng.trim()) newErrors.lng = 'Longitude is required';
    if (description.length < 30)
      newErrors.description = 'Description needs a minimum of 30 characters';
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    if (url[0].length < 1) newErrors.image = 'Preview image is required';

    setErrors(newErrors);
  }, [country, address, city, state, lat, lng, description, name, price, url]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // setErrors({});

    setFormSubmitted(true);

    if (!url[0].length) {
      setImageErrors('Preview image is required.');
    } else {
      dispatch(
        createNewSpot({
          address,
          city,
          state,
          country,
          lat,
          lng,
          name,
          description,
          price,
        })
      )
        .then((res) => {
          if (res && res.id) {
            const spotId = res.id;

            const validUrls = url.filter((imageUrl) => imageUrl.trim() !== '');

            let spotImg;

            validUrls.map((imageUrl, i) => {
              if (i <= 0) {
                spotImg = {
                  url: imageUrl,
                  preview: true,
                };
              } else {
                spotImg = {
                  url: imageUrl,
                  preview: false,
                };
              }
              dispatch(addNewSpotImage(spotImg, spotId));
            });

            // if (!url[0].length) {
            //   setImageErrors('Preview image is required.');
            // } else {
            //   setFormSubmitted(false);
            //   navigate(`/spots/${spotId}`);
            // }
            setFormSubmitted(false);
            navigate(`/spots/${spotId}`);
          }
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.message) {
            setErrors(data.errors);
          }
          if (url[0] === '') {
            setImageErrors('Preview image is required.');
          }
        });
    }
  };

  return (
    <>
      <h1>Create a New Spot</h1>

      <form onSubmit={handleSubmit}>
        <h2>Where&#39;s your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <label>
          Country
          {formSubmitted && errors.country && (
            <p className="error">Country is required</p>
          )}
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          Street Address
          {formSubmitted && errors.address && (
            <p className="error">Address is required</p>
          )}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <div>
          <label>
            City
            {formSubmitted && errors.city && (
              <p className="error">City is required</p>
            )}
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          ,
          <label>
            State
            {formSubmitted && errors.state && (
              <p className="error">State is required</p>
            )}
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Latitude
            {formSubmitted && errors.lat && (
              <p className="error">Latitude is required</p>
            )}
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </label>
          ,
          <label>
            Longitude
            {formSubmitted && errors.lng && (
              <p className="error">Longitude is required</p>
            )}
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </label>
        </div>
        <hr />
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <textarea
          name=""
          id=""
          cols="60"
          rows="6"
          value={description}
          placeholder="Please write at least 30 characters"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {formSubmitted && errors.description && (
          <p className="error">Description needs a minimum of 30 characters</p>
        )}
        <hr />
        <h2>Create a title for your spot</h2>
        <p>
          Catch guest&#39;s attention with a spot title that highlights what
          makes your place special.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name of your spot"
        />
        {formSubmitted && errors.name && (
          <p className="error">Name is required</p>
        )}
        <hr />
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        ${' '}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price pre night (USD)"
        />
        {formSubmitted && errors.price && (
          <p className="error">Price is required</p>
        )}
        <hr />
        <h2>Liven up your spot with photos</h2>
        <p>Submit links to at least one photo to publish your spot.</p>
        {url.map((imageUrl, index) => (
          <input
            key={index}
            type="text"
            value={imageUrl}
            onChange={(e) => {
              const newUrlArr = [...url];
              newUrlArr[index] = e.target.value;
              setUrl(newUrlArr);
            }}
            placeholder={index === 0 ? 'Preview Image URL' : 'Image URL'}
          />
        ))}
        {formSubmitted && imageErrors && (
          <p className="error">Preview image is required.</p>
        )}
        <hr />
        <button type="submit">Create Spot</button>
      </form>
    </>
  );
}
