// import exp from "constants";
import { X } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";

const ImageUpload = ({ onChange, error }) => {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
  
    const handleFile = (file) => {
      if (!file) return;
  
      if (!file.type.startsWith('image/')) {
        onChange(null);
        setPreview(null);
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(file);
      };
      reader.readAsDataURL(file);
    };
  
    const handleDrop = useCallback((e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }, []);
  
    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);
  
    const handleDragLeave = useCallback((e) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);
  
    const removeImage = () => {
      setPreview(null);
      onChange(null);
    };
  
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Profile Picture</label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
            isDragging 
              ? 'border-green-500 bg-green-50' 
              : error 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => document.getElementById('profile-upload').click()}
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  <span>Upload a file</span>
                  <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </button>
                <p className="text-xs text-gray-500">or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  };

export default ImageUpload;