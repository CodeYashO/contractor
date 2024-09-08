"use client";
import { useRouter } from "next/navigation";

function LandingPage() {
  // const navigate = useNavigate();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Landing Page</h1>
      <div className="space-x-4">
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
        <button
          onClick={handleSignup}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
