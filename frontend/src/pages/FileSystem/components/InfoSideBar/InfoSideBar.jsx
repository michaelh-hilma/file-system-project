import { useContext, useRef, useState } from "react";
import {
  CurrentInfoSideBarItemContext,
  CurrentSignedInUserContext,
  RefreshFileSystemDataContext,
  sizeSizeConversionHandler,
} from "../../../../constants";

import "./InfoSideBar.css";
import axios from "axios";
import { useNavigate } from "react-router";

function InfoSideBar() {
  const [currentUser] = useContext(CurrentSignedInUserContext);
  const refreshData = useContext(RefreshFileSystemDataContext);
  const [currentItem, setCurrentItem] = useContext(
    CurrentInfoSideBarItemContext
  );
  let itemData = currentItem.data;

  const itemNameRef = useRef();
  const itemPathRef = useRef();
  const errorRef = useRef();

  const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [isEditingFilePath, setIsEditingFilePath] = useState(false);

  const navigate = useNavigate();

  const exitInfoSideBar = () => {
    setIsEditingFileName(false);
    setIsEditingFilePath(false);
    errorRef.current.contentText = "";
    setCurrentItem({});
  };

  const errorHandler = (err) => {
    if (err) {
      alert("Something went wrong, please try again later.");
      exitInfoSideBar();
      console.log(err);
    }
  };

  const AuthenticationHeader = () => {
    return {
      headers: {
        Authorization: currentUser.id,
      },
    };
  };

  const getItemWithPath = () =>
    `${currentUser.username}${itemData.path}/${
      currentItem.type != "file" ? "folder" : "file"
    }-${itemData.id}`;

  const PostData = (data) =>
    axios
      .post(getItemWithPath(), data, AuthenticationHeader())
      .catch(errorHandler);

  const changeItemName = () => {
    setIsEditingFileName(false);
    PostData({
      newName: itemNameRef.current.value,
    }).then((res) => {
      setCurrentItem((item) => {
        return { ...item, data: res.data };
      });
      refreshData();
    });
  };

  const deleteItem = () => {
    axios
      .delete(getItemWithPath(), AuthenticationHeader())
      .then(() => {
        setCurrentItem({});
        refreshData();
      })
      .catch(errorHandler);
  };
  const copyItem = () => {
    PostData({ type: "copy" }).then(() => {
      setCurrentItem({});
      refreshData();
    });
  };

  const moveItem = () => {
    PostData({ path: itemPathRef.current.value })
      .then((res) =>
        res.status != 404
          ? setIsEditingFilePath(false)
          : (errorRef.current.contentText = "Could not find directory.")
      )
      .then(() =>
        currentItem.type === "folder"
          ? navigate(itemPathRef.current.value)
          : undefined
      );
  };

  return itemData && itemData.id ? (
    <div className="InfoSideBarBackgroundBlur" onDoubleClick={exitInfoSideBar}>
      <div
        className={`InfoSideBar ${
          itemData && itemData.id ? "OpenInfoSideBar" : null
        }`}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div className="exit" onClick={exitInfoSideBar}>
          &#10005;
        </div>
        <div className={`svg ${currentItem.type}`}></div>
        <div className="itemName">
          {isEditingFileName ? (
            <div style={{ display: "flex" }}>
              <input
                ref={itemNameRef}
                className="Header"
                type="text"
                defaultValue={itemData.name}
                onKeyDown={(e) => (e.key === "Enter" ? changeItemName() : true)}
                autoFocus
              />
              <button onClick={changeItemName}>&#10003;</button>
            </div>
          ) : (
            <div
              onDoubleClick={() => setIsEditingFileName(true)}
              className="Header"
            >
              {itemData.name}
            </div>
          )}
        </div>
        {currentItem.type !== "side-folder" ? (
          <div className="content">
            <div className="path">
              <span>Located at:</span> {itemData.path}
            </div>
            <div className="creationDate">
              <span>Date of creation:</span>{" "}
              {new Date(itemData.creationDate).toDateString()}
            </div>
            {currentItem.type === "file" ? (
              <div className="size">
                <span>File size:</span>{" "}
                {`${sizeSizeConversionHandler(itemData.size)}`}
              </div>
            ) : (
              <div className="contains">
                <div>Files: {`${itemData.contains.files.length}`}</div>
                <div>Folders: {`${itemData.contains.folders.length}`}</div>
              </div>
            )}
          </div>
        ) : undefined}
        <div className="id">ID: {itemData.id}</div>
        <div className="actions">
          <button onClick={deleteItem} className="delete">
            &#128465; Delete
          </button>
          <button onClick={copyItem} className="duplicate">
            &#128203; Duplicate
          </button>
          <button
            onClick={() => setIsEditingFilePath((prevEdit) => !prevEdit)}
            className="move"
          >
            &#10132; Move
          </button>
          <div className="input">
            <input
              ref={itemPathRef}
              disabled={!isEditingFilePath}
              onKeyDown={(e) => (e.key === "Enter" ? moveItem() : true)}
              defaultValue={
                isEditingFilePath
                  ? itemData.path.substring(itemData.path.indexOf("/home"))
                  : undefined
              }
            />
            <button className="confirm" onClick={moveItem}>
              &#10003;
            </button>
          </div>
          <div ref={errorRef} className="error"></div>
        </div>
      </div>
    </div>
  ) : (
    false
  );
}

export default InfoSideBar;
