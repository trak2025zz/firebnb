import { hotelRoom, logoIcon, styles } from "@firebnb/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { useMediaQuery } from "usehooks-ts";
import { useRegister } from "../../../feature-data-access-api/auth";
import { registerUserSchema } from "../../../utils/schemas";
import { Button } from "../components/button";
import { InputControl } from "../components/input-control";

interface RegisterForm {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const Register = () => {
  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerUserSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useRegister({
    onMutate: () => {
      setIsLoading(true);
    },
    onError(e: { errors: { msg: string }[] }) {
      setIsLoading(false);
      toast.error(e.errors[0]?.msg);
    },
    onSuccess() {
      setIsLoading(false);
      toast.success("Account created successfully!");
      navigate("/");
    },
  });
  const handleFormSubmit = handleSubmit((values) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_confirmation, ...restValues } = values;
    mutate(restValues);
  });
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const handleNavigateToLogin = () => {
    navigate("/");
  };

  return (
    <div className="w-full flex">
      <div className="w-full flex flex-col space-y-3 px-20 py-10">
        <div className="pb-3">
          <img src={logoIcon} />
        </div>
        <div className={styles.heading}>Sign up</div>
        <div className={twMerge("text-stone-400", styles.paragraph)}>
          Already have an account?{" "}
          <button
            className="text-primary hover:opactiy-80"
            onClick={handleNavigateToLogin}
          >
            Sign in!
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <InputControl
            label="Full name"
            control={control}
            name="full_name"
            placeholder="e.g. John Doe"
          />
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
          <InputControl
            label="Confirm password"
            control={control}
            name="password_confirmation"
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
