import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Img } from "../../../types/img.type";
import * as imgActions from "../../../actions/img.action";
import * as patientActions from "../../../actions/patient.action";
import { useAppDispatch } from "../../..";
import { useMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootReducers } from "../../../reducers";
import Moment from "react-moment";
import { imageUrl } from "../../../Constants";
import Modal from "react-modal"; // Import Modal from react-modal
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
interface CardData {
  img_id?: number;
  img_filename?: string;
  img_disease: string;
  img_percent: number;
  img_symptom: string;
  img_user_id: number;
  img_patient_id: number;
  img_date?: Date;
  file?: any;
  file_obj?: URL | string;
}

export default function DiagnosePage() {
  const dispatch = useAppDispatch();
  const match = useMatch("/diagnose/:id");
  const imgReducer = useSelector((state: RootReducers) => state.imgReducer);
  const patientReducer = useSelector(
    (state: RootReducers) => state.patientReducer
  );
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(
    undefined
  );
  const [zoomLevel, setZoomLevel] = React.useState(1); // Initialize zoomLevel state
  const imgRef = React.useRef<HTMLImageElement | null>(null); // Initialize imgRef
  const modalStyles = {
    content: {
      width: "50%", // Adjust the width of the modal
      height: "auto", // Let the height adjust automatically
      margin: "auto", // Center the modal horizontally
      borderRadius: "10px", // Add border radius for a rounded appearance
    },
  };
  const perAuthReducer = useSelector(
    (state: RootReducers) => state.perAuthReducer
  );
  React.useEffect(() => {
    const id = match?.params.id;
    dispatch(imgActions.getImageById(id));
  }, [dispatch, match?.params.id]);
  React.useEffect(() => {
    const id = match?.params.id;
    dispatch(patientActions.getPatientById(id));
  }, [dispatch, match?.params.id]);
  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(undefined);
    setModalIsOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          textAlign: "left",
          display: "flex",
          justifyContent: "left",
          maxWidth: "100%",
          margin: "8px",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            ชื่อ-นามสกุล : {patientReducer.result[0]?.patient_fname}{" "}
            {patientReducer.result[0]?.patient_lname}
          </Typography>
        </CardContent>
      </Card>
      {imgReducer.result.flat().map((data: CardData, index: number) => (
        <Card
          key={index}
          sx={{
            textAlign: "left",
            display: "flex",
            justifyContent: "center",
            maxWidth: "100%",
            margin: "8px",
            width: "100%",
          }}
        >
          <CardActionArea
            sx={{ width: "80%" }}
            onClick={() =>
              openModal(
                `${imageUrl}/images/${data.img_filename}?dummy=${Math.random()}`
              )
            }
          >
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`${imageUrl}/images/${
                  data.img_filename
                }?dummy=${Math.random()}`}
                style={{ width: 300, borderRadius: "5%", marginRight: "16px" }}
              />
              <div>
                <Typography variant="body1" style={{ marginBottom: "50px" }}>
                  <Moment format="DD/MM/YYYY HH:mm">{data.img_date}</Moment>
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  โอกาสการเป็นโรค : {data.img_percent}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  โรคตาที่คาดว่าจะเป็น : {data.img_disease}
                </Typography>
                <Typography
                  variant="h5"
                  color="div"
                  style={{ marginBottom: "50px" }}
                >
                  อาการร่วม : {data.img_symptom}
                </Typography>
              </div>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}

      {/* Modal to display the enlarged image */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Enlarged Image"
        style={modalStyles} // Apply custom styles to the modal
      >
        <div style={{ position: "relative" }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoomLevel})`, // Apply the zoom level
              }}
              ref={imgRef}
            />
          )}
          <div
            style={{ position: "absolute", top: 0, right: 0, display: "flex" }}
          >
            {selectedImage && (
              <>
                {/* Zoom In button */}
                <IconButton
                  style={{ margin: "5px", color: "white" }}
                  onClick={() => setZoomLevel(zoomLevel + 0.1)}
                >
                  <ZoomInIcon />
                </IconButton>
                {/* Zoom Out button */}
                <IconButton
                  style={{ margin: "5px", color: "white" }}
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.1))}
                >
                  <ZoomOutIcon />
                </IconButton>
              </>
            )}
            {/* Close button */}
            <IconButton
              style={{ margin: "5px", color: "white" }}
              onClick={closeModal}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
