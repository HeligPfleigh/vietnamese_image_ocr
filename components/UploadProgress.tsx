import React from "react";
import { Box, Typography, LinearProgress, IconButton } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

interface IUploadProgress {
  percentage: number;
  name: string;
  onCancelUploading: () => void;
}

export default function UploadProgress({
  percentage,
  name,
  onCancelUploading,
}: IUploadProgress) {
  if (percentage === 100) {
    return (
      <Box display="flex" flexDirection="row" marginTop={2} alignItems="center">
        <ImageIcon />
        <Box width="100%" margin="auto" padding={3}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography>{name}</Typography>
          </Box>
        </Box>
        <CheckIcon color="secondary" />
      </Box>
    );
  }
  return (
    <Box display="flex" flexDirection="row" marginTop={2} alignItems="center">
      <ImageIcon />
      <Box width="100%" margin="auto" padding={3}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography>{name}</Typography>
          <Typography>{`${percentage}%`}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={percentage} />
      </Box>
      <IconButton aria-label="delete" size="small" onClick={onCancelUploading}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
