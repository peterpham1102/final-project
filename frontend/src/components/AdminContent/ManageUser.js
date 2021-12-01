import { InputAdornment, TableBody, TableCell, TableRow, Toolbar, makeStyles } from "@material-ui/core";
import { React, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Controls from "../../shared/components/UIElements/Controls";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import EditUser from "./EditUser";
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

function ManageUser() {
  const classes = useStyles();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: "users",
          method: "GET",
        });
        console.log(res);
        console.log(res.users);

        // if(res.success) {
        // console.log("Hello ", res)
        res.users.forEach((element) => {
          element.key = element._id;
        });

        // console.log(res.users);
        setUserData(res.users);
        // console.log(userData);
        setLoading(false);

        // }
      } catch (error) {
        console.log("error: " + error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, [api]);

  const headCells = [
    { id: "name", label: "Full Name" },
    { id: "email", label: "Email Address" },
    { id: "phone", label: "Phone Number" },
    { id: "role", label: "Role" },
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value === "")
                return items;
            else
                return items.filter(x => x.email.toLowerCase().includes(target.value));
        }
    })
}

  // const [records, setRecords] = useState(null)

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(userData, headCells, filterFn);

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
        <Link to="/createUser">
        <Controls.Button
          text="Add New"
          variant="outlined"
          startIcon={<AddIcon />}
          className={classes.newButton}
        />
        </Link>
      </Toolbar>
      {/* <Link to="/createUser">
        <Controls.Button
          className={classes.newButton}
          text="Add New"
          variant="outlined"
          startIcon={<AddIcon />}
        ></Controls.Button>
      </Link> */}
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map((item) => (
            <TableRow key={item.key}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>
                <Link to={"/editUser/" + item.key}>
                  <Controls.ActionButton>
                    <EditIcon />
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

export default ManageUser;
