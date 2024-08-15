import { useContext, useRef, useState } from "react";
import {
  CreatingNewItemContext,
  CurrentSignedInUserContext,
  MAIN_URL,
  RefreshFileSystemDataContext,
} from "../../../../constants";

import "./NewItemDialog.css";
import axios from "axios";
import { useLocation } from "react-router";

function NewItemDialog() {
  const [isCreating, setIsCreating] = useContext(CreatingNewItemContext);
  const refreshData = useContext(RefreshFileSystemDataContext);
  const [currentUser] = useContext(CurrentSignedInUserContext);

  const [choosenOption, setChoosenOption] = useState("");

  const itemName = useRef();
  const itemData = useRef();
  const errorRef = useRef();

  const location = useLocation();

  const getItemWithPath = () =>
    `${MAIN_URL}${location.pathname.substring(
      location.pathname.indexOf("/")
    )}/${choosenOption}`;

  const createNewItem = () => {
    if (choosenOption == "") return;

    if (
      choosenOption === "folder" &&
      (!itemName.current.value ||
        itemName.current.value == "" ||
        itemName.current.value.match(/^ *$/) !== null)
    )
      return (itemName.current.style.border = "2px solid red");

    if (choosenOption === "file" && itemData.current.value === "")
      return alert("please upload a file");

    const sendPost = (fileText) => {
      axios
        .post(
          getItemWithPath(),
          choosenOption === "file"
            ? {
                name: itemData.current.files[0].name,
                data: fileText,
              }
            : { name: itemName.current.value },
          {
            headers: {
              Authorization: currentUser.id,
            },
          }
        )
        .then(() => {
          setIsCreating(false);
          setChoosenOption("");
          itemName.current = "";
          itemData.current = "";

          refreshData();
        })
        .catch((err) => {
          if (err) {
            if (err.response) errorRef.current.textContent = err.response.data;
            else {
              alert("something went wrong, please try again later.");
              setIsCreating(false);
              setChoosenOption("");
              itemName.current = "";
              itemData.current = "";
              console.log(err);
            }
          }
        });
    };
    if (choosenOption === "file") {
      const fileReader = new FileReader();
      fileReader.readAsText(itemData.current.files[0]);
      fileReader.onload = () => {
        return sendPost(fileReader.result);
      };
    } else sendPost();
  };
  return isCreating ? (
    <div className="NewItemDialogBackdrop">
      <div className="NewItemDialog">
        {choosenOption == "" ? (
          <>
            <div onClick={() => setIsCreating(false)} className="goback">
              &#10005;
            </div>
            <div className="itemPicker">
              <div
                onClick={() => setChoosenOption("folder")}
                className="folder"
              >
                <div>New Folder</div>
              </div>
              <div onClick={() => setChoosenOption("file")} className="file">
                <div>New File</div>
              </div>
            </div>
          </>
        ) : (
          <div className="newItemInput">
            <div onClick={() => setChoosenOption("")} className="goback">
              &#8592;
            </div>
            <div className={`svg ${choosenOption}`}></div>
            {choosenOption == "file" ? (
              <>
                <label className="newFileInput" htmlFor="fileinput">
                  Click to upload
                </label>
                <input ref={itemData} id="fileinput" type="file" />
              </>
            ) : (
              <input
                ref={itemName}
                type="text"
                placeholder={`New ${choosenOption}`}
              />
            )}
            <button onClick={createNewItem} className="confirm">
              Confirm
            </button>
            <div ref={errorRef} className="error"></div>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default NewItemDialog;
