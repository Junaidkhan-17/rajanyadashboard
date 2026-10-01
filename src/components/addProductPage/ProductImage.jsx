import { Upload, Plus, X, Sparkles } from "lucide-react";
import "./ProductImage.css";

const ProductImages = ({ productData, setProductData }) => {
  // ==========================================
  // COVER IMAGE
  // ==========================================
  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProductData((prev) => ({
      ...prev,
      coverImage: URL.createObjectURL(file),

      // API
      coverImageFile: file,
    }));
  };

  // ==========================================
  // GALLERY IMAGES
  // ==========================================
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setProductData((prev) => ({
      ...prev,

      galleryImages: [
        ...(prev.galleryImages || []),
        ...previews,
      ].slice(0, 5),

      // API
      galleryImageFiles: [
        ...(prev.galleryImageFiles || []),
        ...files,
      ].slice(0, 5),
    }));
  };

  // ==========================================
  // VIRTUAL TRY-ON GARMENT IMAGE
  // ==========================================
  const handleVirtualTryOnImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProductData((prev) => ({
      ...prev,

      // Preview
      virtualTryOnImage: URL.createObjectURL(file),

      // API
      virtualTryOnImageFile: file,
    }));
  };

  // ==========================================
  // REMOVE COVER IMAGE
  // ==========================================
  const removeCoverImage = () => {
    setProductData((prev) => ({
      ...prev,
      coverImage: "",
      coverImageFile: null,
    }));
  };

  // ==========================================
  // REMOVE GALLERY IMAGE
  // ==========================================
  const removeGalleryImage = (index) => {
    setProductData((prev) => ({
      ...prev,

      galleryImages: (prev.galleryImages || []).filter(
        (_, i) => i !== index
      ),

      galleryImageFiles: (prev.galleryImageFiles || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // REMOVE VIRTUAL TRY-ON IMAGE
  // ==========================================
  const removeVirtualTryOnImage = () => {
    setProductData((prev) => ({
      ...prev,
      virtualTryOnImage: "",
      virtualTryOnImageFile: null,
    }));
  };

  return (
    <div className="product-images-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="product-images-header flex items-center gap-3 mb-6">
        <div className="product-images-step w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-semibold">
          3
        </div>

        <h2 className="product-images-title text-lg font-semibold text-slate-800">
          Product Images
        </h2>
      </div>

      {/* ==========================================
          MAIN IMAGE GRID
      ========================================== */}
      <div className="product-images-main-grid grid lg:grid-cols-2 gap-6">
        {/* ==========================================
            COVER IMAGE
        ========================================== */}
        <div className="product-images-section">
          <label className="product-images-label block text-sm font-medium mb-3">
            Cover Image
          </label>

          {productData.coverImage ? (
            <div className="product-cover-preview relative">
              <img
                src={productData.coverImage}
                alt="Product cover"
                className="product-cover-image w-full h-60 object-cover rounded-xl border"
              />

              <button
                type="button"
                onClick={removeCoverImage}
                aria-label="Remove cover image"
                className="product-image-remove-button absolute top-3 right-3 bg-red-500 text-white rounded-full p-2"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <input
                id="cover"
                hidden
                type="file"
                accept="image/*"
                onChange={handleCoverImage}
              />

              <label
                htmlFor="cover"
                className="product-cover-upload border-2 border-dashed border-slate-300 rounded-xl h-60 flex flex-col items-center justify-center cursor-pointer hover:border-black transition"
              >
                <Upload size={30} />

                <p className="mt-3 font-medium">
                  Upload Cover Image
                </p>

                <p className="text-xs text-slate-400">
                  JPG PNG WEBP
                </p>
              </label>
            </>
          )}
        </div>

        {/* ==========================================
            GALLERY IMAGES
        ========================================== */}
        <div className="product-images-section">
          <label className="product-images-label block text-sm font-medium mb-3">
            Gallery Images (Max 5)
          </label>

          <div className="product-gallery-grid grid grid-cols-3 gap-3">
            {(productData.galleryImages || []).map(
              (image, index) => (
                <div
                  key={index}
                  className="product-gallery-item relative"
                >
                  <img
                    src={image}
                    className="product-gallery-image h-28 w-full rounded-xl object-cover border"
                    alt={`Gallery ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    aria-label={`Remove gallery image ${index + 1}`}
                    className="product-gallery-remove absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )
            )}

            {(productData.galleryImages || []).length < 5 && (
              <>
                <input
                  hidden
                  id="gallery"
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImages}
                />

                <label
                  htmlFor="gallery"
                  className="product-gallery-add border-2 border-dashed border-slate-300 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:border-black transition"
                >
                  <Plus size={20} />

                  <span className="text-xs mt-2">
                    Add Image
                  </span>
                </label>
              </>
            )}
          </div>

          <p className="product-images-helper text-xs text-slate-400 mt-4">
            Maximum 5 gallery images.
          </p>
        </div>
      </div>

      {/* ==========================================
          VIRTUAL TRY-ON GARMENT IMAGE
      ========================================== */}
      <div className="product-tryon-section mt-6 pt-6 border-t border-slate-200">
        <div className="product-tryon-header flex items-center justify-between mb-3">
          <div className="product-tryon-heading-content">
            <label className="block text-sm font-medium text-slate-800">
              Virtual Try-On Garment Image
            </label>

            <p className="text-xs text-slate-400 mt-1">
              Upload a clear garment-only image for FitRoom AI.
            </p>
          </div>

          <div className="product-fitroom-label flex items-center gap-2 text-xs font-medium text-slate-500">
            <Sparkles size={15} />
            FitRoom
          </div>
        </div>

        {productData.virtualTryOnImage ? (
          <div className="product-tryon-preview relative w-full max-w-md">
            <img
              src={productData.virtualTryOnImage}
              alt="Virtual Try-On garment"
              className="product-tryon-image w-full h-72 object-contain rounded-xl border border-slate-200 bg-slate-50"
            />

            <button
              type="button"
              onClick={removeVirtualTryOnImage}
              aria-label="Remove Virtual Try-On garment image"
              className="product-image-remove-button absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 shadow"
            >
              <X size={16} />
            </button>

            <div className="product-tryon-overlay absolute bottom-3 left-3 right-3">
              <div className="bg-black/70 text-white rounded-lg px-3 py-2 text-xs">
                This image will be used as the garment image for Virtual
                Try-On.
              </div>
            </div>
          </div>
        ) : (
          <>
            <input
              id="virtualTryOnImage"
              hidden
              type="file"
              accept="image/*"
              onChange={handleVirtualTryOnImage}
            />

            <label
              htmlFor="virtualTryOnImage"
              className="product-tryon-upload border-2 border-dashed border-slate-300 rounded-xl min-h-72 w-full max-w-md flex flex-col items-center justify-center cursor-pointer hover:border-black transition bg-slate-50/50"
            >
              <div className="product-tryon-icon w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4">
                <Sparkles size={22} />
              </div>

              <p className="font-medium text-slate-800">
                Upload Garment Image
              </p>

              <p className="text-xs text-slate-400 mt-2 text-center px-4">
                Use a clear image showing the complete garment.
              </p>

              <p className="text-xs text-slate-400 mt-1">
                JPG PNG WEBP
              </p>
            </label>
          </>
        )}

        <div className="product-tryon-description mt-3 max-w-md">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Recommended:</strong> Use a clean product/garment
            image with the complete outfit clearly visible. This image
            is used only by the Virtual Try-On system and is separate
            from the normal product cover and gallery images.
          </p>
        </div>
      </div>

      {/* ==========================================
          API INFORMATION
      ========================================== */}
      {/*
        Cover:
        formData.append("coverImage", coverImageFile)

        Gallery:
        galleryImageFiles.forEach((file) => {
          formData.append("galleryImages", file)
        })

        Virtual Try-On:
        formData.append(
          "virtualTryOnImage",
          virtualTryOnImageFile
        )
      */}
    </div>
  );
};

export default ProductImages;