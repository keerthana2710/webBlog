// import React, { useEffect, useState, useRef, useContext } from 'react';
// import axios from 'axios';
// import Loader from '../GeneralScreens/Loader';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { AuthContext } from "../../Context/AuthContext";
// import { AiOutlineUpload } from 'react-icons/ai'
// import '../../Css/EditStory.css'
// import api from '../../api';

// const EditStory = () => {
//     const { config } = useContext(AuthContext)
//     const slug = useParams().slug
//     const imageEl = useRef(null)
//     const [loading, setLoading] = useState(true)
//     const [story, setStory] = useState({})
//     const [image, setImage] = useState('')
//     const [previousImage, setPreviousImage] = useState('')
//     const [title, setTitle] = useState('')
//     const [content, setContent] = useState('')
//     const [success, setSuccess] = useState('')
//     const [error, setError] = useState('')
//     const navigate = useNavigate()

//     useEffect(() => {

//         const getStoryInfo = async () => {
//             setLoading(true)
//             try {
//                 const { data } = await api.get(`/story/editStory/${slug}`, config)
//                 setStory(data.data)
//                 setTitle(data.data.title)
//                 setContent(data.data.content)
//                 setImage(data.data.image)
//                 setPreviousImage(data.data.image)
//                 setLoading(false)
//             }
//             catch (error) {
//                 navigate("/")
//             }
//         }
//         getStoryInfo()
//     }, [])

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formdata = new FormData()
//         formdata.append("title", title)
//         formdata.append("content", content)
//         formdata.append("image", image)
//         formdata.append("previousImage", previousImage)

//         try {
//             const { data } = await api.put(`/story/${slug}/edit`, formdata, config)

//             setSuccess('Edit Story successfully ')

//             setTimeout(() => {
//                 navigate('/')
//             }, 2500)

//         }
//         catch (error) {
//             setTimeout(() => {
//                 setError('')
//             }, 4500)
//             setError(error.response.data.error)
//         }
//     }



//     return (
//         <>
//             {
//                 loading ? <Loader /> : (
//                     <div className="Inclusive-editStory-page ">
//                         <form onSubmit={handleSubmit} className="editStory-form">

//                             {error && <div className="error_msg">{error}</div>}
//                             {success && <div className="success_msg">
//                                 <span>
//                                     {success}
//                                 </span>
//                                 <Link to="/">Go home</Link>
//                             </div>}

//                             <input
//                                 type="text"
//                                 required
//                                 id="title"
//                                 placeholder="Title"
//                                 onChange={(e) => setTitle(e.target.value)}
//                                 value={title}
//                             />

//                             <CKEditor
//                                 editor={ClassicEditor}
//                                 onChange={(e, editor) => {
//                                     const data = editor.getData();
//                                     setContent(data)
//                                 }}
//                                 data={content}

//                             />

//                             <div className="currentlyImage">
//                                 <div className="absolute">
//                                     Currently Image
//                                 </div>
//                                 <img src={`${config.API_BASE_URL}/storyImages/${previousImage}`} alt="storyImage" />
//                             </div>
//                             <div className="StoryImageField">
//                                 <AiOutlineUpload />
//                                 <div className="txt">

//                                     {image === previousImage ? "    Change the image in your story " :
//                                         image.name}

//                                 </div>
//                                 <input
//                                     name="image"
//                                     type="file"
//                                     ref={imageEl}
//                                     onChange={(e) => {
//                                         setImage(e.target.files[0])
//                                     }}
//                                 />
//                             </div>

//                             <button type='submit' className='editStory-btn'
//                             >Edit Story </button>
//                         </form>

//                     </div>
//                 )
//             }
//         </>
//     )
// }

// export default EditStory;
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai';
import '../../Css/EditStory.css';
import api from '../../api';
import Loader from '../GeneralScreens/Loader';

const EditStory = () => {
  const { config } = useContext(AuthContext);
  const { slug } = useParams();
  const imageEl = useRef(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState({});
  const [image, setImage] = useState('');
  const [previousImage, setPreviousImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getStoryInfo = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/story/editStory/${slug}`, config);
        setStory(data.data);
        setTitle(data.data.title);
        setContent(data.data.content);
        setImage(data.data.image);
        setPreviousImage(data.data.image);
        setLoading(false);
      } catch (error) {
        navigate("/");
      }
    };
    getStoryInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // Append the image file only if it's changed
    if (image && image !== previousImage) {
      formData.append("image", image);
    }

    formData.append("previousImage", previousImage);

    try {
      const { data } = await api.put(`/story/${slug}/edit`, formData, config);
      setSuccess('Story edited successfully');

      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to edit story");
      setTimeout(() => {
        setError('');
      }, 4500);
    }
  };

  return (
    <>
      {loading ? <Loader /> : (
        <div className="Inclusive-editStory-page ">
          <form onSubmit={handleSubmit} className="editStory-form">
            {error && <div className="error_msg">{error}</div>}
            {success && (
              <div className="success_msg">
                <span>{success}</span>
                <Link to="/">Go home</Link>
              </div>
            )}

            <input
              type="text"
              required
              id="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <CKEditor
              editor={ClassicEditor}
              onChange={(e, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
              data={content}
            />

            <div className="currentlyImage">
              <div className="absolute">Current Image</div>
              <img src={`${config.API_BASE_URL}/storyImages/${previousImage}`} alt="storyImage" />
            </div>

            <div className="StoryImageField">
              <AiOutlineUpload />
              <div className="txt">
                {image === previousImage ? "Change the image in your story" : image?.name}
              </div>
              <input
                name="image"
                type="file"
                ref={imageEl}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button type="submit" className="editStory-btn">
              Edit Story
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditStory;
