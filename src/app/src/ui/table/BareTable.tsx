import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export const BareTable = styled(Table)(() => ({
    borderCollapse: "collapse",
    background: "transparent",

    "& th, & td": {
        border: "none",
        padding: 0,
        background: "transparent",
        color: "inherit",
    },
}));

export const BareTableRow = styled(TableRow)(() => ({
    background: "transparent",

    "&:hover": {
        background: "transparent",
    },
}));

export const BareTableCell = styled(TableCell)(() => ({
    border: "none",
    padding: 0,
    background: "transparent",
    color: "inherit",
}));