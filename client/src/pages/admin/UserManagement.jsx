import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Skeleton } from "@mui/material";
import { adminDashboardData } from "../../constants/sampleData";
import { fileTransform } from "../../lib/features";
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrorHook } from "../../hooks/hook";

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
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];
const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/get-user`,
    "dashboard-get-user"
  );

  useErrorHook([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: fileTransform(i.avatar, 100),
        }))
      );
    }
  }, [data]);
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton />
      ) : (
        <div>
          <Table heading={"All Users"} columns={columns} row={rows} />
        </div>
      )}

      {/* <Table heading={"All Users"} columns={columns} row={rows} /> */}
    </AdminLayout>
  );
};

export default UserManagement;
