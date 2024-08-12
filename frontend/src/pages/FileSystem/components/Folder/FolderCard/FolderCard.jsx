import PropTypes from "prop-types";

function FolderCard(props) {
  const { id, name } = props.folder;
  return (
    <div>
      <div className="FileName">{name}</div>
      <div className="FileID">{id}</div>
    </div>
  );
}

FolderCard.propTypes = { folder: PropTypes.object };

export default FolderCard;
