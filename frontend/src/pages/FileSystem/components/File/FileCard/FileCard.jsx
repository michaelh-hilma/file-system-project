import PropTypes from "prop-types";
import "../../FileSystemCard.css";
import {
  CurrentInfoSideBarItemContext,
  sizeSizeConversionHandler,
} from "../../../../../constants";
import { useContext } from "react";
function FileCard(props) {
  const { id, name, path, creationDate, size } = props.file;
  const [, setCurrentInfo] = useContext(CurrentInfoSideBarItemContext);

  /**
   * @param {React.MouseEvent} e
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    setCurrentInfo({ type: "file", data: props.file });
  };
  /**
   * @param {React.MouseEvent} e
   */
  return (
    <div className="FileSystemCard" onContextMenu={(e) => handleContextMenu(e)}>
      <div className="svg file"></div>
      <div className="content">
        <div className="name">{name}</div>

        <div className="FileSubTitle">
          <div className="path">{path}</div>
          <div className="creationdate">
            {new Date(creationDate).toDateString()}
          </div>
          <div className="size">Size: {sizeSizeConversionHandler(size)}</div>
        </div>

        <div className="id">File ID: {id}</div>
      </div>
    </div>
  );
}

FileCard.propTypes = { file: PropTypes.object };

export default FileCard;
