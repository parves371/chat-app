import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvaterCard from "../../components/shared/AvaterCard";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrorHook } from "../../hooks/hook";
import { fileTransform } from "../../lib/features";
const columns = [
  {
    field: "id",
    headerName: "Id",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avater",
    headerName: "Avater",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvaterCard avater={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    renderCell: (params) => (
      <AvaterCard max={100} avater={params.row.members} />
    ),
    width: 400,
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" spacing={"1rem"} alintItems="center">
        <Avatar src={params.row.creator.avatar} alt={params.row.creator.name} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];
const ChatManagement = () => {
  const [rows, setRows] = useState([]);

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/get-chats`,
    "dashboard-get-chats"
  );

  useErrorHook([
    {
      isError: error,
      error: error,
    },
  ]);

  useEffect(() => {
    if (data) {
      setRows(
        data?.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((j) => fileTransform(j, 50)),
          members: i.members.map((j) => fileTransform(j.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: fileTransform(i.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <div>
          <Table heading={"All Chats"} columns={columns} row={rows} />
        </div>
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
