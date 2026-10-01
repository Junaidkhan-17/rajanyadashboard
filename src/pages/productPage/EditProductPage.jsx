import { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../services/productService";

import ProductInfoCard from "../../components/editProduct/ProductInfoCard";
import ProductImagesCard from "../../components/editProduct/ProductImagesCard";
import PricingCard from "../../components/editProduct/PricingCard";
import StatusCard from "../../components/editProduct/StatusCard";
import ProductPreviewCard from "../../components/editProduct/ProductPreviewCard";
import ProductDescriptionCard from "../../components/editProduct/ProductDescriptionCard";
import ProductAttributesCard from "../../components/editProduct/ProductAttributesCard";
import BottomSection from "../../components/editProduct/BottomSection";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subCategory: "",
    brandDesigner: "",

    shortDescription: "",
    fullDescription: "",

    coverImage: "",
    coverFile: null,

    galleryImages: [],

    durationPricing: [],

    securityDeposit: 0,

    productAvailability: "available",
    featured: false,

    stock: 0,

    availableSizes: [],
    color: "",
    gender: "",

    materials: "",
    careInstructions: "",
  });

  /*
  ========================================
  Fetch Product
  ========================================
  */

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await getProductById(id);
      const product = response?.product || response?.data || response;

      if (!product) {
        throw new Error("Product not found");
      }

      setFormData({
        productName: product.name || "",

        category:
          typeof product.category === "object"
            ? product.category?._id || ""
            : product.category || "",

        subCategory: product.subCategory || "",

        brandDesigner: product.brand || "",

        shortDescription: product.shortDescription || "",

        fullDescription: product.description || "",

        coverImage:
          product.mainImage ||
          product.thumbnailImage ||
          "",

        coverFile: null,

        galleryImages: (product.galleryImages || []).map(
          (image, index) => ({
            id: `existing-${index}-${Date.now()}`,
            image,
            file: null,
          }),
        ),

        durationPricing: (product.rentalOptions || []).map(
          (item) => ({
            days: item.days ?? "",
            price: item.price ?? "",
          }),
        ),

        securityDeposit: product.securityDeposit ?? 0,

        productAvailability:
          product.availabilityStatus || "available",

        featured: Boolean(product.isFeatured),

        stock: product.stock ?? 0,

        availableSizes: product.sizes || [],

        color: product.colors?.[0] || "",

        gender: product.gender || "",

        materials: (product.materials || []).join(", "),

        careInstructions: (
          product.careInstructions || []
        ).join(", "),
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to load product.",
      );

      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  Prepare Backend Payload
  ========================================
  */

  const buildProductPayload = async (availabilityStatus) => {
    let mainImage = formData.coverImage;

    /*
    ----------------------------------------
    Upload New Cover Image
    ----------------------------------------
    */

    if (formData.coverFile) {
      const imageFormData = new FormData();

      imageFormData.append("image", formData.coverFile);

      const uploadResponse =
        await uploadProductImage(imageFormData);

      const uploadedImage =
      uploadResponse?.image?.url || "";
      if (uploadedImage) {
        mainImage = uploadedImage;
      }
    }

    /*
    ----------------------------------------
    Upload New Gallery Images
    ----------------------------------------
    */

    const galleryImages = [];

    for (const image of formData.galleryImages || []) {
      if (!image?.file) {
        if (image?.image) {
          galleryImages.push(image.image);
        }

        continue;
      }

      const imageFormData = new FormData();

      imageFormData.append("image", image.file);

      const uploadResponse =
        await uploadProductImage(imageFormData);

      const uploadedImage =
        uploadResponse?.data?.url ||
        uploadResponse?.url ||
        "";

      if (uploadedImage) {
        galleryImages.push(uploadedImage);
      }
    }

    /*
    ----------------------------------------
    Rental Options
    ----------------------------------------
    */

    const rentalOptions = (
      formData.durationPricing || []
    )
      .filter(
        (item) =>
          item.days !== "" &&
          item.price !== "",
      )
      .map((item) => ({
        days: Number(item.days),
        price: Number(item.price),
      }));

    /*
    ----------------------------------------
    Materials
    ----------------------------------------
    */

    const materials = formData.materials
      ? formData.materials
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    /*
    ----------------------------------------
    Care Instructions
    ----------------------------------------
    */

    const careInstructions = formData.careInstructions
      ? formData.careInstructions
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    /*
    ----------------------------------------
    Backend Payload
    ----------------------------------------
    */

    return {
      name: formData.productName,

      category: formData.category,

      brand: formData.brandDesigner,

      shortDescription:
        formData.shortDescription,

      description:
        formData.fullDescription,

      mainImage,

      galleryImages,

      rentalOptions,

      securityDeposit:
        Number(formData.securityDeposit) || 0,

      sizes: formData.availableSizes || [],

      colors: formData.color
        ? [formData.color]
        : [],

      materials,

      careInstructions,

      gender:
        formData.gender || "Women",

      stock:
        Number(formData.stock) || 0,

      availabilityStatus,

      isFeatured:
        Boolean(formData.featured),
    };
  };

  /*
  ========================================
  Save Product
  ========================================
  */

  const handleSaveProduct = async () => {
    try {
      setSaving(true);

      const payload =
        await buildProductPayload(
          formData.productAvailability ||
            "available",
        );

      await updateProduct(id, payload);

      alert("Product updated successfully");

      navigate("/products");
    } catch (error) {
      console.error(
        "Failed to update product:",
        error,
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update product.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ========================================
  Save Draft
  ========================================
  */

  const handleSaveDraft = async () => {
    try {
      setSaving(true);

      /*
      Your current backend Product model does
      not have a "draft" or "status" field.

      Therefore we preserve the current
      availabilityStatus while saving the data.
      */

      const payload =
        await buildProductPayload(
          formData.productAvailability ||
            "available",
        );

      await updateProduct(id, payload);

      alert("Product changes saved successfully");
    } catch (error) {
      console.error(
        "Failed to save product:",
        error,
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save product.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ========================================
  Delete Product
  ========================================
  */

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        "Delete this product?",
      );

      if (!confirmed) return;

      setSaving(true);

      await deleteProduct(id);

      alert("Product deleted successfully");

      navigate("/products");
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error,
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete product.",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ========================================
  Loading
  ========================================
  */

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-slate-500 text-lg">
        Loading Product...
      </div>
    );
  }

  /*
  ========================================
  UI
  ========================================
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
            <NavLink
              to="/"
              className="text-slate-400 hover:text-black"
            >
              Dashboard
            </NavLink>

            <span>›</span>

            <NavLink
              to="/products"
              className="text-slate-400 hover:text-black"
            >
              Products
            </NavLink>

            <span>›</span>

            <span className="font-semibold text-black">
              Edit Product
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Edit Product
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Update your product information.
          </p>
        </div>

        <NavLink
          to="/products"
          className="inline-flex items-center justify-center gap-2 border border-black rounded-xl px-5 py-3 bg-white w-fit"
        >
          <ArrowLeft size={18} />
          Back to Products
        </NavLink>
      </div>

      {/* Main */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left */}

        <div className="xl:col-span-8 space-y-6">

          <ProductInfoCard
            formData={formData}
            setFormData={setFormData}
          />

          <ProductImagesCard
            formData={formData}
            setFormData={setFormData}
          />

          <PricingCard
            formData={formData}
            setFormData={setFormData}
          />

          <StatusCard
            formData={formData}
            setFormData={setFormData}
          />

        </div>

        {/* Right */}

        <div className="xl:col-span-4 space-y-6">

          <ProductPreviewCard
            formData={formData}
          />

          <ProductDescriptionCard
            formData={formData}
            setFormData={setFormData}
          />

          <ProductAttributesCard
            formData={formData}
            setFormData={setFormData}
          />

        </div>

      </div>

      {/* Bottom */}

      <BottomSection
        saving={saving}
        onSaveDraft={handleSaveDraft}
        onSaveProduct={handleSaveProduct}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EditProductPage;