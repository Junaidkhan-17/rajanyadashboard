const ProductDescriptionCard = ({ product }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-sm font-semibold">
          2
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Product Description
        </h2>
      </div>

      {/* Short Description */}
      <div className="mb-5">
        <p className="text-xs uppercase font-semibold tracking-widest text-purple-800 mb-2">
          Short Description <span className="text-red-500">*</span>
        </p>

        <div className="border border-slate-200 rounded-xl p-4 min-h-[80px] relative">
          <p className="text-slate-500 italic text-sm tracking-wider leading-8">
            {product?.shortDescription || "-"}
          </p>

          <span className="absolute bottom-3 right-3 text-xs text-slate-400">
            {product?.shortDescription?.length || 0}/200
          </span>
        </div>
      </div>

      {/* Full Description */}
      <div className="mb-5">
        <p className="text-xs uppercase font-semibold tracking-widest text-purple-800 mb-2">
          Full Description <span className="text-red-500">*</span>
        </p>

        <div className="border border-slate-200 rounded-xl p-4 min-h-[150px] relative">
          <p className="text-slate-600 leading-9 text-sm tracking-wider">
            {product?.description || "-"}
          </p>

          <span className="absolute bottom-3 right-3 text-xs text-slate-400">
            {product?.description?.length || 0}/2000
          </span>
        </div>
      </div>

      {/* Fabric & Care */}
      <div>
        <p className="text-xs uppercase font-semibold tracking-widest text-purple-800 mb-2">
          Fabric & Care <span className="text-red-500">*</span>
        </p>

        <div className="border border-slate-200 rounded-xl p-4 min-h-[150px] relative">
          <h3 className="font-semibold text-sm tracking-[2px] text-slate-800 uppercase mb-2">
            Material & Craftsmanship
          </h3>

          <div className="text-slate-600 leading-7 text-sm tracking-wider space-y-3">
            <div>
              <p className="font-semibold text-slate-700">Materials</p>

              <p>
                {product?.materials?.length
                  ? product.materials.join(", ")
                  : "-"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-700">Care Instructions</p>

              <p>
                {product?.careInstructions?.length
                  ? product.careInstructions.join(", ")
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionCard;
