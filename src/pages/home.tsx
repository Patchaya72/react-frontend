import {
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Box,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { carService } from "../Service/carService";
import { CarGetRespons } from "../model/carGetRespons";
import { OptionsGetRespons } from "../model/optionsGetRespons";
import { CarAllopionsGetResponsTsx } from "../model/carAllopionsGetRespons";
import { useEffect, useState } from "react";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { optionService } from "../Service/optionService";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [cars, setCar] = useState<CarGetRespons[]>([]);
  const [carOpt, setCarOpt] = useState<OptionsGetRespons[]>([]);
  const [carOptAll, setCarOptAll] = useState<CarAllopionsGetResponsTsx[]>([]);
  const [typeCar, setTypeCar] = useState("car");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const navigate = useNavigate();
  const [body, setCurrentCar] = useState<CarGetRespons>({
    serial_no: "",
    brand: "",
    model: "",
    manufacturer: "",
    price: 0,
  });
  const service = new carService();
  const serviceOption = new optionService();

  useEffect(() => {
    callApi();
  }, []);

  const navigateTo = () => {
    navigate("/totalData");
  };

  const handleChange = async (event: SelectChangeEvent) => {
    setShowAirBag(false);
    setShowCDPlayer(false);
    setShowAll(false);
    const selectedType = event.target.value as string;
    setTypeCar(selectedType);
    await loadCarsByType(selectedType);
  };

  const loadCarsByType = async (type: string) => {
    if (type === "economiccar") {
      const data = await service.getViwCar1();
      setCar(data);
    } else if (type === "expensivecar") {
      const data = await service.getViwCar2();
      setCar(data);
    } else if (type === "luxuriouscar") {
      const data = await service.getViwCar3();
      setCar(data);
    } else {
      const data = await service.getAllCar();
      setCar(data);
    }
  };

  const callApi = async () => {
    setShowAirBag(false);
    setShowCDPlayer(false);
    setShowAll(false);
    await loadCarsByType(typeCar);
  };

  const chkPrice = async () => {
    if (typeCar === "economiccar" && body.price > 1000000) {
      alert("ราคาต้องน้อยกว่าหรือเท่ากับ 1 ล้านบาท");
      return;
    } else if (typeCar === "expensivecar" && body.price <= 1000000) {
      alert("ราคาต้องมากกว่า 1 ล้านบาท");
      return;
    } else if (typeCar === "luxuriouscar" && body.price < 3000000) {
      alert("ราคาต้องมากกว่า 3 ล้านบาท");
      return;
    } 
    else {
      if (dialogMode === "add") {
        await service.addCar(typeCar, body);
      } else if (dialogMode === "edit") {
        await service.editCar(typeCar, body.serial_no, body);
      }
    }
  };

  const handleDialogOpen = (mode: "add" | "edit", car?: CarGetRespons) => {
    setDialogMode(mode);
    if (mode === "edit" && car) {
      setCurrentCar(car);
    } else {
      setCurrentCar({
        serial_no: "",
        brand: "",
        model: "",
        manufacturer: "",
        price: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentCar((prevCar) => ({
      ...prevCar,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    await chkPrice();
    handleDialogClose();
    callApi();
  };

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

  const [showAirBag, setShowAirBag] = useState(false);
  const [showCDPlayer, setShowCDPlayer] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleAirBagChange = () => {
    setShowAirBag(!showAirBag);
    setShowAll(false);
    getOption();
  };
  const handleAllChange = async () => {
    setShowAll(!showAll);
    setShowAirBag(false);
    setShowCDPlayer(false);
    getOptionAll();
  };

  const handleCDPlayerChange = () => {
    setShowCDPlayer(!showCDPlayer);
    setShowAll(false);
    getOption();
  };

  const getOption = async () => {
    const dataOpt = await serviceOption.getAllCarbyOpt();
    setCarOpt(dataOpt);
  };
  const getOptionAll = async () => {
    const dataOpt = await serviceOption.getAllCarOpt();
    setCarOptAll(dataOpt);
  };

  const filteredCars = carOpt.filter(
    (car) =>
      (showAirBag && car.options.includes("Air Bag")) ||
      (showCDPlayer && car.options.includes("CD Player"))
  );

  return (
    <>
      <div
        style={{
          border: "2px solid red",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "1500px",
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
          <Button
            variant="contained"
            onClick={() => handleDialogOpen("add")}
            color="success"
          >
            เพิ่ม
          </Button>
          <Box sx={{ minWidth: 170 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={typeCar}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"car"}>ทั้งหมด</MenuItem>
                <MenuItem value={"economiccar"}>EconomicCar</MenuItem>
                <MenuItem value={"expensivecar"}>ExpensiveCar</MenuItem>
                <MenuItem value={"luxuriouscar"}>LuxuriousCar</MenuItem>
              </Select>
            </FormControl>
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
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showAirBag}
                    onChange={handleAirBagChange}
                  />
                }
                label="Air Bag"
                sx={{ color: "black" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showCDPlayer}
                    onChange={handleCDPlayerChange}
                  />
                }
                label="CD Player"
                sx={{ color: "black" }}
              />
            </FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={showAll} onChange={handleAllChange} />
              }
              label="ราคารวม Option"
              sx={{ color: "black" }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => navigateTo()}
            color="warning"
          >
            ยอดการขาย
          </Button>
        </Box>
        <Container
          sx={{
            marginTop: "10vh",
          }}
        >
          {carOpt.length > 0 && (showAirBag || showCDPlayer) ? (
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
                <Table
                  sx={{ minWidth: 700 }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>brand</StyledTableCell>
                      <StyledTableCell align="left">model</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCars.map((car, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {car.brand}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.model}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : showAll ? (
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
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 700 }}
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>serial_no</StyledTableCell>
                      <StyledTableCell align="left">brand</StyledTableCell>
                      <StyledTableCell align="left">model</StyledTableCell>
                      <StyledTableCell align="left">price</StyledTableCell>
                      <StyledTableCell align="left">
                        total_option_price
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        total_price
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carOptAll.map((car) => (
                      <StyledTableRow key={car.serial_no}>
                        <StyledTableCell component="th" scope="row">
                          {car.serial_no}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.brand}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.model}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.price}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.total_option_price}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {car.total_price}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
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
                <Table
                  sx={{ minWidth: 700 }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>serial_no</StyledTableCell>
                      <StyledTableCell align="left">brand</StyledTableCell>
                      <StyledTableCell align="left">model</StyledTableCell>
                      <StyledTableCell align="left">
                        manufacturer
                      </StyledTableCell>
                      <StyledTableCell align="left">price</StyledTableCell>
                      <StyledTableCell align="center">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cars.map((car) => (
                      <StyledTableRow key={car.serial_no}>
                        <StyledTableCell component="th" scope="row">
                          {car.serial_no}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.brand}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.model}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.manufacturer}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {car.price}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton
                            onClick={() => handleDialogOpen("edit", car)}
                          >
                            <EditIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Container>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogMode === "add" ? "เพิ่มข้อมูล  " : "แก้ไขข้อมูล  "}
          <b style={{ color: "blue" }}>{typeCar}</b>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Serial No"
            type="text"
            fullWidth
            variant="outlined"
            name="serial_no"
            value={body.serial_no}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Brand"
            type="text"
            fullWidth
            variant="outlined"
            name="brand"
            value={body.brand}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Model"
            type="text"
            fullWidth
            variant="outlined"
            name="model"
            value={body.model}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Manufacturer"
            type="text"
            fullWidth
            variant="outlined"
            name="manufacturer"
            value={body.manufacturer}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            name="price"
            value={body.price}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>ยกเลิก</Button>
          <Button onClick={handleSave}>ตกลง</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HomePage;
