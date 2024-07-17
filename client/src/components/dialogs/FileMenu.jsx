import { Menu } from "@mui/material";
import React from "react";

const FileMenu = ({ anchorEl }) => {
  return (
    <Menu anchorEl={anchorEl} open={false}>
      <div style={{ width: "10rem" }}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi obcaecati
        eos aut natus quod quos, et consectetur id, assumenda ipsum quae,
        debitis eaque autem. Delectus voluptate cumque, eos officia laborum
        assumenda aperiam, vero accusamus totam voluptas earum. Quod iure natus
        nobis pariatur impedit omnis accusamus nulla, commodi nemo neque quas?
      </div>
    </Menu>
  );
};

export default FileMenu;
