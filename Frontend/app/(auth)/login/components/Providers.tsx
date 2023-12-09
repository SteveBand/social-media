import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { PiGithubLogoFill } from "react-icons/pi";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useMemo } from "react";

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export function Providers({ providers }: Props) {
  const providersList = useMemo(() => {
    if (!providers) return [];
    const obj = Object.values(providers);
    return obj;
  }, [providers]);

  return (
    <div className="providers-wrapper">
      {providersList !== undefined &&
        providersList.map((provider: any) => {
          return (
            <div
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className={`provider-container ${provider.id}`}
            >
              {provider.id === "github" && (
                <PiGithubLogoFill className="icon" />
              )}
              {provider.id === "facebook" && <FaFacebook className="icon" />}
              {provider.id === "google" && <FcGoogle className="icon" />}
              {`Sign in with ${provider.name}`}
            </div>
          );
        })}
    </div>
  );
}
