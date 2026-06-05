import { Link, LinkProps } from "react-router-dom";
import { useLangPath } from "@/hooks/useLanguage";

interface LangLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
}

/**
 * Drop-in replacement for React Router <Link>.
 * Automatically adds /en prefix when site is in English mode.
 */
const LangLink = ({ to, ...props }: LangLinkProps) => {
  const langPath = useLangPath();
  return <Link to={langPath(to)} {...props} />;
};

export default LangLink;
