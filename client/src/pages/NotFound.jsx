import React from "react";
import { Container, Stack, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "1rem",

        textAlign: "center", // Centering the text
      }}
    >
      <Stack justifyContent="center" alignItems="center" spacing={2}>
        <ErrorOutlineIcon
          style={{
            fontSize: "120px", // Responsive icon size for larger screens
            color: "red", // Red color for error
          }}
        />
        <Typography
          variant="h4"
          style={{
            fontSize: "2.5rem", // Heading size for larger screens
            color: "#333", // Dark gray text color
            fontWeight: "bold", // Bold text
          }}
        >
          404 - Page Not Found
        </Typography>
        <Typography
          variant="body1"
          style={{
            fontSize: "1.25rem", // Body text size
            color: "#666", // Lighter gray text color
          }}
        >
          Oops! The page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          style={{
            marginTop: "1.5rem", // Top margin to separate the button
            padding: "0.75rem 2rem", // Padding inside the button
            fontSize: "1rem", // Button text size
            backgroundColor: "#1976d2", // Custom blue background color
            color: "#fff", // White text color
          }}
        >
          Go to Homepage
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;
