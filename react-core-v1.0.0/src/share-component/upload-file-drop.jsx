import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import "../../../pageSCSS/file.scss";
import _spService from "../share-service/sp-service";
import { toast } from "react-toastify";

const FileControlDropImage = ({
  type,
  controlKey,
  controlValue,
  onChange,
  addData,
  removeExtend,
  updateExtend,
  dimensionRestrictions,
}) => {
  const [files, setFiles] = useState([]);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const draggedIndex = useRef(null);
  const isAddDataTriggered = useRef(false);

  // Update files when controlValue changes
  useEffect(() => {
    if (!controlValue && _spService.nullOrEmpty(controlValue)) {
      setFiles([]);
    } else {
      processFiles(controlValue);
    }
  }, [controlValue]);

  const processFiles = async (value) => {
    const processItem = async (item) => {
      if (typeof item === "string") {
        return await urlToFile(item, item.split("/").pop(), "image/jpeg");
      } else if (item instanceof File) {
        return item;
      } else {
        return new File([], "unknown");
      }
    };

    const newFiles = Array.isArray(value)
      ? await Promise.all(value.map(processItem))
      : [await processItem(value)];

    setFiles(newFiles);
    onChange?.(controlKey, newFiles);
  };

  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const mimeType = blob.type || "application/octet-stream";
      return new File([blob], filename, { type: mimeType });
    } catch (error) {
      console.error("Error converting URL to file:", error);
      return null;
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(
      imageToCrop,
      croppedAreaPixels,
      dimensionRestrictions
    );
    const blob = await (await fetch(croppedImage)).blob();
    const croppedFile = new File([blob], pendingFile.name, { type: blob.type });

    const newFiles = type === "files" ? [...files, croppedFile] : [croppedFile];
    setFiles(newFiles);
    onChange?.(controlKey, newFiles);
    setShowCropper(false);
    setImageToCrop(null);
    setPendingFile(null);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageToCrop(null);
    setPendingFile(null);
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]; // Handle one file at a time for cropping
      if (!file) return;

      if (!dimensionRestrictions?.width || !dimensionRestrictions?.height) {
        toast.info("Dimension restrictions are required for cropping.");
        return;
      }

      setPendingFile(file);
      setImageToCrop(URL.createObjectURL(file));
      setShowCropper(true);
    },
    [files, type, onChange, dimensionRestrictions]
  );

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(controlKey, updatedFiles);
    if (addData) {
      removeExtend(index);
    }
  };

  const handleDragStart = (index) => {
    draggedIndex.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex.current === null) return;

    const updatedFiles = [...files];
    const [movedFile] = updatedFiles.splice(draggedIndex.current, 1);
    updatedFiles.splice(index, 0, movedFile);
    setFiles(updatedFiles);
    onChange?.(controlKey, updatedFiles);
    draggedIndex.current = null;

    if (isAddDataTriggered.current) {
      updateExtend?.({
        changeIndex: true,
        updatedFiles: updatedFiles,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: type === "files",
    accept: "image/*",
  });

  const getCroppedImg = (imageSrc, pixelCrop, dimensionRestrictions) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;

    // Set canvas size to match dimensionRestrictions
    const targetWidth = dimensionRestrictions?.width || 300; // Default to 300 if not specified
    const targetHeight = dimensionRestrictions?.height || 100; // Default to 100 if not specified
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    return new Promise((resolve) => {
      image.onload = () => {
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          targetWidth,
          targetHeight
        );
        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  return (
    <div className="file-control">
      <div className="file-galery">
        <div className="galery-list" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="image-grid">
            {files.length > 0 &&
              files.map((file, index) => (
                <div
                  className="image-container"
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <img
                    src={
                      file instanceof File ? URL.createObjectURL(file) : file
                    }
                    alt={`uploaded-${index}`}
                    className="uploaded-image"
                  />
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    ×
                  </button>
                  {addData && (
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        isAddDataTriggered.current = true;
                        addData(file, index);
                      }}
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
          </div>
          {files.length === 0 && (
            <div className="dropzone-placeholder">
              {isDragActive
                ? "Thả file vào đây..."
                : "Bấm hoặc kéo thả để thêm ảnh"}
            </div>
          )}
        </div>
        <div className="btn-plus-img" {...getRootProps()}>
          <input {...getInputProps()} />
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </div>
      </div>
      {showCropper && (
        <div className="cropper-modal">
          <div className="cropper-dialog">
            <div className="cropper-container">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={
                  dimensionRestrictions?.width && dimensionRestrictions?.height
                    ? dimensionRestrictions.width / dimensionRestrictions.height
                    : 3 / 1
                }
                cropSize={{
                  width: dimensionRestrictions?.width || 300,
                  height: dimensionRestrictions?.height || 100,
                }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={false}
              />
            </div>
            <div className="actions">
              <button
                className="btn btn-primary admin-btn"
                onClick={handleSaveCrop}
              >
                <i className="fa-solid fa-floppy-disk mr-5"></i> Lưu
              </button>
              <button
                className="btn btn-danger admin-btn "
                onClick={handleCancelCrop}
              >
                <i className="fa-solid fa-ban mr-5"> </i> Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileControlDropImage;

// <Grid item xs={12} md={12}>
//   <InputLabel>Hình ảnh kích thước nhỏ tối đa 150x150</InputLabel>
//   <FileControlDropImage
//     type="file"
//     controlValue={form?.image_url}
//     controlKey="image_url"
//     onChange={handleFileChange}
//     dimensionRestrictions={{ width: 150, height: 150 }}
//   />
// </Grid>;
