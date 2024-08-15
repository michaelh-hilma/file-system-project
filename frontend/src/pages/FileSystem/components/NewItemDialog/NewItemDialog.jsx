import { useContext, useEffect, useRef, useState } from "react";
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

  const location = useLocation();

  const getItemWithPath = () =>
    `${MAIN_URL}/${currentUser.username}${location.pathname.substring(
      location.pathname.indexOf("/")
    )}/${choosenOption}`;

  const createNewItem = () => {
    if (choosenOption == "") return;
    if (
      !itemName.current.value ||
      itemName.current.value == "" ||
      itemName.current.value.match(/^ *$/) !== null
    )
      return (itemName.current.style.border = "2px solid red");
    axios
      .post(
        getItemWithPath(),
        choosenOption === "file"
          ? { name: itemName.current.value, data: itemData.current.value }
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
          alert("something went wrong, please try again later.");
          setIsCreating(false);
          setChoosenOption("");
          itemName.current = "";
          itemData.current = "";
          console.log(err);
        }
      });
  };
  useEffect(() => console.log(isCreating), [isCreating]);
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
            <input
              ref={itemName}
              type="text"
              placeholder={`New ${choosenOption}`}
            />
            {choosenOption == "file" ? (
              <>
                <label className="newFileInput" htmlFor="fileinput">
                  Click to upload
                </label>
                <input ref={itemData} id="fileinput" type="file" />
              </>
            ) : (
              <></>
            )}
            <button onClick={createNewItem} className="confirm">
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default NewItemDialog;
