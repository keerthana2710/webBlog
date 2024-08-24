import React from "react";
import { Link } from "react-router-dom";
import config from "../../config"; // Adjust the import path as necessary

const Story = ({ story }) => {
  const editDate = (createdAt) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December",
    ];
    const d = new Date(createdAt);
    var datestring = d.getDate() + " " + monthNames[d.getMonth()] + " ," + d.getFullYear();
    return datestring;
  };

  const truncateContent = (content) => {
    const trimmedString = content.substr(0, 73);
    return trimmedString;
  };

  const truncateTitle = (title) => {
    const trimmedString = title.substr(0, 69);
    return trimmedString;
  };

  // Use the config object to form the image URL
  const imageUrl = `${config.API_BASE_URL}/storyImages/${story.image}`;
  console.log(imageUrl); // Check the URL

  return (
    <div className="story-card">
      <Link to={`/story/${story.slug}`} className="story-link">
        <img
          className="story-image"
          src={imageUrl}
          alt={story.title}
          onError={(e) => { e.target.onerror = null; e.target.src = "/path/to/fallback-image.jpg"; }}
        />
        <div className="story-content-wrapper">
          <h5 className="story-title">
            {story.title.length > 76 ? truncateTitle(story.title) + "..." : story.title}
          </h5>
          <p
            className="story-text"
            dangerouslySetInnerHTML={{
              __html: truncateContent(story.content) + "...",
            }}
          ></p>
          <p className="story-createdAt">{editDate(story.createdAt)}</p>
        </div>
      </Link>
    </div>
  );
};

export default Story;
