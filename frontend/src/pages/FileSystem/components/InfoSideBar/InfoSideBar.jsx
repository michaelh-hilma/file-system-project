import { useContext, useRef, useState } from "react";
import {
  CurrentInfoSideBarItemContext,
  CurrentSignedInUserContext,
  MAIN_URL,
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
    if (err && typeof err.response !== "undefined") {
      if (err.response) errorRef.current.textContent = err.response.data;
      else {
        alert(
          "Something went wrong with the actions u just made, please try again later.\n"
        );
        exitInfoSideBar();
      }
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
    `${MAIN_URL}/${currentUser.username}${
      itemData.path !== "/home" ? `${itemData.path.substring(5)}/` : "/"
    }${currentItem.type != "file" ? "folder" : "file"}-${itemData.name}`;

  const PostData = (data) =>
    axios
      .post(getItemWithPath(), data, AuthenticationHeader())
      .catch(errorHandler);
  const PatchData = (data) =>
    axios
      .patch(getItemWithPath(), data, AuthenticationHeader())
      .catch(errorHandler);

  const changeItemName = () => {
    setIsEditingFileName(false);
    PatchData({
      name: itemNameRef.current.value,
    }).then((res) => {
      if (res) {
        setCurrentItem((item) => {
          return { ...item, data: res.data };
        });
        refreshData();
      }
    });
  };

  const deleteItem = () => {
    axios
      .delete(getItemWithPath(), AuthenticationHeader())
      .then(() => {
        if (currentItem.type === "folder") navigate(currentItem.path);
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
    PatchData({
      path: itemPathRef.current.value.replace("/home", ""),
    }).then((res) => {
      if (res && res.status != 404) {
        setIsEditingFilePath(false);
        setCurrentItem({});
        refreshData();
      } else errorRef.current.contentText = "Could not find directory.";
    });
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
          {currentItem.type === "file" ? (
            <>
              <button onClick={copyItem} className="duplicate">
                &#128203; Duplicate
              </button>
              <button
                onClick={() => setIsEditingFilePath((prevEdit) => !prevEdit)}
                className="move"
              >
                &#10132; Move
              </button>
            </>
          ) : (
            <></>
          )}
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
