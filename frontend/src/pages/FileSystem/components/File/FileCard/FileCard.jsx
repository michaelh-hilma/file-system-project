import PropTypes from "prop-types";

function FileCard(props) {
  const { id, name, path, creationDate, size } = props.file;
  return (
    <div>
      <div className="FileName">{name}</div>
      <div className="FileSubTitle">
        {path} -{" "}
        <span>
          {creationDate} - {size}
        </span>
      </div>
      <div className="FileID">{id}</div>
    </div>
  );
}

FileCard.propTypes = { file: PropTypes.object };

export default FileCard;
