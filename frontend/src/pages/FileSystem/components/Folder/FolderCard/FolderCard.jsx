import PropTypes from "prop-types";

import "../../FileSystemCard.css";
import { useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useRef } from "react";
import {
  CurrentInfoSideBarItemContext,
  CurrentSignedInUserContext,
  getInfo,
} from "../../../../../constants";

function FolderCard(props) {
  const { id, name } = props.folder;
  const [currentUser] = useContext(CurrentSignedInUserContext);
  const [, setCurrentInfo] = useContext(CurrentInfoSideBarItemContext);

  const cardRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cardAnimationEnded = () => {
      cardRef.current.classList.remove("showed");
    };

    const cardAnimationEvent = cardRef.current.addEventListener(
      "animationend",
      cardAnimationEnded
    );

    return () => removeEventListener("animationend", cardAnimationEvent);
  });
  const folderClickHandler = () =>
    navigate(`${location.pathname}/${name}`.replace(" ", "_"));
  /**
   *
   * @param {React.MouseEvent} e
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    getInfo(
      `${location.pathname}/folder-${name}`,
      currentUser.id,
      navigate
    ).then((res) =>
      res && res.status === 200
        ? setCurrentInfo({ type: "folder", data: res.data })
        : null
    );
  };
  return (
    <div
      className="showed FileSystemCard"
      onClick={folderClickHandler}
      onContextMenu={(e) => handleContextMenu(e)}
      ref={cardRef}
    >
      <div className="svg"></div>
      <div className="content">
        <div className="name">{name}</div>
        <div className="id">Folder ID: {id}</div>
      </div>
    </div>
  );
}

FolderCard.propTypes = { folder: PropTypes.object };

export default FolderCard;
