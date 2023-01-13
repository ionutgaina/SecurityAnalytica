import { register } from '../../../common/api/auth';
import { IUserRegister } from '../../../common/api/auth';
import { REQUIRED } from '../../../common/constants';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { CustomForm } from '../../../common/components/CustomForm/CustomForm';

interface ISignInFormProps {
  onhideSignUpModal: () => void;
  showLoginModal: () => void;
}

export default function SignInForm(props: ISignInFormProps) {
  return (
    <CustomForm
      fields={[
        {
          name: 'userEmail',
          initialValue: '',
          label: 'Email',
          type: 'email',
          placeholder: '',
          validation: Yup.string()
            .email('Email is invalid')
            .matches(RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'), 'Email is invalid')
            .max(100, 'Max 100 characters')
            .required(REQUIRED),
        },
        {
          name: 'username',
          initialValue: '',
          label: 'Username',
          type: 'text',
          placeholder: '',
          validation: Yup.string()
            .max(100, 'Max 100 characters')
            .required(REQUIRED),
        },
        {
          name: 'password',
          initialValue: '',
          label: 'Password',
          type: 'password',
          placeholder: '',
          validation: Yup.string()
            .min(8, 'Min 8 characters')
            .max(255, 'Max 255 characters')
            .required(REQUIRED),
        },
        {
          name: 'password_confirmation',
          initialValue: '',
          label: 'Password confirmation',
          type: 'password',
          placeholder: '',
          validation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required(REQUIRED),
        },
        {
          name: 'name',
          initialValue: '',
          label: 'Name',
          type: 'text',
          placeholder: '',
          validation: Yup.string()
            .max(100, 'Max 100 characters')
            .notRequired()
        },
        {
          name: 'desc',
          initialValue: '',
          label: 'Description',
          type: 'text',
          component: 'textarea',
          placeholder: '',
          validation: Yup.string()
            .max(1000, 'Max 1000 characters')
            .notRequired()
        },
      ]}
      submitButtonText="Submit"
      onSubmit={async (values: IUserRegister) => {
        try {
          await register(values);

          // success message
          const response =
            'Register successful.';

          Swal.fire({
            title: response,
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
          }).then(() => {
            props.onhideSignUpModal();
            props.showLoginModal();
          });
        } catch (e: any) {
          // Error message
          console.log(e);
          let response = e.response?.data?.statusMessage
          response = response.replace("[Error] ", "");

          Swal.fire({
            title: response,
            icon: 'error',
            timer: 5000,
            showConfirmButton: false,
          });

          throw e;
        }
      }}
    />
  );
}