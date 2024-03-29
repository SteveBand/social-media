import "@/styles/ui/user/user-loader.scss";

export function UserSkeleton() {
  return (
    <article className="follower-loader-wrapper">
      <div className="ware-filling-loader img-loader"></div>
      <div className="content">
        <div className="inifinty-line-loader name"></div>
        <div className="inifinty-line-loader bio"></div>
      </div>
      <button>Follow</button>
    </article>
  );
}
