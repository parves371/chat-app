import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material/";
import { bgGradient, matblack } from "../constants/color";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";

import AvaterCard from "../components/shared/AvaterCard";
import { sampleChat, sampleUser } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";
const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDailog")
);
const AddMemberDailog = lazy(() =>
  import("../components/dialogs/AddMemberDailog")
);

const isAddmember = false;
const Groups = () => {
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDailog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdate, setGroupNameUpdate] = useState("");

  const navigateBack = () => {
    navigate("/");
  };

  const handleMenu = () => setIsMobileOpen((prev) => !prev);

  const handleMenuClose = () => setIsMobileOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
  };

  const OpenConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const CloseConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    console.log("add");
  };

  const deleteHandler = () => {
    console.log("delete");
  };
  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdate(`"Group Name" ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdate("");
      // setIsEdit(false);
    };
  });

  const iconBtn = (
    <>
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          position: "fixed",
          right: "2rem",
          top: "2rem",
        }}
      >
        <IconButton onClick={handleMenu}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matblack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdate}
            onChange={(e) => setGroupNameUpdate(e.target.value)}
          />
          <IconButton onClick={updateGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4" fontWeight={"bold"}>
            {groupName}
          </Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{ sm: "row", sx: "column-reverse" }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={OpenConfirmDeleteHandler}
      >
        Delete Groupe
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Members
      </Button>
    </Stack>
  );

  const removeMemberHandler = (id) => {};
  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundImage: bgGradient,
        }}
      >
        <GroupsList groups={sampleChat} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {iconBtn}
        {groupName && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              variant="body1"
              alignSelf={"flex-start"}
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{ xs: "0", sm: "1rem", md: "1rem 4rem" }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {sampleUser.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    boxShadow: "0 0  0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                  handler={removeMemberHandler}
                />
              ))}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>
      {isAddmember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDailog />
        </Suspense>
      )}

      {confirmDeleteDailog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDailog}
            handleclose={CloseConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{ display: { xs: "block", sm: "none" } }}
        open={isMobileOpen}
        onClose={handleMenuClose}
      >
        <GroupsList w={"50vw"} groups={sampleChat} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w, groups = [], chatId }) => {
  return (
    <Stack width={w}>
      {groups.length > 0 ? (
        groups.map((group) => (
          <GroupsListItems group={group} key={group._id} chatId={chatId} />
        ))
      ) : (
        <Typography textAlign="center">No groups found.</Typography>
      )}
    </Stack>
  );
};

const GroupsListItems = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }
      }}
    >
      <Stack direction={"row"} alignItems={"center"}>
        <AvaterCard avater={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
