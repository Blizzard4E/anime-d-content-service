"use client";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AnimeForm from "@/components/Form/AnimeForm";
import AnimeListTable from "@/components/Table/Variants/AnimeListTable";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import GenreListTable from "@/components/Table/Variants/GenreListTable";
import StudioListTable from "@/components/Table/Variants/StudioListTable";

const ContentManagementPage = () => {
    const [openAnimeDialog, setOpenAnimeDialog] = useState(false);
    const [openViewStudioDialog, setOpenViewStudioDialog] = useState(false);
    const [openViewGenreDialog, setOpenViewGenreDialog] = useState(false);

    const handleToggleAnimeDialog = () => {
        setOpenAnimeDialog((prev) => !prev);
    };

    const handleToggleViewGenreDialog = () => {
        setOpenViewGenreDialog((prev) => !prev);
    };

    const handleToggleViewStudioDialog = () => {
        setOpenViewStudioDialog((prev) => !prev);
    };

    return (
        <Box>
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                Content Management
            </Typography>
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "rgba(0,0,0,0.6)" }}
            >
                Manage all your anime content
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 4,
                    background:
                        "linear-gradient(145deg, #ffffff 0%, #f5f5f5 50%)",
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        onClick={() => handleToggleAnimeDialog()}
                        sx={{
                            borderRadius: "16px",
                            fontWeight: "bold",
                            letterSpacing: 1,
                            transition: "all 0.2s",
                            "&:hover": {
                                background: "rgb(25,118,210,1)",
                                color: "white",
                                letterSpacing: 3,
                            },
                        }}
                    >
                        Add New Anime
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<LibraryBooksOutlinedIcon />}
                        onClick={() => handleToggleViewStudioDialog()}
                        sx={{
                            borderRadius: "16px",
                            fontWeight: "bold",
                            letterSpacing: 1,
                            transition: "all 0.2s",
                            "&:hover": {
                                background: "rgb(25,118,210,1)",
                                color: "white",
                                letterSpacing: 3,
                            },
                        }}
                    >
                        View All Studio
                    </Button>
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<CollectionsBookmarkOutlinedIcon />}
                        onClick={() => handleToggleViewGenreDialog()}
                        sx={{
                            borderRadius: "16px",
                            fontWeight: "bold",
                            letterSpacing: 1,
                            transition: "all 0.2s",
                            "&:hover": {
                                background: "rgb(25,118,210,1)",
                                color: "white",
                                letterSpacing: 3,
                            },
                        }}
                    >
                        View All Genre
                    </Button>
                </Stack>
            </Paper>
            <div className="w-full overflow-hidden">
                {/* Your table component with full width */}
                <div className="w-full">
                    <AnimeListTable />
                </div>
            </div>
            <Dialog
                fullWidth
                maxWidth="md"
                open={openAnimeDialog}
                onClose={handleToggleAnimeDialog}
            >
                <DialogTitle>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6">
                            Add New Anime Content
                        </Typography>
                        <IconButton onClick={() => handleToggleAnimeDialog()}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <AnimeForm onClose={handleToggleAnimeDialog} />
                </DialogContent>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="md"
                open={openViewStudioDialog}
                onClose={handleToggleViewStudioDialog}
            >
                <DialogTitle>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6">Studio List</Typography>
                        <IconButton onClick={handleToggleViewStudioDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <StudioListTable />
                </DialogContent>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="md"
                open={openViewGenreDialog}
                onClose={handleToggleViewGenreDialog}
            >
                <DialogTitle>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6">Genre List</Typography>
                        <IconButton onClick={handleToggleViewGenreDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <GenreListTable />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ContentManagementPage;
