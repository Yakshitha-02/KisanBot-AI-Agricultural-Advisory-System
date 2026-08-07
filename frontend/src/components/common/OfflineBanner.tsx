import { WifiOff } from "lucide-react";

const OfflineBanner = () => {
  return (
    <div className="bg-red-600 text-white p-3 text-center font-semibold">
      <div className="flex items-center justify-center gap-2">
        <WifiOff size={18} />
        Offline — reconnect to ask new questions
      </div>
    </div>
  );
};

export default OfflineBanner;