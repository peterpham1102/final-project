import {
  InputAdornment,
  TableBody,
  TableCell,
  TableRow,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import { React, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Controls from "../../shared/components/UIElements/Controls";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditStore from "./EditStore";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";
import api from "../../shared/util/api";
import useTable from "../../shared/hooks/useTable";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));

function ManageStore() {
  const classes = useStyles();
  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: "stores",
          method: "GET",
        });
        console.log(res);
        console.log(res.stores);

        // if(res.success) {
        res.stores.forEach((element) => {
          element.key = element._id;
        });

        // console.log(res.stores);
        setStoreData(res.stores);
        // console.log(storeData);
        setLoading(false);

        // }
      } catch (error) {
        console.log("error: " + error);
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [api]);

  const headCells = [
    { id: "name", label: "Store Name" },
    { id: "location", label: "Store Address" },
    { id: "description", label: "Description" },
    { id: "rating", label: "Rating" },
    { id: "image", label: "Image" },
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value == "")
                return items;
            else
                return items.filter(x => x.name.toLowerCase().includes(target.value));
        }
    })
  }
  // const [records, setRecords] = useState(null)

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(storeData, headCells, filterFn);

  return (
    <>
      <Toolbar>
        <Controls.Input
          label="Search Users"
          className={classes.searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
        />
      </Toolbar>
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.key}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.rating}</TableCell>
              <TableCell>
                <img src={item.image} height="50px" width="50px" />
              </TableCell>
              <TableCell>
                <Link to={"/editStore/" + item.key}>
                  <Controls.ActionButton>
                    <EditIcon />
                  </Controls.ActionButton>
                </Link>
                <Link>
                  <Controls.ActionButton>
                    <DeleteIcon />
                  </Controls.ActionButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />
    </>
  );
}

export default ManageStore;
