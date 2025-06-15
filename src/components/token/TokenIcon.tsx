
import React from "react";
import { CircleDollarSign } from "lucide-react";

interface TokenIconProps {
  size?: number;
  className?: string;
}

/**
 * GCAI Token icon: a stylized coin using Lucide's circle-dollar-sign.
 */
export const TokenIcon: React.FC<TokenIconProps> = ({ size = 18, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-electric-blue via-electric-purple to-electric-green shadow-md border border-transparent ${className}`}
    style={{ width: size, height: size }}
    aria-label="GCAI Token"
  >
    <CircleDollarSign size={size - 4} className="text-brand-primary" />
  </span>
);

export default TokenIcon;
