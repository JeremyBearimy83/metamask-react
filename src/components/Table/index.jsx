import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns = [
  { field: "asset", headerName: "Asset", width: 200 },
  {
    field: "apy",
    headerName: "APY",
    width: 200,
    editable: false,
  },
  {
    field: "totalAssets",
    headerName: "Total Assets",
    width: 200,
    editable: false,
  },
  {
    field: "balance",
    headerName: "Balance",
    // type: "number",
    width: 200,
    editable: false,
  },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];

const rows = [
  {
    id: 1,
    asset: "Curv Yurn",
    apy: "35.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: "Jon",
    age: 35,
  },
  {
    id: 2,
    asset: "Curv BUSD",
    apy: "34.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: "Cersei",
    age: 42,
  },
  {
    id: 3,
    asset: "LUSD",
    apy: "14.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: "Jaime",
    age: 45,
  },
  { id: 4, asset: "Curv Yurn", lastName: "Stark", firstName: "Arya", age: 16 },
  {
    id: 5,
    asset: "Curv Yurn",
    apy: "33.4%",
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
  },
  {
    id: 6,
    asset: "Curv Yurn",
    apy: "32.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: null,
    age: 150,
  },
  {
    id: 7,
    asset: "Aave",
    apy: "31.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: "Ferrara",
    age: 44,
  },
  {
    id: 8,
    asset: "Quick Swap",
    apy: "37.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: "Rossini",
    age: 36,
  },
  {
    id: 9,
    asset: "UniSwap",
    apy: "14.4%",
    totalAssets: "$ 2,508",
    balance: "$ 0",
    firstName: "Harvey",
    age: 65,
  },
];

export default function VaultGrid() {
  return (
    <div style={{ height: 1000, width: "70%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
        checkboxSelection
        disableSelectionOnClick
        style={{ color: "white", fontSize: "1.1rem" }}
        classes={{
          menuIcon: "white",
          sortIcon: "white",
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.dark",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },

          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
      />
    </div>
  );
}
