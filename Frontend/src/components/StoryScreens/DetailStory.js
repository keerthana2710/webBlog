import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css";
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs';
import CommentSidebar from '../CommentScreens/CommentSidebar';
import api from '../../api';
import config from '../../config';
const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeUser, setActiveUser] = useState({});
  const [story, setStory] = useState({});
  const [storyLikeUser, setStoryLikeUser] = useState([]);
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const slug = useParams().slug;
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getDetailStory = async () => {
      setLoading(true);
      let activeUser = {};
      try {
        const { data } = await api.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user;

        if (isMounted) {
          setActiveUser(activeUser);
        }
      } catch (error) {
        if (isMounted) {
          setActiveUser({});
        }
      }

      try {
        const { data } = await api.post(`/story/${slug}`, { activeUser });
        if (isMounted) {
          setStory(data.data);
          setLikeStatus(data.likeStatus);
          setLikeCount(data.data.likeCount);
          setStoryLikeUser(data.data.likes);
          setLoading(false);

          const story_id = data.data._id;
          if (activeUser.readList) {
            setStoryReadListStatus(activeUser.readList.includes(story_id));
          }
        }
      } catch (error) {
        if (isMounted) {
          setStory({});
          navigate("/not-found");
        }
      }
    };

    getDetailStory();

    return () => { isMounted = false; }; // Cleanup function

  }, [slug]);

  const handleLike = async () => {
    setLikeStatus(prevStatus => !prevStatus);

    try {
      const { data } = await api.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setLikeCount(data.data.likeCount);
      setStoryLikeUser(data.data.likes);
    } catch (error) {
      setStory({});
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post")) {
      try {
        await api.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`;
  };

  const navigateEdit = (editPage)=>{
    navigate(`/story/${editPage}/edit`)
  }
  const addStoryToReadList = async () => {
    try {
      const { data } = await api.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setStoryReadListStatus(data.status);
      document.getElementById("readListLength").textContent = data.user.readListLength;
    } catch (error) {
      console.log(error);
    }
  };

  // Construct the image URL and log it for debugging
  const imageUrl = `${config.API_BASE_URL}/storyImages/${story.image}`;
  console.log("Image URL:", imageUrl); // Check the URL

  return (
    <>
      {loading ? <Loader /> :
        <div className='Inclusive-detailStory-page'>
          <div className="top_detail_wrapper">
            <Link to={'/'}>
              <FiArrowLeft />
            </Link>
            <h5>{story.title}</h5>
            <div className='story-general-info'>
              <ul>
                {story.author &&
                  <li className='story-author-info'>
                    <img 
                      src={`${config.API_BASE_URL}/userPhotos/${story.author.photo}`} 
                      alt={story.author.username} 
                    />
                    <span className='story-author-username'>{story.author.username}</span>
                  </li>
                }
                <li className='story-createdAt'>
                  {editDate(story.createdAt)}
                </li>
                <b>-</b>
                <li className='story-readtime'>
                  {story.readtime} min read
                </li>
              </ul>

              {!activeUser.username &&
                <div className='comment-info-wrap'>
                  <i onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
                    <FaRegComment />
                  </i>
                  <b className='commentCount'>{story.commentCount}</b>
                </div>
              }

              {activeUser && story.author &&
                story.author._id === activeUser._id &&
                <div className="top_story_transactions">
                  {/*<Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                    <FiEdit />
                    </Link>*/}
                   <span className='editStoryLink' onClick={navigateEdit(story.slug)}>
                    <FiEdit />
                   </span>
                  <span className='deleteStoryLink' onClick={handleDelete}>
                    <RiDeleteBin6Line />
                  </span>
                </div>
              }
            </div>
          </div>

          <div className="CommentFieldEmp">
            <CommentSidebar 
              slug={slug} 
              sidebarShowStatus={sidebarShowStatus} 
              setSidebarShowStatus={setSidebarShowStatus}
              activeUser={activeUser}
            />
          </div>

          <div className='story-content'>
            <div className="story-banner-img">
              <img 
                src={imageUrl} 
                alt={story.title} 
                onError={(e) => e.target.src = '/path/to/placeholder-image.jpg'} // Replace with your placeholder image
              />
            </div>
            <div className='content' dangerouslySetInnerHTML={{ __html: story.content }} />
          </div>

          {activeUser.username &&
            <div className='fixed-story-options'>
              <ul>
                <li>
                  <i onClick={handleLike}>
                    {likeStatus ? <FaHeart color="#0063a5" /> : <FaRegHeart />}
                  </i>
                  <b className='likecount' style={likeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}>
                    {likeCount}
                  </b>
                </li>
                <li>
                  <i onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
                    <FaRegComment />
                  </i>
                  <b className='commentCount'>{story.commentCount}</b>
                </li>
              </ul>

              <ul>
                <li>
                  <i onClick={addStoryToReadList}>
                    {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> : <BsBookmarkPlus />}
                  </i>
                </li>
                <li className='BsThreeDots_opt'>
                  <i>
                    <BsThreeDots />
                  </i>
                  {activeUser && story.author._id === activeUser._id &&
                    <div className="delete_or_edit_story">
                      <Link className='editStoryLink' to={`/story/${story.slug}/edit`}>
                        <p>Edit Story</p>
                      </Link>
                      <div className='deleteStoryLink' onClick={handleDelete}>
                        <p>Delete Story</p>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          }
        </div>
      }
    </>
  );
};

export default DetailStory;
