import { InputAdornment, TableBody, TableCell, TableRow, Toolbar, makeStyles } from "@material-ui/core";
import { React, useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Controls from "../../shared/components/UIElements/Controls";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import EditCategory from "./EditCategory";
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

function ManageCategory() {
  const classes = useStyles();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const res = await api({
          url: "categories",
          method: "GET",
        });
        console.log(res);
        console.log(res.categories);

        // if(res.success) {
        // console.log("Hello ", res)
        res.categories.forEach((element) => {
          element.key = element._id;
        });

        // console.log(res.categories);
        setCategoryData(res.categories);
        // console.log(categoryData);
        setLoading(false);

        // }
      } catch (error) {
        console.log("error: " + error);
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [api]);

  const headCells = [
    { id: "name", label: "Category Name" },
    { id: "description", label: "Description" },
    
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const handleSearch = e => {
    let target = e.target;
    setFilterFn({
        fn: items => {
            if (target.value === "")
                return items;
            else
                return items.filter(x => x.name.toLowerCase().includes(target.value));
        }
    })
}

  // const [records, setRecords] = useState(null)

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(categoryData, headCells, filterFn);

  return (
    <>
      <Toolbar>
        <Controls.Input
          label="Search Categorys"
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
        <Link to="/createCategory">
        <Controls.Button
          text="Add New"
          variant="outlined"
          startIcon={<AddIcon />}
          className={classes.newButton}
        />
        </Link>
      </Toolbar>
      {/* <Link to="/createCategory">
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
              <TableCell>{item.description}</TableCell>
              
              <TableCell>
                <Link to={"/editCategory/" + item.key}>
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

export default ManageCategory;
