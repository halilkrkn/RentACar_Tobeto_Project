import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useDropzone } from 'react-dropzone';
import DropZone from "../../components/helper/profile/DropZone";
import FileUpload from "../../components/helper/profile/FileUpload";
import CountrySelector from "../../components/helper/profile/CountrySelector";
import EditorToolbar from "../../components/helper/profile/EditorToolbar";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchUserData from "../../redux/actions/fetchUserData";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "reactstrap";
import { userProfileScheme } from "../../schemes/userProfileScheme";
import axiosInstance from "../../redux/utilities/interceptors/axiosInterceptors";
import ErrorPage from "../../components/ui/ErrorPage";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function Profile() {
  const dispatch = useDispatch();
  const { details, status, error } = useSelector((state) => state.userDetail);
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();
  const canAccessPage =
    userRoles.includes("USER") || userRoles.includes("ADMIN");
  const [token, setToken] = useState("");
  const [id, setId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);



  const decodeJWT = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded;
    } catch (error) {
      console.error("JWT çözümlenirken bir hata oluştu:", error);
      return null;
    }
  };

  useEffect(() => {
    // JWT'den yetkilendirme bilgilerini okuma işlemi
    const storedJWT = localStorage.getItem("access_token");
    if (storedJWT) {
      const decodedToken = decodeJWT(storedJWT);
      const id = decodedToken.id;

      setToken(storedJWT);
      setId(id);
      if (decodedToken && decodedToken.role) {
        setUserRoles(decodedToken.role);
        dispatch(fetchUserData(id));
      }
    }
  }, [dispatch]);

  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    image: "",
    // Add other form fields here
  };

  // Formik hook
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, actions) => {
      const updatedData = {
        id: id,
        name: values.firstName || details.name,
        surname: values.lastName || details.surname,
        email: values.email || details.email,
        password: values.password,
        birthDate: null,
        userImage: selectedFile ? URL.createObjectURL(selectedFile) : details.userImage,
      };

      console.log("Values : ", values);
      console.log("updated : ", updatedData);

      try {
        const response = await axiosInstance.put(
          `api/v1/auth/${id}`,
          updatedData
        );

        console.log("Başarılı güncelleme")
        console.log(response)
      } catch (error) {
        console.error("Güncelleme hatası hatası:", error.response.data);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const { handleChange, handleSubmit, values, errors, touched } = formik;

  const onDrop = useCallback((acceptedFiles) => {
    // Seçilen dosyayı sakla
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <Form onSubmit={handleSubmit}>
      {canAccessPage ? (
        <Box sx={{ flex: 1, width: "100%" }}>
          <Box
            sx={{
              position: "sticky",
              top: { sm: -100, md: -110 },
              bgcolor: "background.body",
              zIndex: 9995,
            }}
          >
            <Box sx={{ px: { xs: 2, md: 6 } }}>
              <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                Welcome, {details.name ? details.name : 'User'}
              </Typography>
            </Box>
            <Tabs
              defaultValue={0}
              sx={{
                bgcolor: "transparent",
              }}
            >
              <TabList
                tabFlex={1}
                size="sm"
                sx={{
                  pl: { xs: 0, md: 4 },
                  justifyContent: "left",
                  [`&& .${tabClasses.root}`]: {
                    fontWeight: "600",
                    flex: "initial",
                    color: "text.tertiary",
                    [`&.${tabClasses.selected}`]: {
                      bgcolor: "transparent",
                      color: "text.primary",
                      "&::after": {
                        height: "2px",
                        bgcolor: "primary.500",
                      },
                    },
                  },
                }}
              >
                <Tab
                  sx={{ borderRadius: "6px 6px 0 0" }}
                  indicatorInset
                  value={0}
                >
                  Profile Settings
                </Tab>
                {/* <Tab
                  sx={{ borderRadius: "6px 6px 0 0" }}
                  indicatorInset
                  value={1}
                >
                  Saved Credit Cards
                </Tab>
                <Tab
                  sx={{ borderRadius: "6px 6px 0 0" }}
                  indicatorInset
                  value={2}
                >
                  My Reservations
                </Tab>
                <Tab
                  sx={{ borderRadius: "6px 6px 0 0" }}
                  indicatorInset
                  value={3}
                >
                  My Bills
                </Tab> */}
              </TabList>
            </Tabs>
          </Box>
          <Stack
            spacing={4}
            sx={{
              display: "flex",
              maxWidth: "800px",
              mx: "auto",
              px: { xs: 2, md: 6 },
              py: { xs: 2, md: 3 },
            }}
          >
            {/* WEB FORM */}
            <Card>
              <Box sx={{ mb: 1 }}>
                <Typography level="title-md">Personal info</Typography>
                <Typography level="body-sm">
                  Customize how your profile information will apper to the
                  networks.
                </Typography>
              </Box>
              <Divider />
              <Stack
                direction="row"
                spacing={3}
                sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
              >
                <Stack direction="column" spacing={1}>
                  <AspectRatio
                    ratio="1"
                    maxHeight={200}
                    sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
                  >
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        loading="lazy"
                        alt=""
                        style={{ objectFit: "cover", borderRadius: "100%" }}
                      />
                    ) : values.image ? (
                      <img
                        src={details.userImage}
                        loading="lazy"
                        alt=""
                        style={{ objectFit: "cover", borderRadius: "100%" }}
                      />
                    ) : (
                      <div>Add an image</div>
                    )}
                  </AspectRatio>
                  <div {...getRootProps()} style={{ display: "none" }}>
                    <input
                    id="fileInput" {...getInputProps()} />
                  </div>
                  <IconButton
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: "background.body",
                      position: "absolute",
                      zIndex: 2,
                      borderRadius: "50%",
                      left: 100,
                      top: 170,
                      boxShadow: "sm",
                    }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </Stack>
                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <FormLabel>Firstname</FormLabel>
                    <FormControl
                      sx={{
                        display: { sm: "flex-column", md: "flex-row" },
                        gap: 2,
                      }}
                    >
                      <FormControl sx={{ display: "flex-column", gap: 1 }}>
                        <Input
                          name="firstName"
                          value={values.firstName || details.name}
                          onChange={handleChange}
                          size="sm"
                          placeholder="First name"
                        />
                      </FormControl>

                      {touched.firstName && errors.firstName && (
                        <div style={{ color: "red" }}>{errors.firstName}</div>
                      )}

                      <FormControl sx={{ display: "flex-column", gap: 1 }}>
                        <FormLabel>Lastname</FormLabel>
                        <Input
                          name="lastName"
                          value={values.lastName || details.surname}
                          onChange={handleChange}
                          size="sm"
                          placeholder="Last name"
                        />
                      </FormControl>

                      {touched.lastName && errors.lastName && (
                        <div style={{ color: "red" }}>{errors.lastName}</div>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack direction="row" spacing={2}>


                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>E-mail</FormLabel>

                      <FormControl sx={{ display: "flex-column", gap: 1 }}>
                        <Input
                          name="email"
                          value={values.email || details.email}
                          onChange={handleChange}
                          size="sm"
                          placeholder="E-mail"
                        />
                      </FormControl>
                      {touched.email && errors.email && (
                        <div style={{ color: "red" }}>{errors.email}</div>
                      )}
                    </FormControl>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Password</FormLabel>

                      <FormControl sx={{ display: "flex-column", gap: 1 }}>
                        <Input
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          size="sm"
                          placeholder="Password"
                          type="password"
                        />
                      </FormControl>
                      {touched.password && errors.password && (
                        <div style={{ color: "red" }}>{errors.password}</div>
                      )}
                    </FormControl>
                  </Stack>


                </Stack>
              </Stack>

              {/* MOBILE FORM */}
              <Stack
                direction="column"
                spacing={2}
                sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
              >
                <Stack direction="row" spacing={2}>
                  <Stack direction="column" spacing={1}>
                    <AspectRatio
                      ratio="1"
                      maxHeight={108}
                      sx={{ flex: 1, minWidth: 108, borderRadius: "100%" }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                      />
                    </AspectRatio>
                    <IconButton
                      aria-label="upload new picture"
                      size="sm"
                      variant="outlined"
                      color="neutral"
                      sx={{
                        bgcolor: "background.body",
                        position: "absolute",
                        zIndex: 2,
                        borderRadius: "50%",
                        left: 85,
                        top: 180,
                        boxShadow: "sm",
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <FormLabel>Name</FormLabel>
                    <FormControl
                      sx={{
                        display: {
                          sm: "flex-column",
                          md: "flex-row",
                        },
                        gap: 2,
                      }}
                    >
                      <FormControl sx={{ display: "flex-column", gap: 2 }}>
                        <Input
                          name="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          size="sm"
                          placeholder="First name"
                        />
                      </FormControl>
                      {touched.firstName && errors.firstName && (
                        <div style={{ color: "red" }}>{errors.firstName}</div>
                      )}

                      <FormControl sx={{ display: "flex-column", gap: 2 }}>
                        <Input
                          name="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          size="sm"
                          placeholder="Last name"
                        />
                      </FormControl>

                      {touched.lastName && errors.lastName && (
                        <div style={{ color: "red" }}>{errors.lastName}</div>
                      )}
                    </FormControl>
                  </Stack>
                </Stack>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input size="sm" defaultValue="UI Developer" />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>E-mail</FormLabel>

                  <FormControl sx={{ display: "flex-column", gap: 2 }}>
                    <Input
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      size="sm"
                      placeholder="E-mail"
                    />
                  </FormControl>

                  {touched.email && errors.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}
                </FormControl>
                <div>
                  <CountrySelector />
                </div>
                <div>
                  <FormControl sx={{ display: { sm: "contents" } }}>
                    <FormLabel>Timezone</FormLabel>
                    <Select
                      size="sm"
                      startDecorator={<AccessTimeFilledRoundedIcon />}
                      defaultValue="1"
                    >
                      <Option value="1">
                        Indochina Time (Bangkok){" "}
                        <Typography textColor="text.tertiary" ml={0.5}>
                          — GMT+07:00
                        </Typography>
                      </Option>
                      <Option value="2">
                        Indochina Time (Ho Chi Minh City){" "}
                        <Typography textColor="text.tertiary" ml={0.5}>
                          — GMT+07:00
                        </Typography>
                      </Option>
                    </Select>
                  </FormControl>
                </div>
              </Stack>

              {/* BUTTONS */}
              <CardOverflow
                sx={{ borderTop: "1px solid", borderColor: "divider" }}
              >
                <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                  <Button size="sm" variant="outlined" color="neutral">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} size="sm" variant="solid">
                    Save
                  </Button>
                </CardActions>
              </CardOverflow>
            </Card>
          </Stack>
        </Box>
      ) : (
        <ErrorPage errorMessage="403 Forbidden"/>
      )}
    </Form>
  );
}
