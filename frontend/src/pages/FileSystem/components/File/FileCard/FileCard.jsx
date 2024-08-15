import PropTypes from "prop-types";
import "../../FileSystemCard.css";
import {
  CurrentInfoSideBarItemContext,
  CurrentSignedInUserContext,
  MAIN_URL,
  sizeSizeConversionHandler,
} from "../../../../../constants";
import { useContext } from "react";
import axios from "axios";
function FileCard(props) {
  const { id, name, path, creationDate, size } = props.file;
  const [, setCurrentInfo] = useContext(CurrentInfoSideBarItemContext);
  const [currentUser] = useContext(CurrentSignedInUserContext);

  /**
   * @param {React.MouseEvent} e
   */
  const handleContextMenu = (e) => {
    e.preventDefault();
    setCurrentInfo({ type: "file", data: props.file });
  };

  const handleMouseClick = () => {
    if (!confirm(`Do you want to download ${name}?`)) return;

    axios
      .post(
        `${MAIN_URL}/${currentUser.username}${
          path !== "/" ? path : ""
        }/file-${name}`,
        { type: "show" },
        {
          headers: {
            Authorization: currentUser.id,
          },
          responseType: "blob",
        }
      )
      .then((res) => {
        if (res.status != 200) return alert("error", res.data.err);
        var data = new Blob([res.data]);

        var downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(data);
        downloadLink.download = name;
        downloadLink.click();
        downloadLink.remove();
      })
      .catch((err) => (err ? alert(err) : null));
  };

  return (
    <div
      className="FileSystemCard"
      onClick={handleMouseClick}
      onContextMenu={(e) => handleContextMenu(e)}
    >
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
