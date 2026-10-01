import { Sparkles, ImageOff } from "lucide-react";

const TryOnPhotoSection = ({ request }) => {
  if (!request?.beforeImage && !request?.afterImage) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Before */}
        <div>
          <h3 className="font-semibold mb-4">
            Uploaded Photo (Before)
          </h3>

          {request.beforeImage ? (
            <img
              src={request.beforeImage}
              alt="Uploaded customer photo"
              className="w-full h-[400px] object-cover rounded-2xl border"
            />
          ) : (
            <div className="w-full h-[400px] rounded-2xl border flex flex-col items-center justify-center text-slate-400">
              <ImageOff size={32} />
              <p className="mt-3 text-sm">
                Uploaded photo not available
              </p>
            </div>
          )}
        </div>

        {/* After */}
        <div>
  <h3 className="font-semibold mb-4">
    AI Try-On Result (After)
  </h3>

  <div className="relative">
    {request.afterImage ? (
      <>
        <img
          src={request.afterImage}
          alt="AI Try-On Result"
          className="w-full h-[400px] object-cover rounded-2xl border"
        />

        <img
          src={request.afterImage}
          alt="AI Try-On Preview"
          className="absolute bottom-4 right-4 w-20 h-24 rounded-xl border-2 border-white object-cover shadow-lg"
        />
      </>
    ) : (
      <div className="w-full h-[400px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center px-6">
        <Sparkles
          size={28}
          className="text-slate-400 mb-3"
        />

        <p className="font-semibold text-slate-600">
          AI Result Not Available
        </p>

        <p className="text-sm text-slate-400 mt-1">
          This try-on request does not have a generated result yet.
        </p>
      </div>
    )}
  </div>
</div>
      </div>

      {/* Bottom */}
      <div className="mt-6 rounded-xl bg-violet-50 border border-violet-100 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-violet-700">
          <Sparkles size={18} />

          <span className="text-sm">
  Virtual Try-On result will appear here after AI generation.
</span>
        </div>

        <p className="text-sm text-slate-500 whitespace-nowrap">
          Generation Time : {request.generationTime || "-"}
        </p>
      </div>
    </div>
  );
};

export default TryOnPhotoSection;