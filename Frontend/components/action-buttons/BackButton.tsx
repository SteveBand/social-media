import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export function BackButton() {
  const router = useRouter();
  return <FaArrowLeft onClick={() => router.back()} />;
}
