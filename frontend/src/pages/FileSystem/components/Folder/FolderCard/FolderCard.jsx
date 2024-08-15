import PropTypes from "prop-types";

import "../../FileSystemCard.css";
import { useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import {
  CurrentInfoSideBarItemContext,
  CurrentSignedInUserContext,
} from "../../../../../constants";

function FolderCard(props) {
  const { id, name } = props.folder;
  const [currentUser] = useContext(CurrentSignedInUserContext);
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
    let folder = {
      ...props.folder,
      path:
        location.pathname == `/${currentUser.username}`
          ? "/"
          : location.pathname.substring(
              location.pathname.split("/", 2).join("/").length + 1
            ),
    };
    setCurrentInfo({ type: "side-folder", data: folder });
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
