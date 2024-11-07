import { hotelRoom, logoIcon, styles } from "@firebnb/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { useMediaQuery } from "usehooks-ts";
import { useLogin } from "../../../feature-data-access-api/auth";
import { loginUserSchema } from "../../../utils/schemas";
import { Button } from "../components/button";
import { InputControl } from "../components/input-control";

interface LoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginUserSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useLogin({
    onMutate: () => {
      setIsLoading(true);
    },
    onError() {
      setIsLoading(false);
      toast.error("Invalid email or password!");
    },
    onSuccess: () => {
      setIsLoading(false);
    },
  });
  const handleFormSubmit = handleSubmit((values) => mutate(values));
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="w-full flex">
      <div className="w-full flex flex-col space-y-3 px-20 py-10">
        <div className="pb-3">
          <img src={logoIcon} />
        </div>
        <div className={styles.heading}>Sign in to your account</div>
        <div className={twMerge("text-stone-400", styles.paragraph)}>
          Not a member?{" "}
          <button
            className="text-primary hover:opacity-80"
            onClick={handleNavigateToRegister}
          >
            Create a new account!
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <InputControl
            label="Email address"
            control={control}
            name="email"
            placeholder="mail@example.com"
          />
          <InputControl
            label="Password"
            control={control}
            name="password"
            type="password"
            placeholder="********"
          />
          <Button isLoading={isLoading} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
      {!isMobile && (
        <img
          src={hotelRoom}
          className="w-full max-w-[60%] h-[100vh] object-cover object-center"
        />
      )}
    </div>
  );
};
