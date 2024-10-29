
// import dynamic from "next/dynamic";

import FrontPageInfoModal from "@/components/FrontPageInfoModal";
import PackageList from "./package/(components)/PackageList"; // Import the PackageList component

// const LoginForm = dynamic(() => import("../components/LoginForm"), { ssr: false });
// const RegisterForm = dynamic(() => import("../components/RegisterForm"), { ssr: false });

export default function Home() {
  // const [showLoginForm, setShowLoginForm] = useState(false);
  // const [showRegisterForm, setShowRegisterForm] = useState(false);


  return (
    <div className="items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <section className="text-center">
          <h1 className="text-2xl font-bold">Packages</h1>
          <FrontPageInfoModal />
        </section>
        <section className="mt-8">
          <PackageList />
        </section>
      </main>


    </div>
  );
}