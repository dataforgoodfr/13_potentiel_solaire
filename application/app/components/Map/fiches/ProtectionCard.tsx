import { CircleAlert } from "lucide-react";

const PROTECTION_TEXT = {
  protected: "Une partie de cet établissement est située en zone protégée",
  not_protected: "Pas de zone protégée"
};

interface ProtectionCardProps {
  isProtected: boolean;
}

const ProtectionCard: React.FC<ProtectionCardProps> = ({ isProtected }) => {
  return (
    <div className={`flex gap-4 p-2 mb-4 ${isProtected ? "bg-orange rounded-md" : "bg-green rounded-md"}`}>
      <CircleAlert />
      <p className="font-normal">
        {isProtected ? PROTECTION_TEXT.protected : PROTECTION_TEXT.not_protected}
      </p>
    </div>
  );
};

export default ProtectionCard;
