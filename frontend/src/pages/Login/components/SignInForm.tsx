import { login } from "../../../common/api/auth";
import { IUserLogin } from "../../../common/api/auth";
import { REQUIRED } from "../../../common/constants";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { CustomForm } from "../../../common/components/CustomForm/CustomForm";

interface ILoginFormProps {
  onHideLoginModal: () => void;
}

export default function LoginForm(props: ILoginFormProps) {
  return (
    <CustomForm
      fields={[
        {
          name: "userEmail",
          initialValue: "",
          label: "Email",
          type: "email",
          placeholder: "",
          validation: Yup.string()
            .email("Email is invalid")
            .matches(RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"), "Email is invalid")
            .max(100, "Max 100 characters")
            .required(REQUIRED),
        },
        {
          name: "password",
          initialValue: "",
          label: "Password",
          type: "password",
          placeholder: "",
          validation: Yup.string().max(255, "Max 255 characters").required(REQUIRED),
        },
      ]}
      submitButtonText="Submit"
      onSubmit={async (values: IUserLogin) => {
        try {
          const data = await login(values);

          console.log(data);
          localStorage.setItem("accessToken", data.data.AccessToken);
          localStorage.setItem("userEmail", values.userEmail);

          // success message
          const response = "Login successful.";

          Swal.fire({
            title: response,
            icon: "success",
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {
            props.onHideLoginModal();
          });
        } catch (e: any) {
          // Error message
          console.log(e);
          let response = e.response?.data?.statusMessage;
          response = response.replace("[Error] ", "");

          Swal.fire({
            title: response,
            icon: "error",
            timer: 5000,
            showConfirmButton: false,
          });

          throw e;
        }
      }}
    />
  );
}
