import PropTypes from "prop-types";

import "../../FileSystemCard.css";
import { useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import { CurrentInfoSideBarItemContext } from "../../../../../constants";

function FolderCard(props) {
  const { id, name } = props.folder;

  const [, setCurrentInfo] = useContext(CurrentInfoSideBarItemContext);

  const navigate = useNavigate();
  const location = useLocation();
  const folderClickHandler = () => navigate(`${location.pathname}/${name}`);
  /**
   *
   * @param {React.MouseEvent} e
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    setCurrentInfo({ type: "side-folder", data: props.folder });
  };
  return (
    <div
      onClick={folderClickHandler}
      onContextMenu={(e) => handleContextMenu(e)}
      className="FileSystemCard"
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
