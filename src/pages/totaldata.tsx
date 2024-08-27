import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SalesGetResponsTsx } from "../model/salesGetrespons";
import { EmpGetRespons } from "../model/empGetRespons";
import { salesService } from "../Service/salesService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function TotalDataPage() {
  const [datas, setData] = useState<SalesGetResponsTsx[]>([]);
  const [dataEmp, setDataEmp] = useState<EmpGetRespons[]>([]);
  const navigate = useNavigate();
  const service = new salesService();
  const [months, setMonth] = useState("0");
  const [showEmp, setShowEmp] = useState(false);
  const [showData, setShowData] = useState(true);
  const [numberCar, setnumber] = useState("0");

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    setShowData(true)
    setShowEmp(false)
    const data = await service.getAllSales();
    setData(data);
  };

  const navigateTo = () => {
    navigate(-1);
  };

  async function getEmp() {
    if(showEmp){
    setShowData(false)
     const data = await service.getempSalesbyCout(months, searchQuery,numberCar);
    setDataEmp(data);       
    }
  }

  const handleChange = async (event: SelectChangeEvent) => {
    const selectedMonth = event.target.value as string;
    setMonth(selectedMonth);
  };

  const [years] = useState(
    Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i + 543)
  );
  const [searchQuery, setSearchQuery] = useState(""+years[0]);
  const handleSearchChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
  };
  const handChange = () => {
    setShowEmp(!showEmp);
    setShowData(true);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // ความสูงเต็มของหน้าจอ
        width: "215%",
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ width: 230, marginTop: "5vh" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControl fullWidth sx={{ paddingRight: "1px" }}>
              <InputLabel id="demo-simple-select-label">เดือน</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={months}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"0"}>ทั้งหมด</MenuItem>
                <MenuItem value={"1"}>January</MenuItem>
                <MenuItem value={"2"}>February</MenuItem>
                <MenuItem value={"3"}>March</MenuItem>
                <MenuItem value={"4"}>April</MenuItem>
                <MenuItem value={"5"}>May</MenuItem>
                <MenuItem value={"6"}>June</MenuItem>
                <MenuItem value={"7"}>July</MenuItem>
                <MenuItem value={"8"}>August</MenuItem>
                <MenuItem value={"9"}>September</MenuItem>
                <MenuItem value={"10"}>October</MenuItem>
                <MenuItem value={"11"}>November</MenuItem>
                <MenuItem value={"12"}>December</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ marginLeft: "10px", width: "150px" }}>
              <InputLabel id="demo-simple-select-label">ปี</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={searchQuery}
                label="ปี"
                onChange={handleSearchChange}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "9px",
            }}
          >
            <b style={{ color: "black" }}>Option</b>
            <p style={{ color: "red", cursor: "pointer" }} onClick={callApi}>
              Reset
            </p>
          </div>
        </Box>
        <FormControlLabel
          control={<Checkbox checked={showEmp} onChange={handChange} />}
          label="ยอดขายพนักงาน"
          sx={{ color: "black" }}
        />
        <TextField  onChange={(e) => setnumber(e.target.value)} id="standard-basic" label="Number of Car" variant="standard" />
        <Button variant="contained" onClick={() => getEmp()} color="success">
          ค้นหา
        </Button>
      </Box>
      <Button
        sx={{ width: "7%", height: "100%" }}
        size="small"
        onClick={navigateTo}
        startIcon={<ArrowBackIosIcon />}
      >
        Go Back
      </Button>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "1000px",
            width: "100%",
            height: "650px",
            overflowY: "auto",
            
          }}
        >
          {showData ? (
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">month</StyledTableCell>
                  <StyledTableCell align="left">year</StyledTableCell>
                  <StyledTableCell align="left">
                    total_cars_sold
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    total_sales_amount
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datas.map((data, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {data.month}
                    </StyledTableCell>
                    <StyledTableCell align="left">{data.year}</StyledTableCell>
                    <StyledTableCell align="left">
                      {data.total_cars_sold}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {data.total_sales_amount}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          ) : showEmp ? (
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">name</StyledTableCell>
                  <StyledTableCell align="left">total_cars_sold</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataEmp.map((data, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {data.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">{data.total_cars_sold}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          ):<></>}
        </TableContainer>
      </Box>
    </div>
  );
}

export default TotalDataPage;
