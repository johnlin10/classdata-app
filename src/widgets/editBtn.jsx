// react
import { useEffect, useState } from "react";
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "./css/editBtn.module.scss";

{
  /* 
<EditBtn
  theme={props.theme}
  btnIcon={}
  btnContent=""
  btnClick={() => function()}
/> 
*/
}
export default function EditBtn(props) {
  return (
    <div
      className={`${props.theme}${props.theme ? " " : ""}${css.btn}${
        props.openActv ? " actv" : ""
      }`}
      onClick={props.btnClick}>
      {props.openActv ? (
        <FontAwesomeIcon
          icon="fa-solid fa-xmark"
          style={{ marginRight: "6px" }}
        />
      ) : (
        props.btnIcon
      )}
      <p>{props.openActv ? "關閉" : props.btnContent}</p>
    </div>
  );
}
