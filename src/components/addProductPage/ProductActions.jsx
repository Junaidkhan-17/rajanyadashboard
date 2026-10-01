import { useState } from "react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  createProduct,
  uploadProductImage,
} from "../../services/productService";

const ProductActions = ({ productData }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    if (isSaving) return;
    navigate("/products");
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    const response = await uploadProductImage(formData);

    if (!response?.success || !response?.image?.url) {
      throw new Error("Image upload failed.");
    }

    return response.image.url;
  };

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      let mainImage = "";

      if (productData.coverImageFile) {
        mainImage = await uploadImage(productData.coverImageFile);
      }

      let virtualTryOnImage = "";

if (productData.virtualTryOnImageFile) {
  virtualTryOnImage = await uploadImage(
    productData.virtualTryOnImageFile
  );
}

      const galleryImages = [];

      if (
        productData.galleryImageFiles &&
        productData.galleryImageFiles.length > 0
      ) {
        for (const file of productData.galleryImageFiles.slice(0, 5)) {
          const imageUrl = await uploadImage(file);

          if (imageUrl) {
            galleryImages.push(imageUrl);
          }
        }
      }

      const rentalOptions = (productData.durationPricing || [])
        .filter(
          (item) =>
            item.days !== "" &&
            item.days !== null &&
            item.discountPrice !== "" &&
            item.discountPrice !== null,
        )
        .map((item) => ({
          days: Number(item.days),
          price: Number(item.discountPrice),
        }))
        .filter(
          (item) =>
            Number.isFinite(item.days) &&
            item.days > 0 &&
            Number.isFinite(item.price) &&
            item.price >= 0,
        );

      const materials = productData.fabric ? [productData.fabric.trim()] : [];

      const careInstructions = productData.fabricCare
        ? [productData.fabricCare.trim()]
        : [];

      const payload = {
        name: productData.productName?.trim() || "",

        slug:
          productData.slug?.trim() ||
          productData.productName
            ?.trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),

        category: productData.category,

        occasion: Array.isArray(productData.occasion)
          ? productData.occasion
          : [],

        brand: productData.brandDesigner?.trim() || "",

        shortDescription: productData.shortDescription?.trim() || "",

        description: productData.fullDescription?.trim() || "",

        materials,

        careInstructions,

        mainImage,

        galleryImages,
        
        virtualTryOnImage,

        thumbnailImage: "",

        originalPrice: Number(productData.originalPrice) || 0,

        rentalOptions,

        securityDeposit: Number(productData.securityDeposit) || 0,

        sizes: Array.isArray(productData.availableSizes)
          ? productData.availableSizes
          : [],

        colors: productData.color ? [productData.color] : [],

        gender: productData.gender || "Women",

        stock: Number(productData.stock) || 0,

        availabilityStatus:
          productData.productAvailability === "Available"
            ? "available"
            : "out-of-stock",

        isFeatured: Boolean(productData.featured),

        isTrending: false,

        isRecommended: false,
      };

      console.log("========================================");
      console.log("FINAL PRODUCT PAYLOAD");
      console.log("========================================");
      console.log(payload);

      const response = await createProduct(payload);

      console.log("Product Created Successfully =>", response);

      alert("Product added successfully");

      navigate("/products");
    } catch (error) {
      console.error("Failed to create product:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add product.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="px-6 h-11 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 h-11 bg-black hover:bg-slate-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />

          {isSaving ? "Uploading & Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
